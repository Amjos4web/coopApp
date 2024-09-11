import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const paymentTypeSchema = new schema.Entity("payment_types");
const arrayOfPaymentTypeSchema = [paymentTypeSchema];

let store = {};

export default{
    addPaymentType(paymentType){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(paymentType, paymentTypeSchema);
        //add to store
        store = setStore(store, entities.payment_types);
        //console.log(store, result);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    addPaymentTypeList(paymentTypes){
        //normalize sent payment types list
        const {entities, result} = normalize(
            paymentTypes, arrayOfPaymentTypeSchema
        );
        //save back in store
        store = setStore(store, entities.payment_types);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getPaymentTypeByID(id){
        //console.log(store, id);
        return store[id] ? store[id] : null;
    },

    getManyPaymentTypeByIDArray(paymentTypeIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < paymentTypeIDs.length; i++){
            //get current id
            id =paymentTypeIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyPaymentTypeByIDArray
}

export function emptyPaymentTypeStore(){
    store = {};
}