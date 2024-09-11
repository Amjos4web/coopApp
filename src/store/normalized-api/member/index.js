import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const memberSchema = new schema.Entity("members");
const arrayOfMemberSchema = [memberSchema];

/**
 * @type {MemberObject}
 */
let store = {};

export default {
    /**
     * 
     * @param {Member} member 
     * @returns {string | number} return the record ID of the added member
     * @description Normalize a single member and then add to store.
     */
    addMember(member){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(member, memberSchema);
        //add to store
        store = setStore(store, entities.members);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    /**
     * 
     * @param {Member[]} members 
     * @returns {ID[]} return array of the ID of the added data
     * @description Normalize array of member and then add to store.
     */
    addMemberList(members){
        //normalize sent member list
        const {entities, result} = normalize(members, arrayOfMemberSchema);
        //save back in store
        store = setStore(store, entities.members);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the member to fetch from store
     * @returns {Member | null} - return the member if found else null
     */
    getMemberByID(id){
        return store[id] ? store[id] : null;
    },

    /**
     * 
     * @param {ID[]} memberIDs 
     * @returns {Member[]}
     */
    getManyMemberByIDArray(memberIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < memberIDs.length; i++){
            //get current id
            id = memberIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyMemberByID
}

export function emptyMemberStore(){
    store = {};
}