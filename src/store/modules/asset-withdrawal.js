import {setIsLoading, setError} from "../constants";
import axios, {ASSET_WITHDRAWAL_URL, turnObjectToQueryString} from "../api";
import { commitError, handleNoIDError, stopLoadingAndResolve, resolveWithDataFromStore } from "./app";
import { debug } from "../../utility";
import assetWithdrawalStore from "../normalized-api/asset-withdrawal";
import event,{ EVENT_TYPE } from "../../utility/event";

const initCache = {
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    currentPage:{
        ids:[],
        pagination:{},
        url:""
    },
};

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
        /**
         * @param {AssetWithdrawalState} state
         */
        isLoading:(state)=>state.isLoading,
        /**
         * @param {AssetWithdrawalState} state
         */
        error:(state)=>state.error
    },
    mutations:{
        /**
         * @param {AssetWithdrawalState} state
         */
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },

    actions:{
        fetchAllAssetWithdrawalData({ commit }, {reload=false, query={}}={}){
            const url = ASSET_WITHDRAWAL_URL.index + "?" + turnObjectToQueryString(query);

            debug("url", url);
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //fetch role type from cache
                const cacheAssetWithdrawal = assetWithdrawalStore.getManyAssetWithdrawalByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cacheAssetWithdrawal) {
                    return resolveWithDataFromStore(commit, {
                        assetWithdrawals:cacheAssetWithdrawal,
                    });
                }//end if(assetWithdrawalRoles)
            }//end if(!reload && assetWithdrawalData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
            
            return axios.get(url)
            .then(resp=>{
                const {success, data:{assetWithdrawals}, pagination} = resp.data
                
                if (success){
                    cache.currentPage = {
                        ids:assetWithdrawalStore.addAssetWithdrawal(assetWithdrawals), 
                        url
                    };
                    
                    return {assetWithdrawals, pagination};
                }
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getOneAssetWithdrawal({ commit }, id){
            //ensure asset withdrawal id is supplied
            if(!id) return handleNoIDError(commit, "Asset Withdrawal ID is required");
            //get ass with from store
            //const assetWithdrawal = assetWithdrawalStore.getAssetWithdrawalByID(id);
            
            //if ass with is already in store
            // if(assetWithdrawal){
            //     return resolveWithDataFromStore(commit, assetWithdrawal);
            // }//end if(paymentType)

            //
            commit(setIsLoading, true);
            return axios.get(ASSET_WITHDRAWAL_URL.get_one + id)
            
            .then(resp=>{
                const {data:assetWithdrawal} = resp.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                assetWithdrawalStore.addAssetWithdrawal(assetWithdrawal);
                
                return assetWithdrawal;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },
        
        saveAssetWithdrawal({ commit }, formData){
            return axios.post(ASSET_WITHDRAWAL_URL.save_asset_withdrawal, formData)
            .then(response=>{
                debug("asset withdrawal", response);
                const {data, success, msg} = response.data;
                
                return {data, success, msg};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        updateAssetWithdrawal({ commit }, {formData, asset_withdrawal_id}){
            if(!asset_withdrawal_id) return handleNoIDError(commit, "asset withdrawal id is required");

            return axios.put(ASSET_WITHDRAWAL_URL.update_asset_withdrawal + asset_withdrawal_id, formData)
            .then(response=>{
                debug("asset withdrawal", response);
                const {data, success, msg} = response.data;
                
                return {data, success, msg};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        removeAssetWithdrawal({ commit }, asset_withdrawal_id){
            if(!asset_withdrawal_id) return handleNoIDError(commit, "asset withdrawal id is required");

            return axios.delete(ASSET_WITHDRAWAL_URL.delete_asset_withdrawal + asset_withdrawal_id)
            .then(response=>{
                debug("asset withdrawal", response);
                const {data, success, msg} = response.data;
                
                return {data, success, msg};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },
        
    }
}