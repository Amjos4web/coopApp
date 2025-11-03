import auth from "./auth"
import member from "./member"
import loan from "./loan-request"
import meeting_calendar from "./meeting-calendar"
import payment_type from "./payment-type"
import role from "./role"
import setting from "./setting"
import society from "./society"
import member_payment from "./member-payments"
import asset_withdrawal from "./asset-withdrawal"
import member_online_payment from "./member-online-payments"
import role_permission from "./role-permission"
import society_member from "./society-member"
import society_payment from "./society-payments"
import society_payment_minimum_amount from "./society-payment-min-amount"
import society_loan from "./society-loan"
import user from "./user"
import revenue from "./revenue"
import dashboard from "./dashboard"
import society_account from "./society_account"
import sms_logs from "./sms_logs"

import {setError, setIsLoading} from "../constants";
import { getErrorFromResponse } from "../../utility";


export function stopLoadingAndResolve(commit, data){
    window.scrollTo(0, 0)

    //stop loading
    commit(setIsLoading, false);
    //if error occur return null to caller
    if(data instanceof Error){
        return null;
    }
    //set previous error to null
    commit(setError, null)
    //return data back to caller
    return data;
}

export function commitError(commit, e){
    window.scrollTo(0, 0)
    commit(setError, getErrorFromResponse(e));
    //I need to return this error back to caller, because in the 
    //last resolver, I need to check if e is an instace of error carry out
    //appropriate action base on this value
    return e;
}

export function handleNoIDError(commit, msg){
    commit(setError, new Error(msg));
    //return promise with null value, It has to be done like this cos
    //the caller of our action have the error set automtically for them
    //and they don't have to handle any promise rejection error
    return Promise.resolve(null);
}

export function resolveWithDataFromStore(commit, data){
    //set previous error to null
    commit(setError, null);
    //return data to caller
    return Promise.resolve(data);
}

export default {
    state:{
        isLoading:false,
        error:null,
    },
    mutations:{
        [setError]:(state, error)=>{
            state.error = error;
        },
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
    },
    getters:{
        isLoading:(state)=>state.isLoading,
        error:(state)=>state.error,
    },
    actions:{},
    namespaced:true,
    modules:{
        auth,
        member,
        loan,
        meeting_calendar,
        payment_type,
        role,
        setting,
        society,
        member_payment,
        asset_withdrawal,
        member_online_payment,
        role_permission,
        society_member,
        society_payment,
        society_loan,
        society_payment_minimum_amount,
        user,
        revenue,
        dashboard,
        society_account,
        sms_logs
    },//end inner modules
}//end app