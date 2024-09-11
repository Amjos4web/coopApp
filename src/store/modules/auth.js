import VueCookie from "vue-cookie"
import {setIsLoading, auth, setError} from "../constants";
import userStore from "../normalized-api/user";
import axios, {AUTH_URL} from "../api";
import { emptyStore } from "../normalized-api";
import refreshToken from "../api/refresh-token";
import event, { EVENT_TYPE } from "../../utility/event";

import {commitError, resolveWithDataFromStore, stopLoadingAndResolve} from "./app"
import { debug, REFRESH_TOKEN_EVENT_TYPE } from "../../utility";

let myID = "";

export default {
    namespaced:true,
    state:{
        isLoading:false,
        self:null,
        error:null,
    },
    getters:{
        isLoading:(state)=>state.isLoading,
        error:(state)=>state.error,
        self:(state)=>state.self,
        isLogged:(state)=>(!!state.self),
    },
    mutations:{
        [auth.setSelf]:(state, self)=>(state.self = self),
        [setIsLoading]:(state, loadingState)=>(state.isLoading = loadingState),
        [setError]:(state, error)=>(state.error = error),
    },
    
    actions:{
        login({commit}, credentials){
            console.log(credentials);
            //if user is already logged, return current user
            let self = userStore.getUserByID(myID);
            //user is already logged in
            if(self) return resolveWithDataFromStore(commit, self);
            //notify UI that we are loading
            commit(setIsLoading, true)
            //return promise to caller
            return axios.post(AUTH_URL.login, credentials)
            .then(response=>{
                debug("login response", response);
                //get user and success from response
                const {success, data:{user, authorization}} = response.data;
                //if request was successful
                if(success){
                    myID = userStore.addUser(user)
                    //save to store first and then set in state
                    commit(auth.setSelf, user);
                    //hook up function to always refresh client token 10 seconds before expiry
                    refreshToken(authorization.expires_in);
                    VueCookie.set("token", authorization.token);
                    //return user back to caller
                    return user;
                }
                commitError(commit, null);
            })
            //if error occur
            .catch((e)=>commitError(commit, e))
            //notify UI that request is done
            .then((data)=>stopLoadingAndResolve(commit, data));
        },

        logout({ commit }){
            return axios.get(AUTH_URL.logout)
            .then(response=>{
                console.log(response);
                const {success, msg} = response.data;
                if(success){
                    //save to store first and then set in state
                    commit(auth.setSelf, null);
                    emptyStore();
                    VueCookie.set("token", "")
                    //cancel token refresh, when clients logs out
                    event.emit(REFRESH_TOKEN_EVENT_TYPE.CANCEL_REFRESHING_TOKEN);
                    event.emit(EVENT_TYPE.CLEAN_UP);
                    //return message
                    return msg;
                }
                commitError(commit, null)
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        //fetch current user info
        getSelf({ commit }){
            //get current user from store
            let self = userStore.getUserByID(myID);//
            debug("self from store", self);
            //if current user, return early
            if(self) return resolveWithDataFromStore(commit, self);
            //notify UI we are loading
            commit(setIsLoading, true);

            event.emit(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_IN_PROGRESS)

            return axios.get(AUTH_URL.self)
            .then(response=>{
                console.log(response);
                //get user and success from response
                const {success, data:{user}} = response.data;
                //if request was successful
                if(success){
                    myID = userStore.addUser(user);
                    //save to store first and then set in state
                    commit(auth.setSelf, user);
                    //hook up function to always refresh client token immediately to get
                    //token refresh interval
                    refreshToken(0);
                    //return user back to caller
                    return user;
                }
                //for some reason request was unsuccessful, this condition should not be possible
                commitError(commit, null);
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data));
        },

        changePassword({ commit }, psdForm){
            commit(setIsLoading, true);
            return axios.post(AUTH_URL.change_psd, psdForm)            
            .then((resp)=>{
                debug("change_psd", resp);
                return resp.data.msg;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data));
        }
    },
};