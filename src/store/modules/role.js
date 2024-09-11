import {setIsLoading, setError} from "../constants";
import roleStore from "../normalized-api/roles";
//import {fetchManySingleton} from "../helpers"
import axios, { ROLE_URL } from "../api";
import { commitError, handleNoIDError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import event,{ EVENT_TYPE } from "../../utility/event";

const initCache = {
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    currentPage:{
        ids:[],
        url:""
    },
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
        isLoading:(state)=>state.isLoading,
        error:(state)=>state.error,
        //roles:()=>roleStore.getIndex(cache.currentPage.ids)
    },
    mutations:{
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },
    actions:{
        getRoles({ commit }, reload){
            const url = ROLE_URL.index;
            debug("url", url);
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //fetch role type from cache
                const cacheRoles = roleStore.getManyRoleByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cacheRoles) {
                    return resolveWithDataFromStore(commit, {
                        roles:cacheRoles, 
                    });
                }//end if(ccacheRoless)
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(url)
            .then(resp=>{
                const {roles} = resp.data.data
                
                cache.currentPage = {
                    ids:roleStore.addRoleList(roles), 
                    url
                };
                return {roles};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getOneRole({ commit }, id){
            //ensure role id is supplied
            if(!id) return handleNoIDError(commit, "Role ID is required");
            //get role from store
            const role = roleStore.getRoleByID(id);
            //if role is already in store
            if(role){
                return resolveWithDataFromStore(commit, role);
            }//end if(role)

            //
            commit(setIsLoading, true);

            return axios.get(ROLE_URL.get_one + id)
            .then(resp=>{
                const {data:role} = resp.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                roleStore.addRole(role);
                return role;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        addNewRole({ commit }, formData){
            commit(setIsLoading, true)
        
            return axios.post(ROLE_URL.add_new, formData)
            .then(resp=>{
                //get role type from response
                const {data:{role}} = resp.data;
                //debug
                debug("role", role);
                //cache role type on client
                //add ID to the front of the current page for user to see the newly added
                //data
                const id = roleStore.addRole(role);
        
                debug("newly added role to store return id", id);
                
                //am putting it at the front to show client that the newly added role type has been saved
                cache.currentPage.ids.unshift(id);
                //return role types to client
                return role;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        updateRole({ commit }, {id=null, formData={}} = {}){
            //ensure role type id is supplied
            if(!id) return handleNoIDError(commit, "Role ID is required");

            commit(setIsLoading, true)

            return axios.put(ROLE_URL.update + id, formData)
            .then(resp=>{
                //get role type from response
                const {data:{role}} = resp.data;
                //debug
                debug("updated role", role);
                //no need to save id cos the id already exits in store,

                roleStore.addRole(role);
                //return role types to client
                return role;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },
    }//end action
}//end module
