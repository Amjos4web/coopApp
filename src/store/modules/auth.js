import VueCookie from "vue-cookie"
import {setIsLoading, auth, setError} from "../constants";
import userStore from "../normalized-api/user";
import rolePermissionStore from "../normalized-api/role-permission"
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
        rolePermission:null,
    },
    getters:{
        isLoading:(state)=>state.isLoading,
        error:(state)=>state.error,
        self:(state)=>state.self,
        isLogged:(state)=>(!!state.self),
        rolePermission:(state)=>state.rolePermission,
    },
    mutations:{
        [auth.setSelf]:(state, self)=>(state.self = self),
        [setIsLoading]:(state, loadingState)=>(state.isLoading = loadingState),
        [setError]:(state, error)=>(state.error = error),
        rolePermission:(state, rolePermission)=>(state.rolePermission=rolePermission),
    },
    
    actions:{
        login({commit}, credentials){
            //if user is already logged, return current user
            let self = userStore.getUserByID(myID);
            //user is already logged in
            if(self) return resolveWithDataFromStore(commit, self);
            //notify UI that we are loading
            commit(setIsLoading, true)
            //return promise to caller
            return axios.post(AUTH_URL.login, {userid:credentials.userid, password:credentials.password})
            .then(response=>{
                //console.log(response)
                debug("login response", response);
                //get user and success from response
                const {success, data:{user, authorization, rolePermission}} = response.data;
                //if request was successful
                if(success){
                    myID = userStore.addUser(user)
                    if(rolePermission)
                        rolePermissionStore.addRolePermission(rolePermission)
                    //rolePermission.ad
                    //save to store first and then set in state
                    commit(auth.setSelf, user);
                    commit("rolePermission", rolePermission);
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
                // const {success, msg} = response.data;
                // if(success){
                    
                // }
                // commitError(commit, null)
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>{
                //save to store first and then set in state
                commit(auth.setSelf, null);
                emptyStore();
                VueCookie.set("token", "")
                //cancel token refresh, when clients logs out
                event.emit(REFRESH_TOKEN_EVENT_TYPE.CANCEL_REFRESHING_TOKEN);
                event.emit(EVENT_TYPE.CLEAN_UP);
                //return message
                stopLoadingAndResolve(commit, data)
            })
        },

        //fetch current user info
        getSelf({ commit }) {
            return new Promise((resolve) => {
                try {
                // Try to get user from store
                let self = userStore.getUserByID(myID);
                debug("self from store", self);

                // If already have user, resolve immediately
                if (self) {
                    resolveWithDataFromStore(commit, self);
                    return resolve(self);
                }

                // Notify UI we're loading
                commit(setIsLoading, true);
                event.emit(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_IN_PROGRESS);

                axios
                    .get(AUTH_URL.self)
                    .then((response) => {
                    const { success, data } = response.data || {};
                    const { user, rolePermission } = data || {};

                    if (success && user) {
                        myID = userStore.addUser(user);
                        if (rolePermission) rolePermissionStore.addRolePermission(rolePermission);

                        commit(auth.setSelf, user);
                        commit("rolePermission", rolePermission);

                        // Immediately schedule token refresh
                        refreshToken(0);

                        return resolve(user);
                    } else {
                        // API said success = false → treat as invalid session
                        commitError(commit, null);
                        return resolve(null);
                    }
                    })
                    .catch((error) => {
                    // If unauthorized (token expired)
                    if (error.response && error.response.status === 401) {
                        console.warn("Session expired: redirecting to login...");
                    }
                    commitError(commit, error);
                    resolve(null);
                    })
                    .finally(() => {
                    stopLoadingAndResolve(commit);
                    });
                } catch (err) {
                console.error("getSelf failed:", err);
                commitError(commit, err);
                resolve(null);
                }
            });
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