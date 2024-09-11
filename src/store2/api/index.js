import axios from "axios";
import VueCookie from 'vue-cookie'

import {isNumber, isObject, isString} from "../../utility"

export const AUTH_URL = {
    login : "/api/v1/auth/login",
    self : "/api/v1/auth/self",
    logout : "/api/v1/auth/logout",
    refresh:"/api/v1/auth/refresh",
    change_psd:"/api/v1/auth/change_password"
}

export const LOAN_URL = {
    index:"/api/v1/admin/loan_requests",
    get_one:"/api/v1/admin/loan_requests/",
    save_loan_from_admin:"/api/v1/admin/loan_requests/save",
    save_loan_from_member:"/api/v1/my/loan_requests/save",
    get_my_loan_requests:"/api/v1/my/loan_requests/get_all",
    get_guarantors_4_member:"/api/v1/my/loan_requests/get_guarantors/",
    get_guarantors_4_admin:"/api/v1/admin/loan_requests/get_guarantors/",
    admin_respond_to_loan_guarator_req:"/api/v1/admin/loan_requests/respond_to/guarantor_request",
    member_respond_to_loan_guarator_req:"/api/v1/my/loan_requests/respond_to_guarantor_request",
    admin_respond_to_loan_req:"/api/v1/admin/loan_requests/response",
    admin_update_loan_interest:"/api/v1/admin/loan_requests/update_interest_rate/",
    member_loan_payment_history:"/api/v1/my/loan_requests/payment_history/",
    admin_loan_payment_history:"/api/v1/admin/loan_requests/payment_history/",
    loan_amount_given_history:"/api/v1/admin/loan_requests/loan_amount_given_history/",
    update_loan_amount_given_history:"/api/v1/admin/loan_requests/update_amount_given_as_loan/",
    change_loan_status_to_pending:"/api/v1/admin/loan_requests/change_status_to_pending/",
    give_more_loan_member:"/api/v1/admin/loan_requests/give_more_loan_money_to member/",
};

export const MEMBER_URL = {
    index:"/api/v1/admin/members",
    get_one:"/api/v1/admin/members/",
    add_new_member:"/api/v1/admin/members",
    update_member:"/api/v1/admin/members/"
}

export const MEETING_CALENDAR = {
    index:"/api/v1/admin/meeting_calendars",
    save_meeting_calendar:"/api/v1/admin/meeting_calendars/save/",
    get_society_meeting_calendar_for_year:"/api/v1/admin/meeting_calendars/"
}

export const PAYMENT_TYPE_URL = {
    index:"/api/v1/admin/payment_types",
    get_one:"/api/v1/admin/payment_types/",
    add_new_payment_type:"/api/v1/admin/payment_types",
    update_payment_type:"/api/v1/admin/payment_types/",
}

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const api = axios.create({
    baseURL:"http://192.168.43.172:8080",
    timeout:0, 
    withCredentials:true,
});

api.interceptors.request.use(function(config){
    //console.log(config, config.url, AUTH_URL.login);
    if(config.url !== AUTH_URL.login){
        //set token
        config.headers.Authorization = `Bearer ${VueCookie.get('token')}`
    }
    return config
}, function(error){
    return Promise.reject(error);
})

export default api

const isValid = (val)=>(isString(val) || isNumber(val));

//filter[name]=ola&filter[society_id]=10
export const turnObjectToQueryString = function(keyValues = {}, title=null){
    //store parsed query string
    const store = [];
    //store object value
    let val = null;

    //loop thru key value pair 
    for(let key in keyValues){
        //store current value
        val = keyValues[key];
        //if val is not null
        if(val){
            //if its object
            if(isObject(val) && (key === "filter" || key === "order")){
                //call recursively
                store.push(turnObjectToQueryString(val, key));
            }//end if
            else if(title && isValid(val)){
                //if title
                console.log(`${title}[${key}]=${encodeURIComponent(val)}`);
                store.push(`${title}[${key}]=${encodeURIComponent(val)}`)
            }
            else if(isValid(val)){
                store.push(`${key}=${encodeURIComponent(val)}`);
            }//end else
        }//end if(val)
    }//end for loop
    return store.join("&");
}//end export