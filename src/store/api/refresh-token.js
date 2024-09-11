import axios, {AUTH_URL} from "./index";
import VueCookie from "vue-cookie"
import event from "../../utility/event";
import { getErrorFromResponse, REFRESH_TOKEN_EVENT_TYPE } from "../../utility";

function refreshTokenHelper(){
    console.log("refreshing...");
    //event.emit(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_IN_PROGRESS);
    axios(AUTH_URL.refresh)
    .then(resp=>{
        const {authorization} = resp.data.data;
        VueCookie.set("token", authorization.token)
        refreshToken(authorization.expires_in);
    })
    .catch(e=>{
        console.log(e);
        //don't refresh again since client need to relogin again
        clearTimeout(timeout);
        event.emit(
            REFRESH_TOKEN_EVENT_TYPE.REFRESH_TOKEN_ERROR, getErrorFromResponse(e)
        );
    })
    .then(()=>{
        console.log("last then called....");
        event.emit(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_DONE)
    })
}

let timeout = null;
const SECOND_BEFORE_TOKEN_EXPIRES = 10;

/**
 * 
 * @param {number} refreshTokenInterval 
 * @description refresh client token base on token interval sent by server
 */
export default function refreshToken(refreshTokenInterval=0){
    console.log(refreshTokenInterval)
    //
    timeout = setTimeout(
        //this method will be called 10 seconds before current 
        refreshTokenHelper,
        //refresh 10 seconds to token expiry
        (
            ((SECOND_BEFORE_TOKEN_EXPIRES >= refreshTokenInterval) 
            ? refreshTokenInterval 
            : (refreshTokenInterval - SECOND_BEFORE_TOKEN_EXPIRES)
            ) * 1000
        )
    );
}

//if user logout or page is closed, we need to do some cleaning up
//to avoid memory leak;
event.on(REFRESH_TOKEN_EVENT_TYPE.CANCEL_REFRESHING_TOKEN, ()=>clearTimeout(timeout));
