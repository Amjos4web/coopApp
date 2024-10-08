import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const userSchema = new schema.Entity("users");
const arrayOfUserSchema = [userSchema];

/**
 * @type {UserObject}
 */
let store = {};

export default {
    /**
     * 
     * @param {User} user 
     * @returns {string | number} return the record ID of the added user
     * @description Normalize a single user and then add to store.
     */
    addUser(user){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(user, userSchema);
        //add to store
        store = setStore(store, entities.users);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    /**
     * 
     * @param {User[]} users 
     * @returns {ID[]} return array of the ID of the added data
     * @description Normalize array of user and then add to store.
     */
    addUserList(users){
        //normalize sent user list
        const {entities, result} = normalize(users, arrayOfUserSchema);
        //save back in store
        store = setStore(store, entities.users);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the user to fetch from store
     * @returns {User | null} - return the user if found else null
     */
    getUserByID(id){
        return store[id] ? store[id] : null;
    },

    getManyUserByIDArray(userIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < userIDs.length; i++){
            //get current id
            id = userIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyUserByID
}

export function emptyUserStore(){
    store = {};
}