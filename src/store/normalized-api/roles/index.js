import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const roleTypeSchema = new schema.Entity("roles");
const arrayOfRoleTypeSchema = [roleTypeSchema];

let store = {};

export default{
    addRole(role){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(role, roleTypeSchema);
        //add to store
        store = setStore(store, entities.roles);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    addRoleList(roles){
        //normalize sent payment types list
        const {entities, result} = normalize(
            roles, arrayOfRoleTypeSchema
        );
        //save back in store
        store = setStore(store, entities.roles);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getRoleByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    getManyRoleByIDArray(roleIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < roleIDs.length; i++){
            //get current id
            id = roleIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    },//end getManygetManyRoleByIDArray
}

export function emptyRoleStore(){
    store = {};
}