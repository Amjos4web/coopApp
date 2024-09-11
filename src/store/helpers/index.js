import axios from "../api";
/**
 * I needed this when data need to be fetch from different table to display info to client
 * instead of fetching one after the other and doing multiple request, why not fetch everything
 * once and use promise to distribute the data later.
 */
class FetchManyFromTheSameSource{
    constructor(url, options){
        //store the promise resolver and reject
        this.promiseStore = {};
        //indicate weather the current request is already requesting from server
        //if so, new object need to be created to cater for 
        this.inFlight = false;
        //in other to defer request to server and gather id of row to fetch together
        //I need to defer request to server, so i need to save immediate timeout and clear it
        //untill all row ID to be fetch at once are added
        this.immediateTimeout = null;
        //the url to fetch from
        this.url = url;
        //any other to be added to request
        this.options = options;
    }

    /**
     * 
     * @param {ID} id - unique ID of the data to be fetch from server
     * @returns {Promise<any>}
     */
    push(id){
        //delay request 
        if(!this.inFlight){
            clearImmediate(this.immediateTimeout);
        }
        //return promise to caller, when data comes back
        //their resolver will be called, to hand over the data
        return new Promise((resolve, reject)=>{
            //save promise resolve and reject to be used later, when network request is completed.
            this.promiseStore[id] = {resolve, reject};
            //delay request, till next execution cycle
            this.immediateTimeout = setImmediate(()=>{
                //indicate the network request is already in progress, so as not clear it
                this.inFlight = true;

                //make network request here to the server
                /**
                 * What is actually happening here is that, we'll continue to defer call to
                 * the server for data until the last synchronous id is added to the batch of
                 * the request to be made to the server. When the last ID is added, no more call
                 * and no more cancelling of set immediate, then client can finally go and make to 
                 * the server
                 * 
                 */
                axios.post(this.url, {paramIDs:Object.keys(this.promiseStore)})
                .then(resp=>{
                    const {data} = resp.data
                    //I need to turn array to object to match them to the given client ID
                    const tempStore = {};
                    //loop thru what server sent us
                    for(let d in data){
                        //turn to object
                        tempStore[d.id] = d;
                    }//end for loop
                    /**
                     * if request is successful distribute using store resolve
                     */
                    for(let id in this.promiseStore){
                        this.promiseStore[id].resolve(tempStore[id] ? tempStore[id] : null);
                    }
                })
                .catch(e=>{
                    /**
                     * if error occur, its tricky, I'll coordinate with front-end guy
                     * so as to send error to parent component and not child component
                     * 
                     * if rejectAll in option is set true, I need to loop thru store and call 
                     * reject with error else I'll just use the reject of the last promise in store,
                     * If I do that the parent of the component should display the error
                     * 
                     */
                    //this.promiseStore[id].reject(new Error("Error occur"));
                    if(this.options.rejectAll){
                        for(let id in this.promiseStore){
                            this.promiseStore[id].reject(e);
                        }
                    }else{
                        //use last push id to reject 
                        this.promiseStore[id].reject(e);
                    }
                })
                //free memory, not neccessary
                this.promiseStore = null;
            });
        });      
    }

    /**
     * @returns {boolean}
     */
    isInFlight(){
        return this.inFlight;
    }
}

/**
 * Hold current fetch many object
 */
let fetchManyObj = null;

/**
 * 
 * @param {string} url 
 * @param {FetchManyOption} options 
 * @param {ID} id 
 */
export function fetchManySingleton(url, options = {rejectAll:false}, id){
    //if its null current object is already in process
    if(fetchManyObj === null || fetchManyObj.isInFlight() || fetchManyObj.url !== url){
        //create a new batch
        fetchManyObj = new FetchManyFromTheSameSource(url, options);
    }
    //add to queue to be process in the next execution
    return fetchManyObj.push(id);
}//end function