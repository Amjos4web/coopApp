
// import components
const Login = import("@/components/Login")
const NotFound = import("@/components/notFound")
const AddSociety = import("@/components/societies/addSociety")
const AssignMembers = import("@/components/societies/AssignMembers")
const MoveMembers = import("@/components/societies/MoveMembers")
// const AssignDelegates = import("@/components/societies/AssignDelegates")
const AssignDelegates = import('@/components/users/AssignDelegates')
const LoanRequest = import("@/components/societies/LoanRequest")
const MonthlyDue = import("@/components/societies/MonthlyDue")
const SetMinimumAmount = import("@/components/societies/SetMinimumAmount")
const Members = import("@/components/members/index")
const SmsLogs = import ("@/components/members/SmsLogs")
const Societies = import("@/components/societies/view")
const Records = import("@/components/payments/records")
const MeetingIndex = import("@/components/meeting/index")
const Request = import("@/components/myLoan/Request")
const _History = import("@/components/myLoan/History")
// const MemberHistory = import("@/components/loan/member/History")
const MemberStatus = import("@/components/loan/member/Status")
const SocietyStatus = import("@/components/loan/society/Status")
const MemberLoanGuarantors = import("@/components/loan/member/Guarantors")
const MemberLoanPerformanceAnalysis = import("@/components/loan/member/LoanPerformanceAnalysis")
const MyLoanGuarantors = import("@/components/myLoan/Guarantors")
const MemberLoanDetails = import("@/components/loan/member/Details")
const SocietyLoanDetails = import("@/components/loan/society/Details")
const SocietyHistory = import("@/components/loan/society/History")
const MembersDue = import("@/components/payments/MembersDue")
const MemberPassbook = import("@/components/payments/MemberPassbook")
const MeetingMemberPassbook = import("@/components/meeting/MemberPassbook")
const RevenueRecord = import("@/components/revenue/index")
const Profile = import("@/components/profile/index")
const ChangePassword = import("@/components/profile/ChangePassword")

//const SocietyDue = import("@/components/payments/societyDue")
const EditMemberPayment = import("@/components/payments/EditMemberPayment")
const MembersAsset = import("@/components/payments/MembersAsset")
const MemberListsForPaymentEdit = import("@/components/payments/MemberListsForPaymentEdit")
const EditPayment = import("@/components/payments/EditPayment")

/** Asset Withdrawal Routes */
const AssetWithdrawIndex = import("@/components/assetWithdrawal/Manage")
const AssetWithdrawPage = import("@/components/assetWithdrawal/SocietyList")

const MyPayments = import("@/components/myPayments/Index")
const Roles = import("@/components/settings/roles")
const Calendar = import("@/components/Calendar")
const PaymentTypes = import("@/components/settings/paymentTypes") 
const Config = import("@/components/settings/Config")
const Meeting = import("@/components/meeting/meeting")
const Dashboard = import("@/components/Dashboard")
const GuarantorRequest = import("@/components/GuarantorRequest")
const RequestLoanForMember = import("@/components/RequestLoanForMember")
const Users = import("@/components/users/Index")
const UserRolePermission = import("@/components/users/UserRolePermission")
const MeetingCalendar = import("@/components/meetingCalendar")
const MakePaymentIndexPage = import("@/components/onlinePayment/Index")
const MakePaymentPage = import("@/components/onlinePayment/PaymentPage")
const PaymentResponsePage = import("@/components/onlinePayment/PaymentResponse")
const OnlinePaymentRecords = import("@/components/adminOnlinePaymentModule/Index")

const SocietyAccountList  = import ("@/components/societyAccounts/pages/SocietyAccountList")
const SocietyAccountDetail  = import ("@/components/societyAccounts/pages/SocietyAccountDetail")
const LoginHistory = import("@/components/tools/login_log")


export default [
	{
		path: '/login',
		name: 'Login',
		component: () => Login,
		meta: {
			requiresAuth: false
		}
	},

	{
		path: '/Logout',
		name: 'Logout',
		meta: {
			requiresAuth: true
		},
	},

	{
		path: '/guarantorRequest',
		name: 'GuarantorRequest',
		component: () => GuarantorRequest,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/meetingCalendar',
		name: 'meetingCalendar',
		component: () => MeetingCalendar,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/',
		name: 'dashboard',
		component: () => Dashboard,
		meta: {
			requiresAuth: true
		},
		props: true
	},

	{
		path: '/requestLoanForMembers',
		name: 'RequestLoanForMember',
		component: () => RequestLoanForMember,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/societies/create',
		name: 'addSociety',
		component: () => AddSociety,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/societies/view',
		name: 'viewSocieties',
		component: () => Societies,
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	
	{
		path: '/societies/AssignMembers',
		name: 'AssignMembers',
		component: () => AssignMembers,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/societies/MoveMembers',
		name: 'MoveMembers',
		component: () => MoveMembers,
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	
	// {
	// 	path: '/societies/AssignDelegates',
	// 	name: 'AssignDelegates',
	// 	component: () => AssignDelegates,
	// 	props: true,
	// 	meta: {
	// 		requiresAuth: true
	// 	}
	// },

	{
		path: '/societies/monthlyDue',
		name: 'MonthlyDue',
		component: () => MonthlyDue,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/societies/loanRequest',
		name: 'LoanRequest',
		component: () => LoanRequest,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/societies/setMinimumAmount',
		name: 'SetMinimumAmount',
		component: () => SetMinimumAmount,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/members',
		name: 'Members',
		component: () => Members,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payments/records',
		name: 'records',
		component: () => Records,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payments/editMemberPayments',
		name: 'EditMemberPayment',
		component: () => EditMemberPayment,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payment/edit/:member_id/:currentSocietyID',
		name: 'editPayment',
		component: () => EditPayment,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payment/membersAsset',
		name: 'membersAsset',
		component: () => MembersAsset,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/memberList/:society_id',
		name: 'memberListForPaymentEdit',
		component: () => MemberListsForPaymentEdit,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/assetWithdrawal/manage',
		name: 'assetWithdrawalManage',
		component: () => AssetWithdrawIndex,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/assetWithdrawal/start',
		name: 'assetWithdrawal',
		component: () => AssetWithdrawPage,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/assetWithdrawal/delete/:asset_withdrawal_id',
		name: 'deleteAssetWithdrawal',
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	// {
	// 	path: '/loan/member/History',
	// 	name: 'memberHistory',
	// 	component: () => MemberHistory,
	// 	props: true,
	// 	meta: {
	// 		requiresAuth: true
	// 	}
	// },

	{
		path: '/loan/member/status',
		name: 'memberStatus',
		component: () => MemberStatus,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/loan/society/status',
		name: 'societyStatus',
		component: () => SocietyStatus,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/loan/member/guarantors/:loan_request_id',
		name: 'memberLoanGuarantors',
		component: () => MemberLoanGuarantors,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/loan/performance/analysis/:loan_request_id',
		name: 'memberLoanPerformanceAnalysis',
		component: () => MemberLoanPerformanceAnalysis,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/myLoan/guarantors/:loan_request_id',
		name: 'myLoanGuarantors',
		component: () => MyLoanGuarantors,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/loan/member/details/:loan_request_id',
		name: 'MemberLoanDetails',
		component: () => MemberLoanDetails,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/loan/society/details/:loan_request_id',
		name: 'SocietyLoanDetails',
		component: () => SocietyLoanDetails,
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	

	{
		path: '/loan/society/History',
		name: 'societyHistory',
		component: () => SocietyHistory,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/myLoan/request',
		name: 'request',
		component: () => Request,
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	
	{
		path: '/myLoan/history',
		name: 'History',
		component: () => _History,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payments/membersDue',
		name: 'MembersDue',
		component: () => MembersDue,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	// {
	// 	path: '/payments/societyDue',
	// 	name: 'societyDue',
	// 	component: () => SocietyDue,
	// 	props: true,
	// 	meta: {
	// 		requiresAuth: true
	// 	}
	// },

	{
		path: '/myPayments/',
		name: 'myPayments',
		component: () => MyPayments,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payments/memberPassbook/:member_id/:society_id',
		name: 'memberPassbook',
		component: () => MemberPassbook,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/meeting/memberPassbook/:member_id/:society_id',
		name: 'meetingMemberPassbook',
		component: () => MeetingMemberPassbook,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/meeting/start/:society_id',
		name: 'meeting',
		component: () => Meeting,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/meeting',
		name: 'meetingIndex',
		component: () => MeetingIndex,
		props: true,
		children: [
			{
				path: '/m',
				component: () => Meeting,
			}
		],
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/settings/roles',
		name: 'roles',
		component: () => Roles,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/settings/config',
		name: 'Config',
		component: () => Config,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/settings/paymentTypes',
		name: 'paymentTypes',
		component: () => PaymentTypes,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/calendar',
		name: 'Calendar',
		component: () => Calendar,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/users',
		name: 'Users',
		component: () => Users,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/users/rolePermission/:member_id',
		name: 'RolePermission',
		component: () => UserRolePermission,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/users/AssignDelegates/:user_id',
		name: 'AssignDelegates',
		component: () => AssignDelegates,
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	
	{
		path: '/revenue',
		name: 'revenue',
		component: () => RevenueRecord,
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	
	{
		path: '/profile/',
		name: 'profile',
		component: () => Profile,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/changePassword/',
		name: 'ChangePassword',
		component: () => ChangePassword,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/makePayment/',
		name: 'MakePaymentIndexPage',
		component: () => MakePaymentIndexPage,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

		{
		path: '/makePayment/analysis/:society_id',
		name: 'PaymentPage',
		component: () => MakePaymentPage,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/payment/status/:payment_status/:transaction_completed',
		name: 'PaymentResponse',
		component: () => PaymentResponsePage,
		props: true,
		meta: {
			requiresAuth: true
		}
	},



	{
		path: '/onlinePaymentRecord',
		name: 'OnlinePaymentRecords',
		component: () => OnlinePaymentRecords,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/society_accounts',
		name: 'SocietyAccountList',
		component: () => SocietyAccountList,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/society_account_detail/:society_id',
		name: 'SocietyAccountDetail',
		component: () => SocietyAccountDetail,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/sms/logs',
		name: 'SmsLogs',
		component: () => SmsLogs,
		props: true,
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/login-history',
		name: 'LoginHistory',
		component: () => LoginHistory,
		meta: { requiresAuth: true }
	},

	{
		path: '/*',
		name: 'notFound',
		component: () => NotFound,
		meta: {
			requiresAuth: true
		}
	},
]