import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const societyLoanPaymentSchema = new schema.Entity("societyLoanPayHistories");
const arrayOfSocietyLoanPaymentSchema = [societyLoanPaymentSchema];


let store = {};

export default {
    
    addLoanPaymentHistory(loanPayHistory){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(loanPayHistory, societyLoanPaymentSchema);
        //add to store
        store = setStore(store, entities.societyLoanPayHistories);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    
    addLoanPaymentList(loanPayHistories){
        //normalize sent loan payment list
        const {entities, result} = normalize(loanPayHistories, arrayOfSocietyLoanPaymentSchema);
        //save back in store
        store = setStore(store, entities.societyLoanPayHistories);
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

export function emptySocietyLoanPaymentHist(){
    store = {};
}