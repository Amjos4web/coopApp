import {setIsLoading, setError} from "../constants";
import loanStore from "../normalized-api/society-loan";

import axios, {SOCIETY_LOAN_URL, turnObjectToQueryString} from "../api";
import { debug } from "../../utility";
import { stopLoadingAndResolve, commitError, handleNoIDError, resolveWithDataFromStore } from "./app";
import loanPaymentHistoryStore from "../normalized-api/society-loan-payment-hist";
import loanAmountGivenHistoryStore from "../normalized-api/society-loan-amount-given-hist";
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
}

let cache = initCache;

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    cache = initCache;
    debug("cleaning up", cache);
});

function getLoans(reload, commit, fromAdmin, query){
    const url = (
        fromAdmin 
        ? SOCIETY_LOAN_URL.index 
        : SOCIETY_LOAN_URL.get_society_loan_4_society_delegate
    ) + "?" + turnObjectToQueryString(query);
    console.log(url);
    
    //if not to reload and data has already being cache fo this query
    if(!reload && cache.currentPage.url === url){
        //const ids = cache.currentPage.ids;
        //fetch loan from cache
        const cacheLoans = loanStore.getManySocietyLoanByIDArray(cache.currentPage.ids);
        //if cache data is not null
        if(cacheLoans) {
            return resolveWithDataFromStore(commit, {
                societyLoans:cacheLoans, 
                pagination:cache.currentPage.pagination
            });
        }//end if(cacheLoans)
    }//end if(!reload && cacheData)

    //notify UI we are currently loading
    commit(setIsLoading, true);

    return axios.get(url)
    .then(resp=>{
        const {success, data:{societyLoans}, pagination} = resp.data
        if(success){
            cache.currentPage = {
                ids:loanStore.addSocietyLoanList(societyLoans), 
                pagination,
                url
            };
            return {societyLoans, pagination};
        }
        commitError(commit, null);
    })
    .catch(e=>commitError(commit, e))
    .then(data=>stopLoadingAndResolve(commit, data));
}

function saveLoanRequest(commit, formData){
    commit(setIsLoading, true)

    return axios.post(SOCIETY_LOAN_URL.save_loan_from_admin, formData)
    .then(resp=>{
        //get loan request and its guarantor from response
        const {data:{societyLoan}} = resp.data;
        //debug-----------------------
        debug("loan request", societyLoan);
        //cache loan request on client
        //add ID to the front of the current page for user to see the newly added
        //data
        const id = loanStore.addSocietyLoan(societyLoan);

        debug("newly added request to store", id);
        //am putting it at the front to show client that the newly added request has been saved
        cache.currentPage.ids.unshift(id);
        //return loan request and its guarantors to client
        return {societyLoan};
    })
    .catch(e=>commitError(commit, e))
    .then((data)=>stopLoadingAndResolve(commit, data))
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
            return resolveWithDataFromStore(commit, {societyLoanPaymentHistory:histories});
        }
    }//end if

    //notify UI we are loading from server
    //notify UI we are currently loading
    commit(setIsLoading, true);

    const url = (
        fromAdmin 
        ? SOCIETY_LOAN_URL.get_society_loan_payment_history_4_admin 
        : SOCIETY_LOAN_URL.get_society_loan_payment_history_4_delegate
    )
    return axios.get(url + loanRequestID)
    .then(resp=>{
        const {societyLoanPaymentHistory} = resp.data.data

        cache.loanPaymentHistory[loanRequestID] = loanPaymentHistoryStore.addLoanPaymentHistory(
            societyLoanPaymentHistory
        );
        return societyLoanPaymentHistory;
    })
    .catch(e=>commitError(commit, e))
    .then(data=>stopLoadingAndResolve(commit, data));
}

function getSocietyAmountGivenHistory(commit, loanRequestID=null, reload=false, fromAdmin = false){
    //ensure loan request id is supplied
    if(!loanRequestID) return handleNoIDError(commit, "Loan Request ID is required");

    if(!reload && cache.loanAmountGivenHistory[loanRequestID]){
        const loanAmtGivenHist = loanAmountGivenHistoryStore.getManyLoanAmountGivenHistoryByIDArray(
            cache.loanAmountGivenHistory[loanRequestID]
        );

        if(loanAmtGivenHist) return resolveWithDataFromStore(commit, loanAmtGivenHist);
    }//end if

    commit(setIsLoading, true)

    return axios.get(
        fromAdmin 
        ? (SOCIETY_LOAN_URL.get_amount_given_history_4_admin + loanRequestID)
        : (SOCIETY_LOAN_URL.get_amount_given_history_4_del + loanRequestID )
    )
    .then(resp=>{
        const {amountGivenHistory} = resp.data.data;
        cache.loanAmountGivenHistory[loanRequestID] = loanAmountGivenHistoryStore.addLoanAmountGivenHistoryList(
            amountGivenHistory
        );
        return amountGivenHistory;
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

        getLoanIndexForDelegate({ commit }, {reload = false, query={}} = {}){
            return getLoans(reload, commit, false, query)
        },

        getOneLoan({ commit }, id){
            //ensure loan request id is supplied
            if(!id) return handleNoIDError(commit, "Loan Request ID is required");
            //get loan from store
            const loan = loanStore.getSocietyLoanByID(id);
            //if loan is already in store
            if(loan){
                return resolveWithDataFromStore(commit, loan);
            }//end if(loan)

            //
            commit(setIsLoading, true);

            return axios.get(SOCIETY_LOAN_URL.get_one + id)
            .then(resp=>{
                const {societyLoan} = resp.data.data;
                loanStore.addSocietyLoan(societyLoan);
                return societyLoan;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },//end method

        saveLoanRequestFromAdmin({ commit }, formData={}){
            return saveLoanRequest(commit, formData, false);
        },

        updateLoanInterestRate({ commit }, {loan_request_id=null, interest_rate=null}={}){
            //ensure loan request id is supplied
            if(!loan_request_id) return handleNoIDError(commit, "Loan Request ID is required");
            commit(setIsLoading, true);

            return axios.put(
                SOCIETY_LOAN_URL.admin_update_loan_interest + loan_request_id, 
                {interest_rate}
            )
            .then(resp=>{
                const {societyLoan} = resp.data.data;
                loanStore.addSocietyLoan(societyLoan);
                return societyLoan;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        getLoanPaymentHistoryForDelegate({commit}, {reload=false, loanRequestID=null}={}){
            return loanPaymentHistory(commit, loanRequestID, reload, false);
        },

        getLoanPaymentHistoryForAdmin({commit}, {reload=false, loanRequestID=null}={}){
            return loanPaymentHistory(commit, loanRequestID, reload, true);
        },

        getLoanAmountGivenHistoryForAdmin({commit}, {reload=false, loanRequestID=null} = {}){
            return getSocietyAmountGivenHistory(commit, loanRequestID, reload, true)
        },//end method

        getLoanAmountGivenHistoryForDelegate({commit}, {reload=false, loanRequestID=null} = {}){
            return getSocietyAmountGivenHistory(commit, loanRequestID, reload, false)
        },//end method

        updateLoanAmountGivenHistory({ commit }, {formData={}, loanAmountGivenHistoryID=null} = {}){
            if(!loanAmountGivenHistoryID){
                return handleNoIDError(commit, "Loan amount given history ID is required");
            }
            commit(setIsLoading, true);

            return axios.put(
                (SOCIETY_LOAN_URL.admin_edit_society_loan_amount + loanAmountGivenHistoryID), 
                formData
            )
            .then(resp=>{
                const {societyLoanAmountGivenHistory} = resp.data.data;
                loanAmountGivenHistoryStore.addLoanAmountGivenHistory(societyLoanAmountGivenHistory);
                return societyLoanAmountGivenHistory;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        giveMoreLoanToSociety({ commit }, {formData={}, loanRequestID=null} = {}){
            if(!loanRequestID){
                return handleNoIDError(commit, "Loan request ID is required");
            }

            commit(setIsLoading, true);

            return axios.put((SOCIETY_LOAN_URL.admin_add_to_society_loan_amount + loanRequestID), formData)
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
    }//end actions
}