import {setIsLoading, setError} from "../constants";
import axios, {ROLE_PERMISSION_URL} from "../api";
import { commitError, handleNoIDError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import rolePermissionStore from "../normalized-api/role-permission"
import event,{ EVENT_TYPE } from "../../utility/event";

const initCache = {
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    routesPaths:null,
}

let cache = initCache;

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    cache = initCache;
    debug("cleaning up", cache);
});

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
        getPermissionsRole({ commit }, { member_id, reload }){
            if(!member_id) return handleNoIDError(commit, "Member ID is required");
           
            if(!reload){
                const rolePermissionCache = rolePermissionStore.getRolePermissionByID(member_id)
                if(rolePermissionCache){
                    return resolveWithDataFromStore(commit, {rolePermission:rolePermissionCache});
                }
            }//end if(!reload)
            //notify client of loading status
            commit(setIsLoading, true)
            
            return axios.get(ROLE_PERMISSION_URL.index + member_id)
            .then(response=>{
                debug("role permission", response);

                const {rolePermission} = response.data.data;

                if(rolePermission){
                    rolePermissionStore.addRolePermission(rolePermission);
                }
                return {rolePermission};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },//end method getPermissionRole

        saveSocietyDelegateRolePermission({ commit }, formData){
            //notify UI we are currently loading
            commit(setIsLoading, true);

            return axios.post(ROLE_PERMISSION_URL.save_society_delegate, formData)
            .then(response=>{
                debug("role permission", response);
                const {rolePermission} = response.data.data;

                rolePermissionStore.addRolePermission(rolePermission);

                return {rolePermission};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        saveStaffOrUnionExecutiveRolePermission({ commit }, formData){
            //notify UI we are currently loading
            console.log(formData)
            commit(setIsLoading, true);
            return axios.post(ROLE_PERMISSION_URL.save_staff_or_union_exec, formData)
            .then(response=>{
                debug("role permission", response);
                const {rolePermission} = response.data.data;

                rolePermissionStore.addRolePermission(rolePermission);

                return {rolePermission};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        fetchRolePermissionRoutesPaths({ commit }, reload){
            if(!reload && initCache.routesPaths){
                return resolveWithDataFromStore(commit, {routesPaths:initCache.routesPaths});
            }

            //notify UI we are currently loading
            commit(setIsLoading, true);

            return axios.get(ROLE_PERMISSION_URL.role_perm_routes_paths)
            .then(response=>{
                debug("role permission", response);
                const { routesPaths } = response.data.data;

                initCache.routesPath = routesPaths;

                return { routesPaths };
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        }
    }//end actions
}