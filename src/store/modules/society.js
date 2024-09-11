import {setIsLoading, setError} from "../constants";
import societyStore from "../normalized-api/society";
//import {fetchManySingleton} from "../helpers"
import axios, { SOCIETY_URL, turnObjectToQueryString } from "../api";
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
        url:"",
        pagination:{},
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
        
        error:(state)=>state.error
    },
    mutations:{
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },
    actions:{
        getSocieties({ commit }, {reload=false, query={}}={}){
            const url = SOCIETY_URL.index + "?" + turnObjectToQueryString(query);
            debug("url", url);
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                //fetch society type from cache
                const cacheSocieties = societyStore.getManySocietyByIDArray(cache.currentPage.ids);
                //if cache data is not null
                if(cacheSocieties) {
                    return resolveWithDataFromStore(commit, {
                        societies:cacheSocieties, 
                        pagination:cache.currentPage.pagination
                    });
                }//end if(cacheSocieties)
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(url)
            .then(resp=>{
                const {data:{societies}, pagination} = resp.data
                
                cache.currentPage = {
                    ids:societyStore.addSocietyList(societies), 
                    pagination,
                    url
                };
                return {societies, pagination};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        getOneSociety({ commit }, id){
            //ensure society id is supplied
            if(!id) return handleNoIDError(commit, "Society ID is required");
            //get society from store
            const society = societyStore.getSocietyByID(id);
            
            //if society is already in store
            if(society){
                return resolveWithDataFromStore(commit, society);
            }//end if(society)

            
            //
            commit(setIsLoading, true);

            return axios.get(SOCIETY_URL.get_one + id)
            .then(resp=>{
                const {data:society} = resp.data;
                //No need to add the id to store
                //Most likely the the data will not have to fetch by axios, client cannot 
                //edit data they have fetch and stored anyway.
                societyStore.addSociety(society);
                
                return society;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        addNewSociety({ commit }, formData){
            commit(setIsLoading, true)
        
            return axios.post(SOCIETY_URL.add_new, formData)
            .then(resp=>{
                //get society type from response
                const {data:{society}} = resp.data;
                //debug
                debug("society", society);
                //cache society type on client
                //add ID to the front of the current page for user to see the newly added
                //data
                const id = societyStore.addSociety(society);
        
                debug("newly added society to store return id", id);
                //am putting it at the front to show client that the newly added society type has been saved
                cache.currentPage.ids.unshift(id);
                //return society types to client
                return society;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        updateSociety({ commit }, {id=null, formData={}} = {}){
            //ensure society type id is supplied
            if(!id) return handleNoIDError(commit, "Society ID is required");

            commit(setIsLoading, true)

            return axios.put(SOCIETY_URL.update + id, formData)
            .then(resp=>{
                //get society type from response
                const {data:{society}} = resp.data;
                //debug
                debug("updated society", society);
                //no need to save id cos the id already exits in store,

                societyStore.addSociety(society);
                //return society types to client
                return society;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },

        fetchManySociety({commit }, paramIDs=[]){
            
            const societies = [];
            const societyToFetch = [];

            paramIDs.forEach(society_id=>{
                const s = societyStore.getSocietyByID(society_id);
                if(s){
                    societies.push(s)
                }else{
                    societyToFetch.push(society_id)
                }
            })

            if(societyToFetch.length < 1){
                return {societies};
            }
            
            return axios.post(
                SOCIETY_URL.fetch_many, 
                {paramIDs:societyToFetch}
            ).then(response=>{
                debug("fetching many society", response)

                const { data } = response.data

                debug("fetching many society", data)

                societyStore.addSociety(data)
                //stop loading
                commit(setIsLoading, false)

                return {societies:societies.concat(data)}
            })
            .catch(e=>{
                //stop loading
                commit(setIsLoading, false);
                throw e;
            });
        }
    }//end action
}//end module
