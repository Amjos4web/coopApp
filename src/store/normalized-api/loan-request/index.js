import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const loanSchema = new schema.Entity("loans");
const arrayOfLoanSchema = [loanSchema];

/**
 * @type {LoanRequestObject}
 */
let store = {};

export default {
    /**
     * 
     * @param {LoanRequest} loan 
     * @returns {string | number} return the record ID of the added loan
     * @description Normalize a single loan and then add to store.
     */
    addLoan(loan){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(loan, loanSchema);
        //add to store
        store = setStore(store, entities.loans);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    /**
     * 
     * @param {LoanRequest[]} loans 
     * @returns {ID[]} return array of the ID of the added data
     * @description Normalize array of loan and then add to store.
     */
    addLoanList(loans){
        //normalize sent loan list
        const {entities, result} = normalize(loans, arrayOfLoanSchema);
        //save back in store
        store = setStore(store, entities.loans);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the loan to fetch from store
     * @returns {LoanRequest | null} - return the loan if found else null
     */
    getLoanByID(id){
        return store[id] ? store[id] : null;
    },

    /**
     * 
     * @param {ID[]} loanIDs 
     * @returns {LoanRequest[]}
     */
    getManyLoanByIDArray(loanIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < loanIDs.length; i++){
            //get current id
            id = loanIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyLoanByID
}

export function emptyLoanStore(){
    store = {};
}