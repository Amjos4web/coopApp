import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const amtGivenHistorySchema = new schema.Entity("societyLoanAmountGivenHistories");
const arrayOfAmtGivenHistorySchema = [amtGivenHistorySchema];


let store = {};

export default{
    
    addLoanAmountGivenHistory(loanAmountGivenHistory){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(loanAmountGivenHistory, amtGivenHistorySchema);
        //add to store
        store = setStore(store, entities.societyLoanAmountGivenHistories);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },
    addLoanAmountGivenHistoryList(loanAmountGivenHistories){
        //normalize sent loan payment list
        const {entities, result} = normalize(loanAmountGivenHistories, arrayOfAmtGivenHistorySchema);
        //save back in store
        store = setStore(store, entities.societyLoanAmountGivenHistories);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    /**
     * @param {ID} id - ID of the loan payment history to fetch from store
     * @returns {LoanRequestAmountHistory | null} - return the loan payment history if found else null
     */
    getLoanAmountGivenHistoryByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

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

export function emptySocietyLoanAmountGivenHist(){ 
    store = {};
}