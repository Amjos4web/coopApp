import {setIsLoading, setError} from "../constants";
import axios, {REVENUE_URL, turnObjectToQueryString} from "../api";
import { commitError, handleNoIDError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
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
        memberPaymentDataAnalysis({ commit }, query={}){
          const url = (REVENUE_URL.view_member_total_assets) + "?" + turnObjectToQueryString(query);

          //notify UI we are currently loading
          commit(setIsLoading, true);

          return axios.get(url)
          .then(resp=>{
            return resp.data;
          })
          .catch(e=>commitError(commit, e))
          .then(data=>stopLoadingAndResolve(commit, data))
        },
        societyMembersPaymentRecordDataAnalysis({commit}, {society_id, from=null, to=null} = {}){
          if(!society_id) return handleNoIDError(commit, "society ID is required");

          //notify UI we are currently loading
          commit(setIsLoading, true);
          //let url = REVENUE_URL.society_member_payment_records + society_id + "?";
          const substr = [];
          if(from){
            substr.push(`from=${encodeURIComponent(from)}`)
          }

          if(to){
            substr.push(`to=${encodeURIComponent(to)}`)
          }

          return axios.get(REVENUE_URL.society_member_payment_records + society_id + "?" + substr.join("&"))
          .then(resp=>{
            return resp.data.data;
          })
          .catch(e=>commitError(commit, e))
          .then(data=>stopLoadingAndResolve(commit, data))
        }
    }//end actions
}