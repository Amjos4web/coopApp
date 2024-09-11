import axios, {DASHBOARD_URL} from '../api'
import { setIsLoading, setError } from '../constants'
import { commitError, stopLoadingAndResolve, handleNoIDError } from "./app";

export default {
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
    getDashboardIndexData({commit}){
      commit(setIsLoading, true)

      return axios.get(DASHBOARD_URL.index)
      .then((response)=>{
        const { societies, members } = response.data.data
        return {societies, members}
      })
      .catch(e=>commitError(commit, e))
      .then(data=>stopLoadingAndResolve(commit, data))
    },

    getAllMemberTotalAsset({commit}){
      commit(setIsLoading, true)

      return axios.get(DASHBOARD_URL.fetch_all_member_total_assets)
      .then((response)=>{
        const { totalAssets } = response.data.data

        return totalAssets 
      })
      .catch(e=>commitError(commit, e))
      .then(data=>stopLoadingAndResolve(commit, data))
    },

    getAllLoanIssuedOut({commit}){
      commit(setIsLoading, true)

      return axios.get(DASHBOARD_URL.get_all_loan_issued_out)
      .then((response)=>{
        const { loanIssueOut } = response.data.data

        return loanIssueOut 
      })
      .catch(e=>commitError(commit, e))
      .then(data=>stopLoadingAndResolve(commit, data))
    },

    getLoanPaymentBalance({commit}, {society_id=null, member_id=null}){
      if (!society_id) return handleNoIDError(commit, "Society ID is required")
      if (!member_id) return handleNoIDError(commit, "Member ID is required")

      //notify UI we are currently loading
      commit(setIsLoading, true);

      return axios.get(DASHBOARD_URL.get_current_loan_payment_balance + member_id + '/' + society_id)
      .then(resp => {
        const {currentLoanBalance} = resp.data.data

        return currentLoanBalance
      })
      .catch(e=>commitError(commit, e))
      .then(data=>stopLoadingAndResolve(commit, data));
    }
  }
};