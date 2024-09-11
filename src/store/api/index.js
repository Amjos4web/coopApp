import axios from "axios";
import VueCookie from "vue-cookie"
import {isNumber, isObject, isString, REFRESH_TOKEN_EVENT_TYPE} from "../../utility"
import event from "../../utility/event"

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
    get_all_my_loan_guarantor_req:"/api/v1/my/get_all/loan_request/guarantors/"
};

export const MEMBER_URL = {
    index:"/api/v1/admin/members",
    get_one:"/api/v1/admin/members/",
    add_new_member:"/api/v1/admin/members",
    update_member:"/api/v1/admin/members/",
    fetch_many_member:"/api/v1/admin/members/fetch_many",
}

export const MEETING_CALENDAR_URL = {
    index:"/api/v1/admin/meeting_calendars",
    save_meeting_calendar:"/api/v1/admin/meeting_calendars/save/",
    get_society_meeting_calendar_for_year:"/api/v1/admin/meeting_calendars/",
    get_meeting_calendar_years:"/api/v1/admin/meeting_calendars/save/get/years"
}

export const PAYMENT_TYPE_URL = {
    index:"/api/v1/admin/payment_types",
    get_one:"/api/v1/admin/payment_types/",
    add_new_payment_type:"/api/v1/admin/payment_types",
    update_payment_type:"/api/v1/admin/payment_types/",
}

export const ROLE_URL = {
    index:"/api/v1/admin/roles",
    get_one:'/api/v1/admin/roles/',
    add_new:'/api/v1/admin/roles',
    update:'/api/v1/admin/roles/'
}

export const SETTING_URL = {
    index:'/api/v1/admin/settings',
    save:'/api/v1/admin/settings',
}

export const SOCIETY_URL = {
    index:"/api/v1/admin/societies",
    get_one:"/api/v1/admin/societies/",
    add_new:"/api/v1/admin/societies",
    update:"/api/v1/admin/societies/",
    fetch_many:"/api/v1/admin/societies/fetch_many"
}

export const MEMBER_PAYMENT_URL = {
    save_member_payment:"/api/v1/admin/member_payments",
    fetch_member_monthly_payment:"/api/v1/admin/member_payments/",
    fetch_member_total_asset:"/api/v1/admin/member_payments/total_assets/",
    fetch_my_total_asset:"/api/v1/my/member_payments/total_assets/",
    fetch_many_member_total_assets:"/api/v1/admin/member_payments/many_member/total_assets/",
}

export const ROLE_PERMISSION_URL = {
    index:"/api/v1/admin/role_permissions/",
    save_society_delegate:"/api/v1/admin/role_permissions/society_delegate",
    save_staff_or_union_exec:"/api/v1/admin/role_permissions/staff_or_union_executive",
    role_perm_routes_paths:"/api/v1/admin/role_permissions/routes_and_paths",
}

export const SOCIETY_MEMBER_URL = {
    index:"/api/v1/admin/society_members",
    save:"/api/v1/admin/society_members",
    fetch_my_society:"/api/v1/my/society_members/my_societies/",
    fetch_member_society_for_admin:"/api/v1/admin/society_members/societies/",
    fetch_member_in_society:"/api/v1/admin/society_members/get_members_in_society/",
    fetch_member_of_my_society:"/api/v1/my/society_members/guarantors/",
    count_member_in_society:"/api/v1/admin/society_members/count_members_in_society",
    get_member_not_in_society:"/api/v1/admin/society_members/not_a_member_of_society/",
    remove_member_from_society:"/api/v1/admin/society_members/remove_member/",
    get_many_society_member_by_member_id:"/api/v1/admin/society_members/get_many/by_member_id",
}

export const SOCIETY_PAY_MIN_AMOUNT = {
    get_one:"/api/v1/admin/society_payments_minimum_amounts",
    add_new:"/api/v1/admin/society_payments_minimum_amounts/",
    update:"/api/v1/admin/society_payments_minimum_amounts/",
    get_society_pay_min_amounts:"/api/v1/admin/society_payments_minimum_amounts/society/",
}

export const USER_URL = {
    index:"/api/v1/admin/users",
    reset_password:"/api/v1/admin/users/reset_password/",
    get_one:"/api/v1/admin/users/",
    toggle_account:"/api/v1/admin/users/activate_or_deactivate_account/",
}

export const SOCIETY_PAYMENTS_URL = {
    index:"/api/v1/admin/society_payments/",
}

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

//let us delay request until new token is requested and return from server
let refreshingToken = false
event.on(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_IN_PROGRESS, ()=>{
    console.log("refreshing...");
    refreshingToken = true;
})

const api = axios.create({
    baseURL:"http://localhost:8080",
    timeout:0, 
    withCredentials:true,
})

api.interceptors.request.use(function(config){
    //console.log(config);
    if(refreshingToken && config.url !== AUTH_URL.self && config.url !== AUTH_URL.refresh){
        return new Promise(resolve=>{
            //wait for refresh to finish
            event.on(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_DONE, ()=>{
                //add brearer
                config.headers.Authorization = `Bearer ${VueCookie.get(`token`)}`
                //console.log("done refreshing...");
                //set it that we are done refreshing
                refreshingToken = false;
                resolve(config)
            })
        })
    }
    config.headers.Authorization = `Bearer ${VueCookie.get(`token`)}`
    //console.log(config.headers.Authorization);
    // Do something before request is sent
    return config
}, function(error){
    return Promise.reject(error);
});

export default api;

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