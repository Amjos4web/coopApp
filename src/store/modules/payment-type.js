import {setIsLoading, setError} from "../constants";
import paymentTypeStore from "../normalized-api/payment-types";
import axios, { PAYMENT_TYPE_URL } from "../api";
import { commitError, handleNoIDError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import event,{ EVENT_TYPE } from "../../utility/event";

const initCache = {
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    currentPage:{
        ids:[],
        url:""
    },
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
        getPaymentTypes({ commit }, reload){
            const url = PAYMENT_TYPE_URL.index;
            debug("url", url);
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //fetch payment type from cache
                const cachePaymentTypes = paymentTypeStore.getManyPaymentTypeByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cachePaymentTypes) {
                    return resolveWithDataFromStore(commit, {
                        paymentTypes:cachePaymentTypes, 
                    });
                }//end if(cachePaymentTypes)
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(url)
            .then(resp=>{
                const {paymentTypes} = resp.data.data
                
                cache.currentPage = {
                    ids:paymentTypeStore.addPaymentTypeList(paymentTypes), 
                    url
                };
                return {paymentTypes};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getOnePaymentType({ commit }, id){
            //ensure payment type id is supplied
            if(!id) return handleNoIDError(commit, "Payment Type ID is required");
            //get payment type from store
            const paymentType = paymentTypeStore.getPaymentTypeByID(id);
            //if payment type is already in store
            if(paymentType){
                return resolveWithDataFromStore(commit, paymentType);
            }//end if(paymentType)

            //
            commit(setIsLoading, true);

            return axios.get(PAYMENT_TYPE_URL.get_one + id)
            .then(resp=>{
                const {data:paymentType} = resp.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                paymentTypeStore.addPaymentType(paymentType);
                return paymentType;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        addNewPaymentType({ commit }, formData){
            commit(setIsLoading, true)
        
            return axios.post(PAYMENT_TYPE_URL.add_new_payment_type, formData)
            .then(resp=>{
                //get payment type from response
                const {data:{paymentType}} = resp.data;
                //debug
                debug("paymentType", paymentType);
                //cache payment type on client
                //add ID to the front of the current page for user to see the newly added
                //data
                const id = paymentTypeStore.addPaymentType(paymentType);
        
                debug("newly added payment type to store return id", id);
                //am putting it at the front to show client that the newly added payment type has been saved
                cache.currentPage.ids.unshift(id);
                //return payment types to client
                return paymentType;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        updatePaymentType({ commit }, {id=null, formData={}} = {}){
            //ensure payment type id is supplied
            if(!id) return handleNoIDError(commit, "Payment Type ID is required");

            commit(setIsLoading, true)

            return axios.put(PAYMENT_TYPE_URL.update_payment_type + id, formData)
            .then(resp=>{
                //get payment type from response
                const {data:{paymentType}} = resp.data;
                //debug
                debug("updated paymentType", paymentType);
                //no need to save id cos the id already exits in store,

                paymentTypeStore.addPaymentType(paymentType);
                //return payment types to client
                return paymentType;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        fetchManyPaymentTypes({commit }, paramIDs=[]){

            commit(setIsLoading, true)
            return axios.get(
                PAYMENT_TYPE_URL.fetch_many_payment_types + '?'+'paramIDs=' + encodeURIComponent(JSON.stringify(paramIDs))
            ).then(response=>{
                debug("fetching many payment types", response)

                //stop loading
                commit(setIsLoading, false);
                
                return {paymentTypes:response.data.data}
            })
            .catch(e=>{
                //stop loading
                commit(setIsLoading, false);
                throw e;
            });
        }
    }//end action
}//end module
