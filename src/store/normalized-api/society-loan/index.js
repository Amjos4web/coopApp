import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const societyLoanSchema = new schema.Entity("society_loans");
const arrayOfSocietyLoanSchema = [societyLoanSchema];


let store = {};

export default {
    
    addSocietyLoan(societyLoan){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(societyLoan, societyLoanSchema);
        //add to store
        store = setStore(store, entities.society_loans);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    
    addSocietyLoanList(societyLoans){
        //normalize sent loan list
        const {entities, result} = normalize(societyLoans, arrayOfSocietyLoanSchema);
        //save back in store
        store = setStore(store, entities.society_loans);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getSocietyLoanByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    getManySocietyLoanByIDArray(loanIDs = []){
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

export function emptySocietyLoanStore(){
    store = {};
}