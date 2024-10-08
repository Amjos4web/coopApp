import {emptyMemberStore} from "./member";
import {emptyUserStore} from "./user";
import {emptyLoanStore} from "./loan-request";
import {emptyGuarantorStore} from "./guarantor";
import {emptyLoanPaymentHistoryStore} from "./loan-payment-history";
import {emptyLoanAmountGivenHistoryStore} from "./loan-amount-given-history";
import { emptyMeetingCalendarStore } from "./meeting-calendar";
import {emptyPaymentTypeStore} from "./payment-types";
import {emptyRoleStore} from "./roles";
import { emptySettingStore } from "./settings";
import { emptyRolePermissionStore } from "./role-permission";
import { emptySocietyMemberStore } from "./society-member";
import { emptySocietyPaymentMinAmountStore } from "./society-minimum-payment-amount";
import {emptySocietyLoanStore} from "./society-loan"
import {emptySocietyLoanPaymentHist} from "./society-loan-payment-hist"
import {emptySocietyLoanAmountGivenHist} from "./society-loan-amount-given-hist"

export const STORE = {
    MEMBER:"member",
    USER:"user",
    LOAN:"loan",
    GUARANTOR:"guarantor",
    LOAN_PAY_HIST:"loan_pay_hist",
    LOAN_AMT_GIVEN_HIST:"loan_amt_given_hist",
    MEETING_CALENDAR:"meeting_calendar",
    MEMBER_PAYMENT:"member_payment",
    PAYMENT_TYPE:"payment_type",
    ROLE:"role",
    SETTING:"setting",
    ROLE_PERMISSION:"role_permission",
    SOCIETY_MEMBER:'society_member',
    SOCIETY_PAYMENT_MIN_AMOUNT:"society_pay_min_am",
    //SOCIETY_PAYMENT:"society_payments",
    SOCIETY_LOAN:"society_loans",
    SOCIETY_PAY_HIST:"society_pay_hist",
    SOCIETY_LOAN_AMOUNT_GIVEN_HIST:"society_loan_amount_given",
}

export function emptyStore(whichStore=[]){
    
    if(whichStore.length < 1){
        emptyMemberStore();
        emptyUserStore();
        emptyLoanStore();
        emptyGuarantorStore();
        emptyLoanPaymentHistoryStore();
        emptyLoanAmountGivenHistoryStore();
        emptyMeetingCalendarStore();
        emptyPaymentTypeStore();
        emptyRoleStore();
        emptySettingStore();
        emptyRolePermissionStore();
        emptySocietyMemberStore();
        emptySocietyPaymentMinAmountStore()
        emptySocietyLoanStore()
        emptySocietyLoanPaymentHist()
        emptySocietyLoanAmountGivenHist()
        return;
    }

    for(let i = 0; i < whichStore.length; i++){
        switch(whichStore[i]){
            case STORE.USER:
                emptyUserStore();
            break;
            case STORE.MEMBER:
                emptyMemberStore();
            break;
            case STORE.LOAN:
                emptyLoanStore();
            break;
            case STORE.GUARANTOR:
                emptyGuarantorStore();
            break;
            case STORE.LOAN_PAY_HIST:
                emptyLoanPaymentHistoryStore();
            break;
            case STORE.LOAN_AMT_GIVEN_HIST:
                emptyLoanAmountGivenHistoryStore();
            break;
            case STORE.MEETING_CALENDAR:
                emptyMeetingCalendarStore();
            break;
            case STORE.PAYMENT_TYPE:
                emptyPaymentTypeStore()
            break;
            case STORE.ROLE:
                emptyRoleStore()
            break;
            case STORE.SETTING:
                emptySettingStore()
            break;
            case STORE.ROLE_PERMISSION:
                emptyRolePermissionStore()
            break;
            case STORE.SOCIETY_MEMBER:
                emptySocietyMemberStore()
            break;
            case STORE.SOCIETY_PAYMENT_MIN_AMOUNT:
                emptySocietyPaymentMinAmountStore()
            break;
            case STORE.SOCIETY_LOAN:
                emptyLoanStore()
            break;
            case STORE.SOCIETY_LOAN_AMOUNT_GIVEN_HIST:
                emptySocietyLoanAmountGivenHist()
            break;
            case STORE.SOCIETY_PAY_HIST:
                emptySocietyLoanPaymentHist()
            break;
        }//end switch
    }//end for loop
}//end function