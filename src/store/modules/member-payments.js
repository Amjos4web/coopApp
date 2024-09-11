import {setIsLoading, setError} from "../constants";
import axios, {MEMBER_PAYMENT_URL} from "../api";
import { commitError, handleNoIDError, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";


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
         * @param {MemberState} state
         */
        isLoading:(state)=>state.isLoading,
        /**
         * @param {MemberState} state
         */
        error:(state)=>state.error
    },
    mutations:{
        /**
         * @param {MemberState} state
         */
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },

    actions:{
        saveMemberPayment({ commit }, formData){
            return axios.post(MEMBER_PAYMENT_URL.save_member_payment, formData)
            .then(response=>{
                debug("member payments", response);
                const {memberPaymentList} = response.data.data;

                return {memberPaymentList};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },
        fetchMemberMonthlyPayment({ commit }, {society_id=null, member_id=null} = {}){
            if(!society_id) return handleNoIDError(commit, "ID of society to which member belongs is required.");
            if(!member_id) return handleNoIDError(commit, "ID of member is required.");

            commit(setIsLoading, true);

            return axios.get(MEMBER_PAYMENT_URL.fetch_member_monthly_payment + society_id + "/" + member_id)
            .then(response=>{
                debug("member payment monthly due", response)
                const {memberPaymentDueList} = response.data.data;
                return {memberPaymentDueList};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },
        fetchMemberTotalAsset({commit}, {society_id=null, member_id=null} = {}){
            if(!society_id) return handleNoIDError(commit, "ID of society to which member belongs is required.");
            if(!member_id) return handleNoIDError(commit, "ID of member is required.");

            commit(setIsLoading, true)

            return axios.get(MEMBER_PAYMENT_URL.fetch_member_total_asset + society_id + "/" + member_id)
            .then(response=>{
                debug("member total assest", response)
                const {totalAsset} = response.data.data;
                return {totalAsset};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },
        fetchMyTotalAsset({ commit }, society_id){
            if(!society_id) return handleNoIDError(commit, "ID of society to which member belongs is required.");
            return axios.get(MEMBER_PAYMENT_URL.fetch_my_total_asset + society_id)
            .then(response=>{
                debug("member total assest", response)
                const {totalAsset} = response.data.data;
                return {totalAsset};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },
        //fetch many member total assets
        fetchManyMemberTotalAssets({ commit }, paramIDs=[]){
            return axios.post(
                MEMBER_PAYMENT_URL.fetch_many_member_total_assets, 
                {paramIDs}
            ).then(response=>{
                debug("fetching many society", response)
                //stop loading
                commit(setIsLoading, false)

                return response.data.data
            })
            .catch(e=>{
                //stop loading
                commit(setIsLoading, false);
                throw e;
            });
        },//end method
    }
}