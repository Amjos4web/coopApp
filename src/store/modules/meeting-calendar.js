
import {setIsLoading, setError} from "../constants";
import meetingCalendarStore from "../normalized-api/meeting-calendar";
import axios, {MEETING_CALENDAR_URL, turnObjectToQueryString} from "../api";
import { commitError, handleNoIDError, resolveWithDataFromStore, stopLoadingAndResolve } from "./app";
import { debug } from "../../utility";
import event,{ EVENT_TYPE } from "../../utility/event";

const initCache = {
    //save the last URL whose data was fetched
    //I have to keep it cos when a new data is added
    //I'll like to add it to the current item so as to assure
    //client the data was added    
    currentPage:{
        ids:[],
        pagination:{},
        url:""
    },

    meetingCalendarYears:null
}

let cache = initCache;

event.on(EVENT_TYPE.CLEAN_UP, ()=>{
    cache = initCache;
    debug("cleaning up", cache);
});

export default{
    namespaced:true,

    state:{
        //network request loading status
        isLoading:false,
        //
        error:null,
    },
    getters:{
        /**
         * @param {MemberState} state
         */
        isLoading:(state)=>state.isLoading,
        /**
         * @param {MemberState} state
         */
        error:(state)=>state.error
    },
    mutations:{
        /**
         * @param {MemberState} state
         */
        [setIsLoading]:(state, isLoading)=>(state.isLoading = isLoading),
        [setError]:(state, error)=>(state.error = error),
    },
    actions:{
        listSocietyMemberWhichHasMeetingToday({ commit }, {query={}, reload=false}={}){
            const url = MEETING_CALENDAR_URL.index + "?" + turnObjectToQueryString(query);
            debug("url", url);
            
            //if not to reload and data has already being cache fo this query
            if(!reload && cache.currentPage.url === url){
                const cacheMeetingCalendars = meetingCalendarStore.getManyMeetingCalendarByIDArray(
                    cache.currentPage.ids
                )

                if(cacheMeetingCalendars) return resolveWithDataFromStore(commit, {
                    meetingCalendars:cacheMeetingCalendars,
                    pagination:cache.currentPage.pagination
                });
            }//end if(!reload && cache.currentPage.url === url)

            commit(setIsLoading, true)

            return axios.get(MEETING_CALENDAR_URL.index)
            .then(resp=>{
                debug("resp", resp);
                const {data:{meetingCalendars}, pagination} = resp.data;

                cache.currentPage = {
                    url,
                    ids:meetingCalendarStore.addMeetingCalendarList(meetingCalendars),
                    pagination,
                };

                return { meetingCalendars, pagination };
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data));
        },//end listSocietyMemberWhichHasMeetingToday({ commit }, {query={}, reload=false}={})

        saveMeetingCalendar({ commit }, {society_id=null, year=null, meeting_dates=[]} = {}){

            if(!society_id) return handleNoIDError(commit, "Society ID is required");
            
            if(!year) return handleNoIDError(commit, "Year is required");

            commit(setIsLoading, true)

            return axios.put(
                MEETING_CALENDAR_URL.save_meeting_calendar + `${society_id}/${year}`, 
                {meeting_dates}
            )
            .then(resp=>{
                //get meeting calendar array from response
                const {meetingCalendars} = resp.data.data;
                debug("meeting calendars", meetingCalendars);

                //cache
                cache[`${society_id + year}`] = meetingCalendarStore.addMeetingCalendarList(
                    meetingCalendars
                );

                return meetingCalendars;
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },

        getMeetingCalendarForSocietyWithinAyear({ commit }, {society_id=null, year=null, reload=false} = {}){
            if(!society_id) return handleNoIDError(commit, "Society ID is required");
            
            if(!year) return handleNoIDError(commit, "Year is required");

            //get ids from cache
            const cacheMeetingCalendarIDs = cache[`${society_id + year}`];
            //if not to reload and its already cache
            if(!reload && cacheMeetingCalendarIDs){
                //get from cache
                const cacheMeetingCalendars = meetingCalendarStore.getManyMeetingCalendarByIDArray(
                    cacheMeetingCalendarIDs
                );
                //debug("cache", cacheMeetingCalendars);
                //if in cache return early
                if(cacheMeetingCalendars){ 
                    return resolveWithDataFromStore(commit, { meetingCalendars:cacheMeetingCalendars });
                }//end if
            }//end if
            commit(setIsLoading, true)
            return axios.get(
                MEETING_CALENDAR_URL.get_society_meeting_calendar_for_year + `${society_id}/${year}`
            )
            .then(resp=>{

                const {meetingCalendars} = resp.data.data;
                
                debug("after fetching meeting calendar", meetingCalendars)

                cache[`${society_id + year}`] = meetingCalendarStore.addMeetingCalendarList(
                    meetingCalendars
                );

                return {meetingCalendars};
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        },//end method

        getMeetingCalendarYear({ commit }, reload){
            if(!reload && cache.meetingCalendarYears) {
                return resolveWithDataFromStore(commit, {
                    meetingCalendarYears:cache.meetingCalendarYears
                })
            }//end if
            commit(setIsLoading, true)
            return axios.get(MEETING_CALENDAR_URL.get_meeting_calendar_years)
            .then(resp=>{
                
                const {meetingCalendarYears} = resp.data.data;
                
                cache.meetingCalendarYears = meetingCalendarYears
                return {meetingCalendarYears}
            })
            .catch(e=>commitError(commit, e))
            .then(data=>stopLoadingAndResolve(commit, data))
        }
    }//end action
}