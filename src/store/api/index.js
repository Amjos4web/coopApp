import axios from "axios";
import NProgress from 'nprogress'
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
    get_all_my_loan_guarantor_req:"/api/v1/my/get_all/loan_request/guarantors/",
    get_loan_duration_for_admin:"/api/v1/admin/loan_request/loan_duration/",
    get_loan_duration_for_member:"/api/v1/my/loan_request/loan_duration/"
};

export const MEMBER_URL = {
    index:"/api/v1/admin/members",
    get_one:"/api/v1/admin/members/",
    add_new_member:"/api/v1/admin/members",
    update_member:"/api/v1/admin/members/",
    fetch_many_member:"/api/v1/admin/members/fetch_many/by_id",
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
    fetch_many_payment_types:"/api/v1/admin/payment_types/fetch_many/by_id"
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
    update_member_payment:"/api/v1/admin/member_payments/update/payment/",
    fetch_member_monthly_payment:"/api/v1/admin/member_payments/",
    fetch_member_total_asset:"/api/v1/admin/member_payments/total_assets/",
    fetch_my_total_asset:"/api/v1/my/member_payments/total_assets/",
    fetch_many_member_total_assets:"/api/v1/admin/member_payments/many_member/total_assets/",
    fetch_member_payment_with_meeting:"/api/v1/admin/member_payments/update",
    fetch_member_passbook_for_admin:"/api/v1/admin/member_payments/data/analysis/member_passbook",
    fetch_member_passbook_for_member:"/api/v1/my/member_payments/data/analysis/member_passbook"
}

export const ASSET_WITHDRAWAL_URL = {
    index:"/api/v1/admin/asset_withdrawal",
    get_one:"/api/v1/admin/asset_withdrawal/",
    save_asset_withdrawal:"/api/v1/admin/asset_withdrawal",
    update_asset_withdrawal:"/api/v1/admin/asset_withdrawal/",
    delete_asset_withdrawal:"/api/v1/admin/asset_withdrawal/"
}

export const MEMBER_ONLINE_PAYMENT_URL = {
    save_member_payment:"/api/v1/my/member_payments/monthly/payment/save",
    fetch_my_monthly_payment:"/api/v1/my/member_payments/monthly/payment",
    send_payment_data_to_paystack:"/api/v1/my/member_payments/monthly/payment/callback",
    get_online_payment_for_admin:"/api/v1/admin/online_member_payment/payment",
    change_reference_no:"/api/v1/admin/member_payments/reference/update",
    verify_payment:"/api/v1/admin/member_payments/verify/payment"
}

export const ROLE_PERMISSION_URL = {
    index:"/api/v1/admin/role_permissions/accounts/",
    save_society_delegate:"/api/v1/admin/role_permissions/society_delegate",
    save_staff_or_union_exec:"/api/v1/admin/role_permissions/staff_or_union_executive",
    role_perm_routes_paths:"/api/v1/admin/role_permissions/routes_and_paths"
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
    move_member_to_new_society:"/api/v1/admin/society_members/move_member",
    get_many_society_member_by_member_id:"/api/v1/admin/society_members/get_many/by_member_id",
}

export const SOCIETY_PAY_MIN_AMOUNT = {
    get_one:"/api/v1/admin/society_payments_minimum_amounts/",
    add_new:"/api/v1/admin/society_payments_minimum_amounts/see",
    update:"/api/v1/admin/society_payments_minimum_amounts/see/",
    get_society_pay_min_amounts:"/api/v1/admin/society_payments_minimum_amounts/society/",
}

export const USER_URL = {
    index:"/api/v1/admin/users",
    reset_password:"/api/v1/admin/users/reset_password/",
    get_one:"/api/v1/admin/users/",
    toggle_account:"/api/v1/admin/users/activate_or_deactivate_account/",
    update_user_avatar:"/api/v1/admin/users/upload_member_passport/",
}

export const SOCIETY_PAYMENTS_URL = {
    get_society_payment:"/api/v1/admin/society_payments/",
    save_society_payment:"/api/v1/admin/society_payments"
}

export const SOCIETY_LOAN_URL = {
    index:"/api/v1/admin/society_loan",
    get_one:"/api/v1/admin/society_loan/",
    save_loan_from_admin:"/api/v1/admin/society_loan/save",
    get_society_loan_4_society_delegate:"/api/v1/society_delegate/society_loans/",
    admin_update_loan_interest:"/api/v1/admin/society_loans/update_interest_rate/",
    get_society_loan_payment_history_4_delegate:"/api/v1/society_delegate/society_loans/society_loan_payment_history/",
    get_society_loan_payment_history_4_admin:"/api/v1/admin/society_loans/society_loan_payment_history/",
    get_amount_given_history_4_del:"/api/v1/society_delegates/society_loans/society_amount_given_history/",
    get_amount_given_history_4_admin:"/api/v1/admin/society_loans/society_amount_given_history/",
    admin_edit_society_loan_amount:"/api/v1/admin/society_loans/edit_loan_amount_given/",
    admin_add_to_society_loan_amount:"/api/v1/admin/society_loans/add_new_given_loan_amount/",
};

export const REVENUE_URL = {
    view_member_total_assets:"/api/v1/admin/member_payments/data/analysis/view_member_total_assets",
    society_member_payment_records:"/api/v1/admin/member_payments/data/analysis/society_member_payment_records/"
}

export const DASHBOARD_URL = {
    index: "/api/v1/dashboard/user",
    get_current_loan_payment_balance:"/api/v1/dashboard/loan_balance/",
    fetch_all_member_total_assets:"/api/v1/admin/member_payments/all_member/get/total_assets/",
    get_all_loan_issued_out:"/api/v1/admin/member_payments/get_all_loan_issued_out"
}

export const SOCIETY_ACCOUNT_URL = {
    index: "/api/v1/admin/society_accounts",
    show: "/api/v1/admin/society_account_detail",
    deposit: "/api/v1/admin/society_accounts",
    withdraw: "/api/v1/admin/society_accounts",
    borrow: "/api/v1/admin/society_accounts",
    repay: "/api/v1/admin/society_accounts"
}

export const SMS_LOG_URL = {
    index: "/api/v1/admin/sms/logs",
}

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

//let us delay request until new token is requested and return from server
let refreshingToken = false

const api = axios.create({
    baseURL:"http://127.0.0.1:8000",
    timeout:0, 
    withCredentials:true,
})

api.interceptors.request.use(function(config){
    if(config.url == AUTH_URL.login) return config
    
    if(config.url == AUTH_URL.refresh){
        refreshingToken = true
    }
    else if(config.url == AUTH_URL.self){
        config.headers.Authorization = `Bearer ${VueCookie.get(`token`)}`;
        config.headers['Cache-Control'] = 'no-cache';
        // Do something before request is sent
        return config    
    }
    else if(refreshingToken){
        return new Promise(resolve=>{
            //wait for refresh to finish
            event.on(REFRESH_TOKEN_EVENT_TYPE.TOKEN_REFRESH_DONE, ()=>{
                //add brearer
                config.headers.Authorization = `Bearer ${VueCookie.get(`token`)}`
                config.headers['Cache-Control'] = 'no-cache';
                //set it that we are done refreshing
                refreshingToken = false;
                resolve(config)
            })//end event
        })//end promise
    }//end else
    config.headers.Authorization = `Bearer ${VueCookie.get(`token`)}`
    config.headers['Cache-Control'] = 'no-cache';
    // Do something before request is sent
    NProgress.start()
    return config
}, function(error){
    NProgress.done()
    return Promise.reject(error)
});

api.interceptors.response.use(function(response) {
    NProgress.done()
    return response
})

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
                store.push(`${title}[${key}]=${encodeURIComponent(val)}`)
            }
            else if(isValid(val)){
                store.push(`${key}=${encodeURIComponent(val)}`);
            }//end else
        }//end if(val)
    }//end for loop
    return store.join("&");
}//end export