import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const societyPaymentMinAmountTypeSchema = new schema.Entity("society_payments_minimum_amount");
const arrayOfsocietyPaymentMinAmountTypeSchema = [societyPaymentMinAmountTypeSchema];

let store = {};

export default{
    addSocietyPaymentMinAmount(societyPaymentMinAmount){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(societyPaymentMinAmount, societyPaymentMinAmountTypeSchema);
        //add to store
        store = setStore(store, entities.society_payments_minimum_amount);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    addSocietyPaymentMinAmountList(societyPaymentMinAmounts){
        //normalize sent payment types list
        const {entities, result} = normalize(
            societyPaymentMinAmounts, arrayOfsocietyPaymentMinAmountTypeSchema
        );
        //save back in store
        store = setStore(store, entities.society_payments_minimum_amount);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getSocietyPaymentMinAmountByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    getManySocietyPaymentMinAmountByIDArray(societyPaymentMinAmountIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < societyPaymentMinAmountIDs.length; i++){
            //get current id
            id = societyPaymentMinAmountIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManySocietyByIDArray
}

export function emptySocietyPaymentMinAmountStore(){
    store = {};
}