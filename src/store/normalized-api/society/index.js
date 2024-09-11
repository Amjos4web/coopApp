import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const societyTypeSchema = new schema.Entity("societies");
const arrayOfSocietyTypeSchema = [societyTypeSchema];

let store = {};

export default{
    addSociety(society){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(society, societyTypeSchema);
        //add to store
        store = setStore(store, entities.societies);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    addSocietyList(societies){
        //normalize sent payment types list
        const {entities, result} = normalize(
            societies, arrayOfSocietyTypeSchema
        );
        //save back in store
        store = setStore(store, entities.societies);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getSocietyByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    getManySocietyByIDArray(societyIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < societyIDs.length; i++){
            //get current id
            id = societyIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManySocietyByIDArray
}

export function emptySocietyStore(){
    store = {};
}