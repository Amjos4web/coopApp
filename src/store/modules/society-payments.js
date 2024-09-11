import {setIsLoading, setError} from "../constants";
import axios, {SOCIETY_PAYMENTS_URL} from "../api";
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
      /**
       * @param {MemberState} state
       */
      [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
      [setError]:(state, error)=>(state.error = error),
  },

  actions:{
    saveSocietyPayments({ commit }, formData){
        return axios.post(
          SOCIETY_PAYMENTS_URL.index, formData)
        .then(response=>{
            debug("society payments", response);
            //const {societyPaymentList} = response.data.data;
            return response.data.data
            //return {societyPaymentList};
        })
        .catch(e=>commitError(commit, e))
        .then(data=>stopLoadingAndResolve(commit, data));
    },
    fetchSocietyMonthlyPayment({ commit }, {society_id=null, meeting_calendar_id=null} = {}){
        if(!society_id) return handleNoIDError(commit, "ID of society to which member belongs is required.");
        if(!meeting_calendar_id) return handleNoIDError(commit, "ID of member is required.");

        commit(setIsLoading, true);

        console.log(SOCIETY_PAYMENTS_URL.index + society_id + "/" + meeting_calendar_id)

        return axios.get(SOCIETY_PAYMENTS_URL.index + society_id + "/" + meeting_calendar_id)
        .then(response=>{
            debug("society payment monthly due", response)
            // const {memberPaymentDueList} = response.data.data;
            return response.data.data;
        })
        .catch(e=>commitError(commit, e))
        .then(data=>stopLoadingAndResolve(commit, data));
    }, 
  }
}