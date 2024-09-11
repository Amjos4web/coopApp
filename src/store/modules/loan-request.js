import {setIsLoading, setError} from "../constants";
import loanStore from "../normalized-api/loan-request";
import guarantorStore from "../normalized-api/guarantor";
import axios, {LOAN_URL, turnObjectToQueryString} from "../api";
import { debug } from "../../utility";
import { stopLoadingAndResolve, commitError, handleNoIDError, resolveWithDataFromStore } from "./app";
import loanPaymentHistoryStore from "../normalized-api/loan-payment-history";
import loanAmountGivenHistoryStore from "../normalized-api/loan-amount-given-history";
import event, {EVENT_TYPE} from "../../utility/event";

//use to cache page that has been loaded
//use along with query string to cache data fetch for a particular query string
const initCache = {
    guarantors:{},
    loanPaymentHistory:{},
    loanAmountGivenHistory:{},
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    currentPage:{
        ids:[],
        pagination:{},
        url:""
    },
    memberLoanGuarantorReqList:[],
}

let cache = initCache;

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    cache = initCache;
    debug("cleaning up", cache);
});

function getLoans(reload, commit, fromAdmin, query){
    const url = (
        fromAdmin 
        ? LOAN_URL.index 
        : LOAN_URL.get_my_loan_requests 
    ) + "?" + turnObjectToQueryString(query);
    
    //if not to reload and data has already being cache fo this query
    if(!reload && cache.currentPage.url === url){
        //const ids = cache.currentPage.ids;
        //fetch loan from cache
        const cacheLoans = loanStore.getManyLoanByIDArray(cache.currentPage.ids);
        //if cache data is not null
        if(cacheLoans) {
            return resolveWithDataFromStore(commit, {
                loanRequests:cacheLoans, 
                pagination:cache.currentPage.pagination
            });
        }//end if(cacheLoans)
    }//end if(!reload && cacheData)

    //notify UI we are currently loading
    commit(setIsLoading, true);

    return axios.get(url)
    .then(resp=>{
        const {success, data:{loanRequests}, pagination} = resp.data
        if(success){
            cache.currentPage = {
                ids:loanStore.addLoanList(loanRequests), 
                pagination,
                url
            };
            return {loanRequests, pagination};
        }
        commitError(commit, null);
    })
    .catch(e=>commitError(commit, e))
    .then(data=>stopLoadingAndResolve(commit, data));
}

function saveLoanRequest(commit, formData, fromMember=true){
    commit(setIsLoading, true)

    return axios.post(
        (
            fromMember 
            ? LOAN_URL.save_loan_from_member 
            : LOAN_URL.save_loan_from_admin
        ), formData
    )
    .then(resp=>{
        //get loan request and its guarantor from response
        const {data:{loanRequest, guarantors}} = resp.data;
        //debug
        debug("loan request", loanRequest, ...guarantors);
        //cache loan request on client
        //add ID to the front of the current page for user to see the newly added
        //data
        const id = loanStore.addLoan(loanRequest);

        debug("newly added request to store", id);
        //am putting it at the front to show client that the newly added request has been saved
        cache.currentPage.ids.unshift(id);
        
        //cache guarators
        cache.guarantors[loanRequest.id] = guarantorStore.addGuarantorList(guarantors);
        //return loan request and its guarantors to client
        return {loanRequest, guarantors};
    })
    .catch(e=>commitError(commit, e))
    .then((data)=>stopLoadingAndResolve(commit, data))
}

function getLoanGuarantors(reload, commit, loanRequestID, fromAdmin){
    //ensure loan request id is supplied
    if(!loanRequestID) return handleNoIDError(commit, "Loan Request ID is required");
    //if this is true the guarantor are already cached
    //if no need to refetch from serve try to fetch from cache
    if(cache.guarantors[loanRequestID] && !reload){
        //fetch guarantors from store
        const guarantors = guarantorStore.getManyGuarantorByIDArray(cache.guarantors[loanRequestID]);
        /**
         * I return null if cache cannot find enough data for all store guarantor list sent to it
         */
        if(guarantors){
            return resolveWithDataFromStore(commit, {guarantors});
        }
    }//end if

    //we need to go to server for the data
    //notify client that we are loading
    commit(setIsLoading, true);
    
    const url = (
        fromAdmin 
        ? LOAN_URL.get_guarantors_4_admin 
        : LOAN_URL.get_guarantors_4_member
    ) + loanRequestID;

    return axios.get(url)
    .then(resp=>{
        debug("guarantor", resp)
        //get guarantor
        const {guarantors} = resp.data.data;
        //cache it
        cache.guarantors[loanRequestID] = guarantorStore.addGuarantorList(guarantors);
        //return caller
        return {guarantors};
    })
    .catch(e=>commitError(commit, e))
    .then(data=>stopLoadingAndResolve(commit, data));
}

function respondToLoanGuarantorRequest(commit, formData, fromAdmin){
    commit(setIsLoading, true);

    return axios.post(
        (
            fromAdmin 
            ? LOAN_URL.admin_respond_to_loan_guarator_req
            : LOAN_URL.member_respond_to_loan_guarator_req
        ),
        formData
    )
    .then(resp=>{
        //get the guarantor
        const {guarantor} = resp.data.data;
        //add to cache, no need to store the guarantor again
        //it must have been store when requested from server
        guarantorStore.addGuarantor(guarantor);
        //return guarantor back to caller
        return guarantor;
    })
    .catch(e=>{
        // console.error(e)
        commitError(commit, e)
    })
    .then(data=>stopLoadingAndResolve(commit, data));
}

function loanPaymentHistory(commit, loanRequestID, reload, fromAdmin){
    //ensure loan request id is supplied
    if(!loanRequestID) return handleNoIDError(commit, "Loan Request ID is required");

    //if this is true the loan payment history are already cached
    //if no need to refetch from serve try to fetch from cache
    if(!reload && cache.loanPaymentHistory[loanRequestID]){
        //fetch loan payment history from store
        const histories = loanPaymentHistoryStore.getLoanPaymentHistoryByID(
            cache.loanPaymentHistory[loanRequestID]
        );
        /**
         * I return null if cache cannot find enough data for all store loan payment history list sent to it
         */
        if(histories){
            return resolveWithDataFromStore(commit, {loanPaymentHistory:histories});
        }
    }//end if

    //notify UI we are loading from server
    //notify UI we are currently loading
    commit(setIsLoading, true);

    const url = fromAdmin ? LOAN_URL.admin_loan_payment_history :LOAN_URL.member_loan_payment_history
    return axios.get(url + loanRequestID)
    .then(resp=>{
        const {loanPaymentHistory} = resp.data.data

        cache.loanPaymentHistory[loanRequestID] = loanPaymentHistoryStore.addLoanPaymentHistory(
            loanPaymentHistory
        );
        return loanPaymentHistory;
    })
    .catch(e=>commitError(commit, e))
    .then(data=>stopLoadingAndResolve(commit, data));
}

export default {
    namespaced:true,
    state:{
        isLoading:false,
        error:null,
    },
    getters:{
        isLoading:(state)=>state.isLoading,
        error:(state)=>state.error,
    },
    mutations:{
        [setIsLoading]:(state, loadingState)=>(state.isLoading = loadingState),
        [setError]:(state, error)=>(state.error = error),
    },
    actions:{
        loanIndex({ commit }, {reload=false, query={}}={}){
            return getLoans(reload, commit, true, query)
        },//end index page

        getOneLoan({ commit }, id){
            //ensure loan request id is supplied
            if(!id) return handleNoIDError(commit, "Loan Request ID is required");
            //get loan from store
            const loan = loanStore.getLoanByID(id);
            //if loan is already in store
            if(loan){
                return resolveWithDataFromStore(commit, loan);
            }//end if(loan)

            //
            commit(setIsLoading, true);

            return axios.get(LOAN_URL.get_one + id)
            .then(resp=>{
                const {loanRequest} = resp.data.data;
                if(loanRequest){
                    loanStore.addLoan(loanRequest);
                }
                return loanRequest;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },//end method

        saveLoanRequestFromAdmin({ commit }, formData={}){
            return saveLoanRequest(commit, formData, false);
        },

        saveLoanRequestFromMember({ commit }, formData={}){
            return saveLoanRequest(commit, formData, true);
        },

        getAllMyLoan({ commit }, { reload=false, query={} }={}){
            return getLoans(reload, commit, false, query)
        },

        getGuarantorForMember({ commit }, {reload=false, loanRequestID=null}={}){
            return getLoanGuarantors(reload, commit, loanRequestID, false);
        },

        getGuarantorForAdmin({ commit }, {reload=false, loanRequestID=null}={}){
            return getLoanGuarantors(reload, commit, loanRequestID, true);
        },

        memberRespondToGuarantorRequest({ commit }, formData){
            return respondToLoanGuarantorRequest(commit, formData, false);
        },

        adminRespondToGuarantorRequest({ commit }, formData){
            return respondToLoanGuarantorRequest(commit, formData, true);
        },

        updateLoanInterestRate({ commit }, {loan_request_id=null, interest_rate=null}={}){
            //ensure loan request id is supplied
            if(!loan_request_id) return handleNoIDError(commit, "Loan Request ID is required");
            commit(setIsLoading, true);

            return axios.put(
                LOAN_URL.admin_update_loan_interest + loan_request_id, 
                {interest_rate}
            )
            .then(resp=>{
                const {loanRequest} = resp.data.data;
                loanStore.addLoan(loanRequest);
                return loanRequest;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        getLoanPaymentHistoryForMember({commit}, {reload=false, loanRequestID=null}={}){
            return loanPaymentHistory(commit, loanRequestID, reload, false);
        },

        getLoanPaymentHistoryForAdmin({commit}, {reload=false, loanRequestID=null}={}){
            return loanPaymentHistory(commit, loanRequestID, reload, true);
        },

        loanAmountGivenHistory({commit}, {reload=false, loanRequestID=null} = {}){
            //ensure loan request id is supplied
            if(!loanRequestID) return handleNoIDError(commit, "Loan Request ID is required");

            if(!reload && cache.loanAmountGivenHistory[loanRequestID]){
                const loanAmtGivenHist = loanAmountGivenHistoryStore.getManyLoanAmountGivenHistoryByIDArray(
                    cache.loanAmountGivenHistory[loanRequestID]
                );

                if(loanAmtGivenHist) return resolveWithDataFromStore(commit, loanAmtGivenHist);
            }//end if

            commit(setIsLoading, true)

            return axios.get(LOAN_URL.loan_amount_given_history + loanRequestID)
            .then(resp=>{
                const {amountGivenHistory} = resp.data.data;
                cache.loanAmountGivenHistory[loanRequestID] = loanAmountGivenHistoryStore.addLoanAmountGivenHistoryList(
                    amountGivenHistory
                );
                return amountGivenHistory;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },//end method

        updateLoanAmountGivenHistory({ commit }, {formData={}, loanAmountGivenHistoryID=null} = {}){
            if(!loanAmountGivenHistoryID){
                return handleNoIDError(commit, "Loan amount given history ID is required");
            }
            commit(setIsLoading, true);

            return axios.put(
                (LOAN_URL.update_loan_amount_given_history + loanAmountGivenHistoryID), 
                formData
            )
            .then(resp=>{
                const {loanAmountGivenHistory} = resp.data.data;
                loanAmountGivenHistoryStore.addLoanAmountGivenHistory(loanAmountGivenHistory);
                return loanAmountGivenHistory;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        changeLoanStatusToPending({commit}, loanRequestID=null){
            if(!loanRequestID){
                return handleNoIDError(commit, "Loan request ID is required");
            }
            commit(setIsLoading, true);

            return axios.put((LOAN_URL.change_loan_status_to_pending + loanRequestID), {})
            .then(resp=>{
                const {loanRequest} = resp.data.data;
                loanStore.addLoan(loanRequest);
                return loanRequest;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        giveMoreLoanToMember({ commit }, {formData={}, loanRequestID=null} = {}){
            if(!loanRequestID){
                return handleNoIDError(commit, "Loan request ID is required");
            }

            commit(setIsLoading, true);

            return axios.put((LOAN_URL.give_more_loan_member + loanRequestID), formData)
            .then(resp=>{
                const {loanAmountGivenHistory} = resp.data.data;
                const result = loanAmountGivenHistoryStore.addLoanAmountGivenHistory(
                    loanAmountGivenHistory
                );

                debug("newly added loan amount given", result);

                if(cache.loanAmountGivenHistory[loanRequestID]){
                    cache.loanAmountGivenHistory[loanRequestID].unshift(result);
                }else{
                    cache.loanAmountGivenHistory[loanRequestID] = [result];
                }
                return loanAmountGivenHistory;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        adminRespondToLoanRequest({ commit }, formData){
            
            commit(setIsLoading, true)

            return axios.post(LOAN_URL.admin_respond_to_loan_req, formData)
            .then(resp=>{
                debug("adminRespondToLoanReq", resp)
                const {
                    loanRequest,
                    loanRequestAmountGivenHistory
                } = resp.data.data;
                //no need to save ID, since its already cache
                loanStore.addLoan(loanRequest);

                const loanAmountGivenHistoryID = loanAmountGivenHistoryStore.addLoanAmountGivenHistory(
                    loanRequestAmountGivenHistory
                )
                const loanRequestID = loanRequest.id
                if(cache.loanAmountGivenHistory[loanRequestID]){
                    cache.loanAmountGivenHistory[loanRequestID].unshift(loanAmountGivenHistoryID);
                }else{
                    cache.loanAmountGivenHistory[loanRequestID] = [loanAmountGivenHistoryID];
                }
                return loanRequest;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getAllMyLoanGuarantorRequest({ commit }, reload){
            //get_all_my_loan_guarantor_req
            if(!reload){
                if(cache.memberLoanGuarantorReqList.length > 0){
                    const cachedGuarantor = guarantorStore.getManyGuarantorByIDArray(cache.memberLoanGuarantorReqList);
                    //debug()
                    if(cachedGuarantor){
                        return resolveWithDataFromStore(commit, {guarantors:cachedGuarantor})
                    }//end if
                }
            }//end if

            return axios.get(LOAN_URL.get_all_my_loan_guarantor_req)
            .then(resp=>{
                debug("loan guarantor request", resp)
                const {guarantors} = resp.data.data

                cache.memberLoanGuarantorReqList = guarantorStore.addGuarantorList(guarantors)

                return {guarantors};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },
        
        getLoanDurationForAdmin({commit}, loanRequestID=null){
            if(!loanRequestID){
                return handleNoIDError(commit, "Loan request ID is required");
            }
            commit(setIsLoading, true);

            return axios.get((LOAN_URL.get_loan_duration_for_admin + loanRequestID), {})
            .then(resp=>{
                const {loanDuration} = resp.data.data;
                return {loanDuration};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getLoanDurationForMember({commit}, loanRequestID=null){
            if(!loanRequestID){
                return handleNoIDError(commit, "Loan request ID is required");
            }
            commit(setIsLoading, true);

            return axios.get((LOAN_URL.get_loan_duration_for_member + loanRequestID), {})
            .then(resp=>{
                const {loanRequest} = resp.data.data;
                return {loanRequest};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },//end methods
    }//end actions
}