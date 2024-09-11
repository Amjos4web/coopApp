import {setIsLoading, setError} from "../constants";
import settingStore from "../normalized-api/settings";
//import {fetchManySingleton} from "../helpers"
import axios, { SETTING_URL } from "../api";
import { commitError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import event,{ EVENT_TYPE } from "../../utility/event";

let settingID = '';

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    settingID = '';
    debug("cleaning up", settingID);
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
        getSetting({ commit }, reload){
            
            //if not to reload and data has already being cache fo this query
            if(!reload ){
                //fetch setting type from cache
                const setting = settingStore.getSettingByID(settingID);
                
                debug("cache", setting)

                //if cache data is not null
                if(setting) {
                    return resolveWithDataFromStore(commit, { setting });
                }//end if(setting)
                
            }//end if(!reload && cacheData)
            
            //notify UI we are currently loading
            commit(setIsLoading, true);
        
            return axios.get(SETTING_URL.index)
            .then(resp=>{
                //console.log(resp);
                const { setting } = resp.data.data
                settingID = settingStore.addSetting(setting);
                debug('settingID', settingID)
                //console.log(cache);
                return { setting };
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },

        saveSetting({ commit }, formData){
            commit(setIsLoading, true)
        
            return axios.post(SETTING_URL.save, formData)
            .then(resp=>{
                //get setting type from response
                const {data:{setting}} = resp.data;
                //debug
                debug("setting", setting);
                //cache setting type on client
                //add ID to the front of the current page for user to see the newly added
                //data
                const id = settingStore.addSetting(setting);
        
                debug("newly added setting to store return id", id);
                
                //return setting types to client
                return setting;
            })
            .catch(e=>commitError(commit, e))
            .then((data)=>stopLoadingAndResolve(commit, data))
        },
    }//end action
}//end module
