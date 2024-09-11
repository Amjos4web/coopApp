import {schema, normalize} from "normalizr";
import {setStore} from "../../../utility";

const meetingCalendarSchema = new schema.Entity("meeting_calendars");
const arrayOfMeetingCalendarSchema = [meetingCalendarSchema];

let store = {};

export default {
    addMeetingCalendar(meetingCalendar){
        //get the entities and results, the result contain the ID of the record
        const {entities, result} = normalize(meetingCalendar, meetingCalendarSchema);
        //add to store
        store = setStore(store, entities.meeting_calendars);
        //return id to be kept by clients that'll use the API
        //this value will be use to fetch the data later
        return result;
    },

    addMeetingCalendarList(meetingCalendars){
        //normalize sent meeting calendar list
        const {entities, result} = normalize(meetingCalendars, arrayOfMeetingCalendarSchema);
        //save back in store
        store = setStore(store, entities.meeting_calendars);
        //the value will be use later to fetch the data from cache
        return result;
    },//end method

    getMeetingCalendarByID(id){
        return store[id] ? store[id] : null;
    },

    getManyMeetingCalendarByIDArray(meetingCalendarIDs = []){
        //store array of item fetch from store
        const temp = []; 
        //store current id
        let id = null;
        //loop thru send ID
        for(let i = 0; i < meetingCalendarIDs.length; i++){
            //get current id
            id = meetingCalendarIDs[i];
            //if one item cannot be found at least, we can trust the store again
            //just fetch from server
            if(!store[id]) return null;
            temp.push(store[id]);
        }//end for loop
        //return temp
        return temp;
    }//end getManyMeetingCalendarByIDArray
}

export function emptyMeetingCalendarStore(){
    store = {};
}