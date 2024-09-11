import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const societyMembersTypeSchema = new schema.Entity("society_members");
const arrayOfsocietyMembersTypeSchema = [societyMembersTypeSchema];

let store = {};

export default{
    
    addSocietyMember(societyMember){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(societyMember, societyMembersTypeSchema);
        //add to store
        store = setStore(store, entities.society_members);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    addSocietyMemberList(societyMembers){
        //normalize sent payment types list
        const {entities, result} = normalize(
            societyMembers, arrayOfsocietyMembersTypeSchema
        );
        //save back in store
        store = setStore(store, entities.society_members);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getSocietyMemberByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    getManySocietyMemberByIDArray(societyMemberIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < societyMemberIDs.length; i++){
            //get current id
            id = societyMemberIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManySocietyMemberByIDArray
}

export function emptySocietyMemberStore(){
    store = {};
}