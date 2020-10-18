import Login from '@/components/login'
import notFound from '@/components/notFound'
import home from '@/components/home'
import addSociety from '@/components/societies/addSociety'
import societies from '@/components/societies/view'
import AssignMembers from '@/components/societies/AssignMembers'
import AssignDelegates from '@/components/societies/AssignDelegates'
import LoanRequest from '@/components/societies/LoanRequest'
import MonthlyDue from '@/components/societies/MonthlyDue'
import registerMembers from '@/components/members/registerMembers'
import viewMembers from '@/components/members/view'
import records from '@/components/payments/records'
import meetingIndex from '@/components/meeting/index'
import request from '@/components/myLoan/request'
import history from '@/components/myLoan/history'
import MemberHistory from '@/components/loan/member/History'
import MemberStatus from '@/components/loan/member/Status'
import SocietyHistory from '@/components/loan/society/History'
import SocietyStatus from '@/components/loan/society/Status'
import membersDue from '@/components/payments/membersDue'
import revenueRecord from '@/components/revenue/index'
import profile from '@/components/profile/index'
import societyDue from '@/components/payments/societyDue'
import myPayments from '@/components/myPayments/myPayments'
import roles from '@/components/settings/roles'
import interestRate from '@/components/settings/interestRate'
import loanPaymentDuration from '@/components/settings/loanPaymentDuration'
import unionExcutives from '@/components/settings/unionExcutives'
import Calendar from '@/components/settings/Calendar'
// import manageUsers from '@/components/users/index'
import paymentTypes from '@/components/settings/paymentTypes'
import meeting from '@/components/meeting/meeting'
import UnionStaff from '@/components/settings/Staff'
import Dashboard from '@/components/Dashboard'


export default [
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: {
			requiresAuth: false
		}
	},

	{
		path: '/',
		name: 'home',
		component: home,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/dashboard',
		name: 'dashboard',
		component: Dashboard,
		props: true
	},

	{
		path: '/societies/create',
		name: 'addSociety',
		component: addSociety,
		props: true
	},

	{
		path: '/societies/view',
		name: 'viewSocieties',
		component: societies,
		props: true
	},
	
	{
		path: '/societies/AssignMembers',
		name: 'AssignMembers',
		component: AssignMembers,
		props: true
	},
	
	{
		path: '/societies/AssignDelegates',
		name: 'AssignDelegates',
		component: AssignDelegates,
		props: true
	},

	{
		path: '/societies/monthlyDue',
		name: 'MonthlyDue',
		component: MonthlyDue,
		props: true
	},

	{
		path: '/societies/loanRequest',
		name: 'LoanRequest',
		component: LoanRequest,
		props: true
	},

	{
		path: '/members/register',
		name: 'registerMembers',
		component: registerMembers,
		props: true
	},

	{
		path: '/members/view',
		name: 'viewMembers',
		component: viewMembers,
		props: true
	},

	{
		path: '/payments/records',
		name: 'records',
		component: records,
		props: true
	},

	{
		path: '/loan/member/History',
		name: 'memberHistory',
		component: MemberHistory,
		props: true
	},

	{
		path: '/loan/member/Status',
		name: 'memberStatus',
		component: MemberStatus,
		props: true
	},

	{
		path: '/loan/society/Status',
		name: 'societyStatus',
		component: SocietyStatus,
		props: true
	},

	{
		path: '/loan/society/History',
		name: 'societyHistory',
		component: SocietyHistory,
		props: true
	},

	{
		path: '/myLoan/request',
		name: 'request',
		component: request,
		props: true
	},
	
	{
		path: '/myLoan/history',
		name: 'history',
		component: history,
		props: true
	},

	{
		path: '/payments/membersDue',
		name: 'membersDue',
		component: membersDue,
		props: true
	},

	{
		path: '/payments/societyDue',
		name: 'societyDue',
		component: societyDue,
		props: true
	},

	{
		path: '/myPayments/myPayments',
		name: 'myPayments',
		component: myPayments,
		props: true
	},

	{
		path: '/meeting/start',
		name: 'meeting',
		component: meeting,
		props: true
	},

	{
		path: '/meeting',
		name: 'meetingIndex',
		component: meetingIndex,
		props: true,
		children: [
			{
				path: '/m',
				component: meeting,
			}
		]
	},

	{
		path: '/settings/roles',
		name: 'roles',
		component: roles,
		props: true
	},

	{
		path: '/settings/interestRate',
		name: 'interestRate',
		component: interestRate,
		props: true
	},

	{
		path: '/settings/loanPaymentDuration',
		name: 'loanPaymentDuration',
		component: loanPaymentDuration,
		props: true
	},

	{
		path: '/settings/unionExcutives',
		name: 'unionExcutives',
		component: unionExcutives,
		props: true
	},

	{
		path: '/settings/paymentTypes',
		name: 'paymentTypes',
		component: paymentTypes,
		props: true
	},

	{
		path: '/settings/Staff',
		name: 'UnionStaff',
		component: UnionStaff,
		props: true,
	},

	{
		path: '/settings/calendar',
		name: 'Calendar',
		component: Calendar,
		props: true,
	},

	// {
	// 	path: '/users/',
	// 	name: 'users',
	// 	component: manageUsers,
	// 	props: true
	// },

	{
		path: '/revenue',
		name: 'revenue',
		component: revenueRecord,
		props: true,
	},
	
	{
		path: '/profile/',
		name: 'profile',
		component: profile,
		props: true,
	},

	{
		path: '/*',
		name: 'notFound',
		component: notFound
	},
]