import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const assetWithdrawalSchema = new schema.Entity("assetWithdrawal");
const arrayOfMemberSchema = [assetWithdrawalSchema];

/**
 * @type {AssetWithdrawalObject}
 */
let store = {};

export default {
    /**
     * 
     * @param {AssetWithdrawal} assetWithdrawal
     * @returns {string | number} return the record ID of the added member
     * @description Normalize a single member and then add to store.
     */
    addAssetWithdrawal(assetWithdrawal){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(assetWithdrawal, assetWithdrawalSchema);
        //add to store
        store = setStore(store, entities.assetWithdrawal);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    getAssetWithdrawalByID(id){
        return store[id] ? store[id] : null;
    },

    getManyAssetWithdrawalByIDArray(assWithIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < assWithIDs.length; i++){
            //get current id
            id = assWithIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    },//end getManyAssetWithhrawalByIDArray
}

export function emptyAssetWithdrawalStore(){
    store = {};
}