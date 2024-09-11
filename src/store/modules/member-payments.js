import {setIsLoading, setError} from "../constants";
import axios, {MEMBER_PAYMENT_URL} from "../api";
import { commitError, handleNoIDError, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import member from "../normalized-api/member";


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
        updateMemberPayment({ commit }, {formData, meeting_calendar_id}){
            if(!meeting_calendar_id) return handleNoIDError(commit, "meeting calendar id is required");

            return axios.put(MEMBER_PAYMENT_URL.update_member_payment + meeting_calendar_id, formData)
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

            commit(setIsLoading, true)
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
            commit(setIsLoading, true)
            return axios.get(
                MEMBER_PAYMENT_URL.fetch_many_member_total_assets + "?paramIDs=" + encodeURIComponent(JSON.stringify(paramIDs)), 
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
        getMemberPaymentByMeetingCalendarID({ commit }, {society_id = null, member_id = null, meeting_calendar_id = null} = {}){
            if(!society_id) return handleNoIDError(commit, "society ID is required")
            if(!member_id) return handleNoIDError(commit, "member ID is required")
            if(!meeting_calendar_id) return handleNoIDError(commit, "meeting calendar ID is required")
            
            commit(setIsLoading, true)
            return axios.get(
                `${MEMBER_PAYMENT_URL.fetch_member_payment_with_meeting}/${society_id}/${member_id}/${meeting_calendar_id}`
            ).then(response=>{
                debug("fetching many society", response)
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getMemberPassbookForAdmin({commit}, {society_id=null, member_id=null, from=null, to=null}){
            if (!society_id) return handleNoIDError(commit, "society ID is required")
            if (!member_id) return handleNoIDError(commit, "member ID is required")

            commit (setIsLoading, true)

            return axios.get(
                `${MEMBER_PAYMENT_URL.fetch_member_passbook_for_admin}/${society_id}/${member_id}?from=${from}&to=${to}`
            ).then(response=>{
                debug("fetching member passbook", response)
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getMemberPassbookForMember({commit}, {society_id=null, from=null, to=null}){
            if (!society_id) return handleNoIDError(commit, "society ID is required")

            commit (setIsLoading, true)

            return axios.get(
                `${MEMBER_PAYMENT_URL.fetch_member_passbook_for_member}/${society_id}?from=${from}&to=${to}`
            ).then(response=>{
                
                debug("fetching member passbook", response)
                return response.data.data
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        }
    }
}