import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const loanPaymentSchema = new schema.Entity("loanPayHistories");
const arrayOfLoanPaymentSchema = [loanPaymentSchema];

/**
 * @type {LoanPaymentHistoryObject}
 */
let store = {};

export default {
    /**
     * 
     * @param {LoanPaymentHistory} loanPayHistory 
     * @returns {string | number} return the record ID of the added loan payment history
     * @description Normalize a single loan payment history and then add to store.
     */
    addLoanPaymentHistory(loanPayHistory){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(loanPayHistory, loanPaymentSchema);
        //add to store
        store = setStore(store, entities.loanPayHistories);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    /**
     * 
     * @param {LoanPaymentHistory[]} loanPayHistories 
     * @returns {ID[]} return array of the ID of the added data
     * @description Normalize array of loan and then add to store.
     */
    addLoanPaymentList(loanPayHistories){
        //normalize sent loan payment list
        const {entities, result} = normalize(loanPayHistories, arrayOfLoanPaymentSchema);
        //save back in store
        store = setStore(store, entities.loanPayHistories);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the loan payment history to fetch from store
     * @returns {LoanPaymentHistory | null} - return the loan payment history if found else null
     */
    getLoanPaymentHistoryByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    /**
     * 
     * @param {ID[]} loanPaymentHistIDs 
     * @returns {LoanPaymentHistory[]}
     */
    getManyLoanPaymentHostoryByIDArray(loanPaymentHistIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < loanPaymentHistIDs.length; i++){
            //get current id
            id = loanPaymentHistIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyGuarantorByID
}

export function emptyLoanPaymentHistoryStore(){
    store = {};
}