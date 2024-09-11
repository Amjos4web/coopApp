export const EVENT_TYPE = {
    CLEAN_UP:"2",
    DONE_FETCHING_SETTING:"3",
};

const handler = {};
export default {
    /**
     * 
     * @param {string} eventType 
     * @param  {Array} args 
     */
    emit(eventType, ...args){
        if(handler[eventType]){
            for(let i = 0; i < handler[eventType].length; i++){
                (handler[eventType][i])(...args);
            }//end for loop
        }//end if
    },
    /**
     * 
     * @param {string} eventType 
     * @param {Function} handler 
     */
    on(eventType, eventHandler){
        if(handler[eventType]){
            handler[eventType].push(eventHandler);
        }else{
            handler[eventType] = [eventHandler];
        }
    },

    removeHandler(eventType){
        handler[eventType] = null;
        delete handler[eventType];
    }
}
