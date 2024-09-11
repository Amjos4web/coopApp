import auth from "./auth"
import member from "./member"
import loan from "./loan-request"
import meeting_calendar from "./meeting-calendar"

import {setError, setIsLoading} from "../constants";
import { getErrorFromResponse, debug } from "../../utility";


export function stopLoadingAndResolve(commit, data){
    //debug("stopLoadingAndResolve", data)
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
        meeting_calendar
    },//end inner modules
}//end app
