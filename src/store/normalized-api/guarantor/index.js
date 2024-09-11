import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const guarantorSchema = new schema.Entity("guarantors");
const arrayOfGuarantorSchema = [guarantorSchema];

/**
 * @type {LoanGuarantorObject}
 */
let store = {};

export default {
    /**
     * 
     * @param {LoanGuarantor} guarantor 
     * @returns {string | number} return the record ID of the added guarantor
     * @description Normalize a single guarantor and then add to store.
     */
    addGuarantor(guarantor){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(guarantor, guarantorSchema);
        //add to store
        store = setStore(store, entities.guarantors);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    /**
     * 
     * @param {LoanGuarantor[]} guarantors 
     * @returns {ID[]} return array of the ID of the added data
     * @description Normalize array of loan and then add to store.
     */
    addGuarantorList(guarantors){
        //normalize sent guarantor list
        const {entities, result} = normalize(guarantors, arrayOfGuarantorSchema);
        //save back in store
        store = setStore(store, entities.guarantors);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the guarantor to fetch from store
     * @returns {LoanGuarantor | null} - return the guarantor if found else null
     */
    getGuarantorByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    /**
     * 
     * @param {ID[]} guarantorIDs 
     * @returns {LoanGuarantor[]}
     */
    getManyGuarantorByIDArray(guarantorIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < guarantorIDs.length; i++){
            //get current id
            id = guarantorIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyGuarantorByID
}

export function emptyGuarantorStore(){
    store = {};
}