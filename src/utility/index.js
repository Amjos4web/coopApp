
export function setStore(oldStore, newStoreData){
    return {...oldStore, ...newStoreData};
}

/**
 * 
 * @param {ID[]} arrayOfID 
 * @returns {ID[]}
 */
export function makeStoreIDUnique(arrayOfID){
    
    const store = {};

    for(let i = 0; i < arrayOfID.length; i++){
        store[arrayOfID[i]] = true;
    }
    
    return Object.keys(store);
}

/**
 * 
 * @param {ID[]} arrayOfID 
 * @param {ID} id 
 * @returns {boolean}
 */
export function inStore(arrayOfID, id){
    
    //if value is not number or string, throw 
    if(!(isString(id) || isNumber(id))){
        throw new Error("id must be of type 'string' or 'number' but found '" + typeof(id) + " '");
    }
    if(!Array.isArray(arrayOfID)){
        throw new Error("arrayOfID must be an 'array' but found '" + typeof(arrayOfID) + " '");
    }
    id = id.toString();
    return arrayOfID.indexOf(id) > -1
}

export function isString(val){
    return Object.prototype.toString.call(val) === "[object String]";
}

export function isNumber(val){
    return Object.prototype.toString.call(val) === "[object Number]";
}

export function isObject(val){
    return Object.prototype.toString.call(val) === "[object Object]";
}

export function generateUniqueRandomNumber(){
    return (Math.random() * Math.random() * Math.random()).toString(16).replace(".", "");
}

export function getError(code=500, msg="Internal server error, try again later.", errors=null){
    const error = new Error(msg);
    error.errors = errors;
    error.code = code;
    return error;
}

/**
 * 
 * @param {Error} e 
 */
export function getErrorFromResponse(e=null){
    if(!e) return getError();

    if(e.response && e.response.data){
        console.log(e.response)
        return getError(e.response.status, e.response.data.msg, e.response.data.errors);
    }
    e.code = 500;
    return e;
}

// export function getErrorFromResponse(e = null) {
//   if (!e) return getError();

//   // Case 1: Axios HTTP error with response
//   if (e.response && e.response.data) {
//     const { status, data } = e.response;
//     let message = "An unexpected error occurred.";
//     let errors = null;

//     console.log(e.response)

//     // Laravel validation errors
//     if (status === 422 && data.errors) {
//       const firstKey = Object.keys(data.errors)[0];
//       message = data.errors[firstKey][0] || "Validation failed.";
//       errors = data.errors;
//     }
//     // Laravel or custom error message
//     else if (data.msg) {
//       message = data.msg;
//     } 
//     else if (data.message) {
//       message = data.message;
//     } 
//     else if (data.error) {
//       message = data.error;
//     }

//     return getError(status, message, errors);
//   }

//   // Case 2: Network/timeout or no response
//   if (e.request && !e.response) {
//     return getError(503, "Network error — please check your connection and try again.");
//   }

//   // Case 3: JavaScript or unexpected error
//   const message = e.message || "Unexpected client-side error occurred.";
//   return getError(500, message);
// }

export function debug(label="label", ...args){
    // console.group(label)
    // args.forEach(a=>console.log(a))
    // console.groupEnd()
}

export const REFRESH_TOKEN_EVENT_TYPE = {
    REFRESH_TOKEN_ERROR:"0",
    CANCEL_REFRESHING_TOKEN:"1",
    TOKEN_REFRESH_IN_PROGRESS:"2",
    TOKEN_REFRESH_DONE:"3"
};

export const turnArrayToObject = (list)=>{
    const store = {}
    let curItem = null
    for(let i = 0; i < list.length; i++){
        curItem = list[i]
        store[curItem.id] = curItem
    }//end for loop
    return store
}//end function turnA