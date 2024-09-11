import {setIsLoading, setError} from "../constants";
import userStore from "../normalized-api/user";
import memberStore from "../normalized-api/member";
import axios, { turnObjectToQueryString, USER_URL } from "../api";
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
        pagination:{},
        url:""
    },
};

let cache = initCache;

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    cache = initCache;
    debug("cleaning up", cache);
});

export default{
    namespaced:true,
    /**
     * @type {MemberState}
     */
    state:{
        /**
         * store all member ID, this ID will be use to fetch member from normalized store
         */
        //memberIDs:[],
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
        getUsers({ commit }, {query={}, reload=false}={}){
            const url = USER_URL.index + "?" + turnObjectToQueryString(query);
            debug("url", url);
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //fetch user from cache
                const cacheUsers = userStore.getManyUserByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cacheUsers) {
                    return resolveWithDataFromStore(commit, {
                        users:cacheUsers, 
                        pagination:cache.currentPage.pagination
                    });
                }//end if(cacheUsers)
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(url)
            .then(resp=>{
                const {success, data:{users}, pagination} = resp.data
                if(success){
                    cache.currentPage = {
                        ids:userStore.addUserList(users), 
                        pagination,
                        url
                    };
                    return {users, pagination};
                }
                commitError(commit, null);
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        getOneUser({ commit }, id){
            //ensure user id is supplied
            if(!id) return handleNoIDError(commit, "User ID is required");
            //get user from store
            const user = userStore.getuserByID(id);
            //if user is already in store
            if(user){
                return resolveWithDataFromStore(commit, user);
            }//end if(user)

            //
            commit(setIsLoading, true);

            return axios.get(USER_URL.get_one + id)
            .then(resp=>{
                const {data:user} = resp.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                userStore.addUser(user);
                return user;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        resetMemberPassword({ commit }, userID){
            if(!userID) return handleNoIDError(commit, "User ID is required")
            commit(setIsLoading, true)
        
            return axios.put(USER_URL.reset_password + userID)
            .then(resp=>{
                //get user from response
                const {data:{user, new_default_psd}} = resp.data;
                //debug
                debug("user", user);
                //cache user on client, this will indicate user has change password
                userStore.addUser(user) 
                //return user to client
                return {new_default_psd, user};
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        activateDeactivateMemberAccount({ commit }, userID){

            if(!userID) return handleNoIDError(commit, "User ID is required")
            commit(setIsLoading, true)
        
            return axios.put(USER_URL.toggle_account + userID)
            .then(resp=>{
                //get user from response
                const {data:{user}} = resp.data;
                //debug
                debug("user", user);
                //cache user on client, this will indicate user has change password
                userStore.addUser(user) 
                //return user to client
                return user;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        updateUserProfileImage({commit}, {memberID=null, passport=null}){
            if (!memberID) return handleNoIDError(commit, "Member ID is required")
            
            commit (setIsLoading, true)

            return axios.put(USER_URL.update_user_avatar + memberID, {passport})
            .then(resp=>{
                //get user from response
                const {data:{member}} = resp.data;
                //debug
                debug("user", member);
                //cache user on client, this will indicate user has change password
                memberStore.addMember(member)
                //return user to client
                return member;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        
    }//end action
}//end module
