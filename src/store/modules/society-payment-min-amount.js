import {setIsLoading, setError} from "../constants";
import societyPaymentMinAmountStore from "../normalized-api/society-minimum-payment-amount";
//import {fetchManySingleton} from "../helpers"
import axios, { SOCIETY_PAY_MIN_AMOUNT } from "../api";
import { commitError, handleNoIDError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import event,{ EVENT_TYPE } from "../../utility/event";

const initCache = {
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    societyIDs:{}
}

let cache = initCache;

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    cache = initCache;
    debug("cleaning up", cache);
});

export default{
    namespaced:true,
    
    state:{
        
        //network request loading status
        isLoading:false,
        //
        error:null,
    },
    getters:{
       
        isLoading:(state)=>state.isLoading,
        
        error:(state)=>state.error
    },
    mutations:{
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },
    actions:{
        getSocietyPaymentsMinAmount({ commit }, {reload, society_id}){
            if(!society_id) return handleNoIDError(commit, "Society ID is required");

            //if not to reload and data has already being cache fo this query
            if(!reload && cache.societyIDs[society_id]){
                //fetch society payment minimum amount from cache
                const cacheSocietyPaymentMinAmounts = societyPaymentMinAmountStore.getManySocietyPaymentMinAmountByIDArray(
                    cache.societyIDs[society_id]
                );
                //if cache data is not null
                if(cacheSocietyPaymentMinAmounts) {
                    return resolveWithDataFromStore(commit, {
                        societyPaymentMinAmounts:cacheSocietyPaymentMinAmounts, 
                    });
                }//end if(societyPaymentMinAmounts)
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(SOCIETY_PAY_MIN_AMOUNT.get_society_pay_min_amounts + society_id)
            .then(resp=>{
                const {societyPaymentMinAmounts} = resp.data.data
                cache.societyIDs[society_id] = societyPaymentMinAmountStore.addSocietyPaymentMinAmountList(
                    societyPaymentMinAmounts
                )
                return {societyPaymentMinAmounts};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getOneSocietyPaymentMinAmount({ commit }, id){
            //ensure society payment minimum amount id is supplied
            if(!id) return handleNoIDError(commit, "Society payment minimum amount ID is required");
            //get society payment minimum amount from store
            const societyPaymentMinAmount = societyPaymentMinAmountStore.getSocietyPaymentMinAmountByID(id);
            
            //if societyPaymentMinAmount is already in store
            if(societyPaymentMinAmount){
                return resolveWithDataFromStore(commit, societyPaymentMinAmount);
            }//end if(societyPaymentMinAmount)

            //
            commit(setIsLoading, true);

            return axios.get(SOCIETY_PAY_MIN_AMOUNT.get_one + id)
            .then(resp=>{
                const {societyPaymentMinAmount} = resp.data.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                societyPaymentMinAmountStore.addSocietyPaymentMinAmount(societyPaymentMinAmount);
                return societyPaymentMinAmount;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        addNewSocietyPaymentMinAmount({ commit }, formData = {}){
            if(!formData.society_id){
                return handleNoIDError(commit, "Society ID is required");
            }

            commit(setIsLoading, true)
        
            return axios.post(SOCIETY_PAY_MIN_AMOUNT.add_new, formData)
            .then(resp=>{
                //get societyPaymentMinAmount type from response
                const {data:{societyPaymentMinAmount}} = resp.data;
                //debug
                debug("societyPaymentMinAmount", societyPaymentMinAmount);
                //cache societyPaymentMinAmount type on client
                //add ID to the front of the current page for user to see the newly added
                //data
                const id = societyPaymentMinAmountStore.addSocietyPaymentMinAmount(societyPaymentMinAmount);

                debug("newly added society min amount to store return id", id);
                if(cache.societyIDs[formData.society_id]){
                    //am putting it at the front to show client that the newly added society payment minimum amount has been saved
                    cache.societyIDs[formData.society_id].unshift(id);
                }
                
                //return society payment minimum amount to client
                return societyPaymentMinAmount;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        updateSocietyPaymentMinimumAmount({ commit }, {id=null, formData={}} = {}){
            //ensure society minium amount id is supplied
            if(!id) return handleNoIDError(commit, "society minium amount ID is required");

            commit(setIsLoading, true)

            return axios.put(SOCIETY_PAY_MIN_AMOUNT.update + id, formData)
            .then(resp=>{
                //get society payment min amount from response
                const {data:{societyPaymentMinAmount}} = resp.data;
                //debug
                debug("updated societyPaymentMinAmount", societyPaymentMinAmount);
                //no need to save id cos the id already exits in store,
                societyPaymentMinAmountStore.addSocietyPaymentMinAmount(societyPaymentMinAmount);
                //return society min amount types to client
                return societyPaymentMinAmount;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },
    }//end action
}//end module
