import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const amtGivenHistorySchema = new schema.Entity("amountGivenHistories");
const arrayOfAmtGivenHistorySchema = [amtGivenHistorySchema];

/**
 * @type {LoanRequestAmountHistoryObject}
 */
let store = {};

export default{
    /**
     * 
     * @param {LoanRequestAmountHistory} loanAmountGivenHistory 
     * @returns {string | number} return the record ID of the added loan payment history
     * @description Normalize a single loan payment history and then add to store.
     */
    addLoanAmountGivenHistory(loanAmountGivenHistory){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(loanAmountGivenHistory, amtGivenHistorySchema);
        //add to store
        store = setStore(store, entities.amountGivenHistories);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    /**
     * 
     * @param {LoanRequestAmountHistory[]} loanAmountGivenHistories
     * @returns {ID[]} return array of the ID of the added data
     * @description Normalize array of loan and then add to store.
     */
    addLoanAmountGivenHistoryList(loanAmountGivenHistories){
        //normalize sent loan payment list
        const {entities, result} = normalize(loanAmountGivenHistories, arrayOfAmtGivenHistorySchema);
        //save back in store
        store = setStore(store, entities.amountGivenHistories);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the loan payment history to fetch from store
     * @returns {LoanRequestAmountHistory | null} - return the loan payment history if found else null
     */
    getLoanAmountGivenHistoryByID(id){
        return store[id] ? store[id] : null;
    },

    /**
     * 
     * @param {ID[]} loanAmountGivenHistoryIDs 
     * @returns {LoanRequestAmountHistory[]}
     */
    getManyLoanAmountGivenHistoryByIDArray(loanAmountGivenHistoryIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < loanAmountGivenHistoryIDs.length; i++){
            //get current id
            id = loanAmountGivenHistoryIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyGuarantorByID
}

export function emptyLoanAmountGivenHistoryStore(){
    store = {};
}