import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const rolePermissionTypeSchema = new schema.Entity("rolePermissions");
//const arrayOfRolePermissionTypeSchema = [rolePermissionTypeSchema];

let store = {};

export default{
    addRolePermission(rolePermission){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(rolePermission, rolePermissionTypeSchema);
        //add to store
        store = setStore(store, entities.rolePermissions);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    getRolePermissionByID(id){
        return store[id] ? store[id] : null;
    },
}

export function emptyRolePermissionStore(){
    store = {};
}