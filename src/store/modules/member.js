import {setIsLoading, setError} from "../constants";
import memberStore from "../normalized-api/member";
import {fetchManySingleton} from "../helpers"
import axios, { MEMBER_URL, turnObjectToQueryString } from "../api";
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
        getMembers({ commit }, {query={}, reload=false}={}){
            
            const url = MEMBER_URL.index + "?" + turnObjectToQueryString(query);
            debug("url", url);
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //fetch member from cache
                const cacheMembers = memberStore.getManyMemberByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cacheMembers) {
                    return resolveWithDataFromStore(commit, {
                        members:cacheMembers, 
                        pagination:cache.currentPage.pagination
                    });
                }//end if(cacheMembers)
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(url)
            .then(resp=>{
                const {success, data:{members}, pagination} = resp.data
                if(success){
                    cache.currentPage = {
                        ids:memberStore.addMemberList(members), 
                        pagination,
                        url
                    };
                    return {members, pagination};
                }
                commitError(commit, null);
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
            
        },

        getOneMember({ commit }, id){
            //ensure member id is supplied
            if(!id) return handleNoIDError(commit, "Member ID is required");
            //get member from store
            const member = memberStore.getMemberByID(id);
            //if member is already in store
            if(member){
                return resolveWithDataFromStore(commit, member);
            }//end if(member)

            //
            commit(setIsLoading, true);

            return axios.get(MEMBER_URL.get_one + id)
            .then(resp=>{
                
                const {member} = resp.data.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                memberStore.addMember(member);
                return member;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        addNewMember({ commit }, formData){
            commit(setIsLoading, true)
        
            return axios.post(MEMBER_URL.add_new_member, formData)
            .then(resp=>{
                //get member from response
                const {data:{member, auth_detail}} = resp.data;
                
                debug("member", member);
                //cache member on client
                //add ID to the front of the current page for user to see the newly added
                //data
                const id = memberStore.addMember(member);
        
                debug("newly added member to store return id", id);
                //am putting it at the front to show client that the newly added member has been saved
                cache.currentPage.ids.unshift(id);
                //return members to client
                return {member, auth_detail};
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        updateMember({ commit }, {id=null, formData={}} = {}){
            //ensure member id is supplied
            if(!id) return handleNoIDError(commit, "Member ID is required");

            commit(setIsLoading, true)

            return axios.put(MEMBER_URL.update_member + id, formData)
            .then(resp=>{
                //get member from response
                const {data:{member}} = resp.data;
                //debug
                debug("member", member);
                //no need to save id cos the id already exits in store,

                memberStore.addMember(member);
                //return members to client
                return member;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        fetchManyMember({commit }, paramIDs=[]){
            const members = [];
            const memberToFetch = [];

            paramIDs.forEach(member_id=>{
                const m = memberStore.getMemberByID(member_id);
                if(m){
                    members.push(m)
                }else{
                    memberToFetch.push(member_id)
                }
            })

            if(memberToFetch.length < 1){
                return {members};
            }
           
            return axios.post(
                MEMBER_URL.fetch_many_member, 
                {paramIDs:memberToFetch}
            ).then(response=>{
                debug("fetching many member", response)

                const { data } = response.data

                debug("fetching many member", data)

                memberStore.addMemberList(data)
                //stop loading
                commit(setIsLoading, false);
                
                return {members:members.concat(data)}
            })
            .catch(e=>{
                //stop loading
                commit(setIsLoading, false);
                throw e;
            });
        }
    }//end action
}//end module
