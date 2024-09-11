import {setIsLoading, setError} from "../constants";
import societyMemberStore from "../normalized-api/society-member";
import memberStore from "../normalized-api/member"
//import {fetchManySingleton} from "../helpers"
import axios, { SOCIETY_MEMBER_URL, turnObjectToQueryString } from "../api";
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
    societyIDs : {},
    memberIDs:{},
    notInSociety:{},
    mySocietyIDs:null,
    //totalMemberIn
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
        
        error:(state)=>state.error
    },
    mutations:{
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },
    actions:{
        societyMemberIndex({ commit }, {reload=false, query={}}={}){
            const url = SOCIETY_MEMBER_URL.index + "?" + turnObjectToQueryString(query);
            
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //const ids = cache.currentPage.ids;
                //fetch loan from cache
                const cacheSocietyMember = societyMemberStore.getManySocietyMemberByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cacheSocietyMember) {
                    return resolveWithDataFromStore(commit, {
                        societyMembers:cacheSocietyMember, 
                        pagination:cache.currentPage.pagination
                    });
                }//end if(cacheSocietyMember)
            }//end if(!reload && cacheData)
        
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(url)
            .then(resp=>{
                const {success, data:{societyMembers}, pagination} = resp.data
                if(success){
                    cache.currentPage = {
                        ids:societyMemberStore.addSocietyMemberList(societyMembers), 
                        pagination,
                        url
                    };
                    return {societyMembers, pagination};
                }
                commitError(commit, null);
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        saveSocietyMember({commit}, formData){

            commit(setIsLoading, true)

            return axios.post(SOCIETY_MEMBER_URL.save, formData)
            .then(resp=>{
                //get loan request and its guarantor from response
                const {data:{societyMembers}} = resp.data;
                //cache loan request on client
                //add ID to the front of the current page for user to see the newly added
                //data
                if(formData.society_id){
                    cache.societyIDs[formData.society_id] = societyMemberStore.addSocietyMemberList(societyMembers);
                }
                
                debug("newly added society member added to store", cache.societyIDs[formData.society_id]);
        
                return {societyMembers};
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },//end method

        fetchAllSocietyToWhichIBelongs({ commit },reload=false){
            if(cache.mySocietyIDs && !reload){
                const societyMembersCache = societyMemberStore.getManySocietyMemberByIDArray(cache.mySocietyIDs);
                if(societyMembersCache){
                    return resolveWithDataFromStore(commit, {societyMembers:societyMembersCache})
                }//end if(societyMembersCache)
            }//end if(cache.mySocietyIDs && !reload)
            commit(setIsLoading, true)

            return axios.get(SOCIETY_MEMBER_URL.fetch_my_society)
            .then(response=>{
                debug("fetchAllSocietyToWhichIBelongs", response)

                const {societyMembers} = response.data.data;

                cache.mySocietyIDs = societyMemberStore.addSocietyMemberList(societyMembers)

                return {societyMembers};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        fetchAllSocietyToWhichMemberBelongsForAdmin({ commit }, { reload=false, member_id=null }={}){
            if(!member_id) return handleNoIDError(commit, "member ID is required");

            if(cache.memberIDs[member_id] && !reload){
                const societyMembersCache = societyMemberStore.getManySocietyMemberByIDArray(cache.memberIDs[member_id]);
                if(societyMembersCache){
                    return resolveWithDataFromStore(commit, {societyMembers:societyMembersCache})
                }//end if(societyMembersCache)
            }//end if(cache.mySocietyIDs && !reload)
            commit(setIsLoading, true)

            return axios.get(SOCIETY_MEMBER_URL.fetch_member_society_for_admin + member_id)
            .then(response=>{
                debug("fetchAllSocietyToWhichMemberBelongsForAdmin", response)

                const {societyMembers} = response.data.data;

                cache.memberIDs[member_id] = societyMemberStore.addSocietyMemberList(societyMembers)

                return {societyMembers};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        fetchMemberInSociety({ commit }, { reload = false, society_id=null } = {}){
            if(!society_id) return handleNoIDError(commit, "society ID is required");

            if(cache.societyIDs[society_id]){
                if (reload){
                    const societyMembersCache = societyMemberStore.getManySocietyMemberByIDArray(cache.societyIDs[society_id]);
                    if(societyMembersCache){
                        return resolveWithDataFromStore(commit, {societyMembers:societyMembersCache})
                    }//end if(societyMembersCache)
                }
            }//end if(cache.mySocietyIDs && !reload)
            commit(setIsLoading, true)

            return axios.get(SOCIETY_MEMBER_URL.fetch_member_in_society + society_id)
            .then(response=>{
                debug("fetchMemberInSociety", response)

                const {societyMembers} = response.data.data;

                cache.societyIDs[society_id] = societyMemberStore.addSocietyMemberList(societyMembers)

                return {societyMembers};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        fetchMemberOfMySociety({ commit }, { reload=false, society_id=null } = {}){
            
            if(!society_id) return handleNoIDError(commit, "society ID is required");

            if(cache.notInSociety[society_id] && !reload){
                const societyMembersCache = societyMemberStore.getManySocietyMemberByIDArray(cache.mySocietyIDs[society_id]);
                if(societyMembersCache){
                    return resolveWithDataFromStore(commit, {societyMembers:societyMembersCache})
                }//end if(societyMembersCache)
            }//end if(cache.mySocietyIDs && !reload)
            commit(setIsLoading, true)

            return axios.get(SOCIETY_MEMBER_URL.fetch_member_of_my_society)
            .then(response=>{
                debug("fetchMemberOfMySociety", response)

                const {societyMembers} = response.data.data;

                cache.mySocietyIDs[society_id] = societyMemberStore.addSocietyMemberList(societyMembers)

                return {societyMembers};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        countMemberInSociety({ commit }, {reload=false, paramIDs=[]}={}){
            commit(setIsLoading, true);

            return axios.post(SOCIETY_MEMBER_URL.count_member_in_society, {paramIDs})
            .then(response=>{
                const {countMemberInSociety} = response.data.data;

                return {countMemberInSociety};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        fetchMemberNotInSociety({ commit }, { society_id=null, searchMeta="" } = {}){
            
            if(!society_id) return handleNoIDError(commit, "society ID is required");

            commit(setIsLoading, true)

            return axios.get(SOCIETY_MEMBER_URL.get_member_not_in_society + society_id + `?name=${searchMeta}`)
            .then(response=>{
                debug("fetchMembers", response)

                const {members} = response.data.data;

                //cache.notInSociety[society_id] = memberStore.addMemberList(members)

                return {members};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        removeMemberFromSociety({ commit }, id=null){
            if(!id) return handleNoIDError(commit, "society member ID is required");

            const societyMember = societyMemberStore.getSocietyMemberByID(id)

            if(societyMember && societyMember.deleted == 1) return societyMember

            commit(setIsLoading, true)

            return axios.put(SOCIETY_MEMBER_URL.remove_member_from_society + id)
            .then(response=>{
                debug("fetchMembers", response)

                const {societyMember} = response.data.data

                societyMemberStore.addSocietyMember(societyMember)

                return societyMember
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        getSocietiesToWhichManyMemberBelongsByID({ commit }, paramIDs=[]){
            const store = [];
            const toFetch = [];

            paramIDs.forEach(member_id=>{
                const m = societyMemberStore.getSocietyMemberByID(member_id);
                if(m){
                    store.push(m)
                }else{
                    toFetch.push(member_id)
                }
            })

            if(toFetch.length < 1){
                return {societyMembers:store};
            }
            
            return axios.post(
                SOCIETY_MEMBER_URL.get_many_society_member_by_member_id, 
                {paramIDs:toFetch}
            ).then(response=>{
                debug("fetching many member", response)

                const { data } = response.data

                debug("fetching many member", data)

                societyMemberStore.addSocietyMemberList(data)
                //stop loading
                commit(setIsLoading, false);

                return {societyMembers:store.concat(data)}
            })
            .catch(e=>{
                //stop loading
                commit(setIsLoading, false);
                throw e;
            });
        },

        moveMemberToNewSociety({commit}, formData){

            commit(setIsLoading, true)

            return axios.put(SOCIETY_MEMBER_URL.move_member_to_new_society, formData)
            .then(resp=>{
                const {data, success, msg} = resp.data;
                
                return {data, success, msg};
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },//end method
    }//end action
}