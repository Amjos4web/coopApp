import {setIsLoading, setError} from "../constants";
import axios, {MEMBER_ONLINE_PAYMENT_URL, turnObjectToQueryString} from "../api";
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

        isLoading:(state)=>state.isLoading,
        
        error:(state)=>state.error
    },
    mutations:{
        
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },

    actions:{
        saveMemberPayment({ commit }, formData){
            return axios.post(MEMBER_ONLINE_PAYMENT_URL.save_member_payment, formData)
            .then(response=>{
                debug("member payments", response);
                const {data} = response.data.data;
                return {data};
                
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getMemberPaymentBySocietyID({ commit }, {society_id = null}){
            if(!society_id) return handleNoIDError(commit, "Society ID is required")

            commit(setIsLoading, true)
            return axios.get(
                `${MEMBER_ONLINE_PAYMENT_URL.fetch_my_monthly_payment}/${society_id}`
            ).then(response=>{
                debug("fetching my payment", response)
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        changeReferenceNo({ commit }, {payment_id = null, reference_no = null}){
            if(!payment_id) return handleNoIDError(commit, "Payment ID is required")
            if(!reference_no) return handleNoIDError(commit, "Reference No is required")

            commit(setIsLoading, true)
            return axios.get(
                `${MEMBER_ONLINE_PAYMENT_URL.change_reference_no}/${payment_id}/${reference_no}`
            ).then(response=>{
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        verifyPayment({ commit }, {reference_no = null}){
            if(!reference_no) return handleNoIDError(commit, "Reference No is required")

            commit(setIsLoading, true)
            return axios.get(
                `${MEMBER_ONLINE_PAYMENT_URL.verify_payment}/${reference_no}`
            ).then(response=>{
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getOnlinePaymentsForAdmin({ commit }, {query={}}={}){
            const url = (MEMBER_ONLINE_PAYMENT_URL.get_online_payment_for_admin) + "?" + turnObjectToQueryString(query);
            commit(setIsLoading, true)
            return axios.get(url)
            .then(response=>{
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },//end index page
    }
}