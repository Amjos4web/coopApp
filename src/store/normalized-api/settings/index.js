import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const settingTypeSchema = new schema.Entity("settings");

let store = {};

export default{
    addSetting(setting){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(setting, settingTypeSchema);
        //add to store
        store = setStore(store, entities.settings);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    getSettingByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },
}

export function emptySettingStore(){
    store = {};
}