<template>
  <!-- Sidebar  -->
  <div class="iq-sidebar">
    <div class="iq-navbar-logo d-flex justify-content-between">
        <a class="header-logo">
          <router-link to="/">
            <img src="/img/app-logo.png" class="img-fluid rounded" :alt="unionName">
            <span>MyCoop</span>
          </router-link>
        </a>
        <div class="iq-menu-bt align-self-center">
          <div class="wrapper-menu">
              <div class="main-circle"><i class="ri-menu-line"></i></div>
              <div class="hover-circle"><i class="ri-close-fill"></i></div>
          </div>
        </div>
    </div>
    <div id="sidebar-scrollbar">
      <nav class="iq-sidebar-menu">
        <ul id="iq-sidebar-toggle" class="iq-menu">
            <li :class="{ 'active': isActiveSingle('/') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-home iq-arrow-left"></i>
                <router-link to="/">
                  <span>Dashboard</span>
                </router-link>
              </a>
            </li>
          

            <li :class="isPaymentActive ? 'active' : ''">
              <a
                href="#myPayments"
                class="iq-waves-effect"
                data-toggle="collapse"
                :aria-expanded="isPaymentActive"
              >
                <span class="ripple rippleEffect"></span>
                <i class="las la-user-tie iq-arrow-left"></i>
                <span>My Payments</span>
                <i class="ri-arrow-right-s-line iq-arrow-right"></i>
              </a>
              <ul
                id="myPayments"
                data-parent="#iq-sidebar-toggle"
                :class="['iq-submenu', isPaymentCollapsed ? 'collapse' : '', isPaymentActive ? 'active' : '']"
              >
                <li :class="{ 'active': isActive('/myPayments') }">
                  <router-link to="/myPayments">
                    <i class="las la-book"></i> My Passbook
                  </router-link>
                </li>
                <li :class="{ 'active': isActive('/myLoan/history') }">
                  <router-link to="/myLoan/history">
                    <i class="las la-id-card-alt"></i> Loan History
                  </router-link>
                </li>
                <li :class="{ 'active': isActive('/myLoan/request') }">
                  <router-link to="/myLoan/request">
                    <i class="las la-id-card-alt"></i> Loan Request
                  </router-link>
                </li>
                <li :class="{ 'active': isActive('/guarantorRequest') }">
                  <router-link to="/guarantorRequest">
                    <i class="las la-id-card-alt"></i> Guarantor Request
                  </router-link>
                </li>
                <li :class="{ 'active': isActive('/meetingCalendar') }">
                  <router-link to="/meetingCalendar">
                    <i class="las la-id-card-alt"></i> My Meeting Calendar
                  </router-link>
                </li>
                <li :class="{ 'active': isActive('/makePayment') }">
                  <router-link to="/makePayment">
                    <i class="las la-id-card-alt"></i> Make Payment
                  </router-link>
                </li>
              </ul>
            </li>
          
            <li v-if="pages.includes('Society Status') || pages.includes('Member Status')" :class="isLoanActive ? 'active' : ''">
              <a href="#loans" class="iq-waves-effect collapsed" data-toggle="collapse" :aria-expanded="isLoanActive"><i class="lab la-elementor iq-arrow-left"></i><span>Loan Management</span><i class="ri-arrow-right-s-line iq-arrow-right"></i></a>
              <ul id="loans" data-parent="#iq-sidebar-toggle" :class="['iq-submenu', isLoanCollapsed ? 'collapse' : '', isLoanActive ? 'active' : '']">
                <li v-if="pages.includes('Society Status')" :class="{'active': isActive('/loan/society/status')}">
                  
                    
                    <router-link to="/loan/society/status">
                      <i class="las la-book"></i> Society Loan
                    </router-link>
                  
                </li>
                <li v-if="pages.includes('Member Status')" :class="{'active': isActive('/loan/member/status')}">
                  
                    
                    <router-link to="/loan/member/status">
                      <i class="las la-book"></i>  Members Loan
                    </router-link>
                  
                </li>
              </ul>
            </li>
            <li v-if="pages.includes('View Edit Societies') || pages.includes('Create New Society') || pages.includes('Assign Members') || pages.includes('Assign Delegates') || pages.includes('Society Monthly Due') || pages.includes('Request Loan') || pages.includes('Society Min Amount')" :class="isSocietyActive ? 'active' : ''">
              <a href="#societies" class="iq-waves-effect collapsed" data-toggle="collapse" :aria-expanded="isSocietyActive">
                <span class="ripple rippleEffect"></span><i class="lab la-wpforms iq-arrow-left"></i><span>Societies</span><i class="ri-arrow-right-s-line iq-arrow-right"></i></a>
              <ul id="societies" data-parent="#iq-sidebar-toggle" :class="['iq-submenu', isSocietyCollapsed ? 'collapse' : '', isSocietyActive ? 'active' : '']">
                <li v-if="pages.includes('View Edit Societies')" :class="{ 'active': isActive('/societies/view') }">
                  
                    
                    <router-link to="/societies/view">
                      <i class="las la-home"></i> View/Edit Societies
                    </router-link>
                </li>
                <li v-if="pages.includes('Create New Society')" :class="{ 'active': isActive('/societies/create') }">
                  
                    
                    <router-link to="/societies/create">
                      <i class="las la-plus"></i> Create Society
                    </router-link>
                </li>
                <li v-if="pages.includes('Assign Members')" :class="{ 'active': isActive('/societies/AssignMembers') }">
                  
                    
                    <router-link to="/societies/AssignMembers">
                      <i class="las la-users"></i> Manage Members
                    </router-link>
                </li>
                <li v-if="pages.includes('Move Members')" :class="{ 'active': isActive('/societies/MoveMembers') }">
                  
                    
                    <router-link to="/societies/MoveMembers">
                      <i class="las la-users"></i> Move Members
                    </router-link>
                </li>
                <li v-if="pages.includes('Assign Delegates')" :class="{ 'active': isActive('/users/') }">
                  
                    
                    <router-link to="/users/">
                      <i class="las la-user"></i> Assign Delegates
                    </router-link>
 
                </li>
                <li v-if="pages.includes('Society Monthly Due')" :class="{ 'active': isActive('/societies/monthlyDue') }">
                  
                   
                    <router-link to="/societies/monthlyDue">
                      <i class="las la-id-card-alt"></i> Monthly Due
                    </router-link>
                </li>
                <li v-if="pages.includes('Request Loan')" :class="{ 'active': isActive('/societies/loanRequest') }">
                  
                    
                    <router-link to="/societies/loanRequest">
                      <i class="las la-id-card-alt"></i> Request Loan
                    </router-link>
                </li>
                <li v-if="pages.includes('Society Min Amount')" :class="{ 'active': isActive('/societies/setMinimumAmount') }">
                  
                    <router-link to="/societies/setMinimumAmount">
                      <i class="las la-id-card-alt"></i> Set Society Min. Amount
                    </router-link>
                </li>
              </ul>
            </li>
            <li v-if="pages.includes('Members')" :class="{ 'active': isActiveSingle('/members') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-users iq-arrow-left"></i>
                <router-link to="/members">
                  Members
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Meeting')" :class="{ 'active': isActiveSingle('/meeting') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/meeting">
                  Meetings
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Revenue')" :class="{ 'active': isActiveSingle('/onlinePaymentRecord') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/onlinePaymentRecord">
                  Online Payment Record
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Revenue')" :class="{ 'active': isActiveSingle('/revenue') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/revenue">
                  Account Balancing
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Members Loan Req')" :class="{ 'active': isActiveSingle('/requestLoanForMembers') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/requestLoanForMembers">
                  Loan Requests
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Edit Member Payment') || pages.includes('Record') || pages.includes('Members Due')" :class="isLedgerActive ? 'active' : ''">
              <a href="#ledger" class="iq-waves-effect collapsed" data-toggle="collapse" :aria-expanded="isLedgerActive"><i class="lab la-wpforms iq-arrow-left"></i><span>Personal Ledger</span><i class="ri-arrow-right-s-line iq-arrow-right"></i></a>
              <ul id="ledger" data-parent="#iq-sidebar-toggle" :class="['iq-submenu', isLedgerCollapsed ? 'collapse' : '', isLedgerActive ? 'active' : '']">
                <li v-if="pages.includes('Edit Member Payment')" :class="{ 'active': isActive('/payments/editMemberPayments') }">
              
                    <router-link to="/payments/editMemberPayments">
                      <i class="las la-id-card-alt"></i> Edit Members Payment
                    </router-link>

                </li>
                <li v-if="pages.includes('Record')" :class="{ 'active': isActive('/payments/records') }">
                  
                    
                    <router-link to="/payments/records">
                      <i class="las la-id-card-alt"></i> Payment Records
                    </router-link>
                </li>
                <li v-if="pages.includes('Members Due')" :class="{ 'active': isActive('/payments/membersDue') }">
                  
                    
                    <router-link to="/payments/membersDue">
                      <i class="las la-id-card-alt"></i> Members Passbook
                    </router-link>

                </li>
                <li v-if="pages.includes('Members Due')" :class="{ 'active': isActive('/payments/membersDue') }">
                  
                    
                  <router-link to="/payment/membersAsset">
                    <i class="las la-id-card-alt"></i> Members Assets
                  </router-link>

              </li>
              </ul>
            </li>
            <li v-if="pages.includes('Users')" :class="{ 'active': isActiveSingle('/users') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/users">
                  Users
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Meeting Calendar')" :class="{ 'active': isActiveSingle('/calendar') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/calendar">
                  Meeting Calendar
                </router-link>
              </a>
            </li>
            <li v-if="pages.includes('Roles') || pages.includes('Config') || pages.includes('Payment Types')" :class="isSettingsActive ? 'active' : ''">
              <a href="#settings" class="iq-waves-effect collapsed" data-toggle="collapse" :aria-expanded="isSettingsActive"><i class="lab la-wpforms iq-arrow-left"></i><span>Settings</span><i class="ri-arrow-right-s-line iq-arrow-right"></i></a>
              <ul id="settings" data-parent="#iq-sidebar-toggle" :class="['iq-submenu', isSettingsCollapsed ? 'collapse' : '', isSettingsActive ? 'active' : '']">
                <li v-if="pages.includes('Roles')" :class="{ 'active': isActive('/settings/roles') }">
                  
                    
                    <router-link to="/settings/roles">
                      <i class="las la-id-card-alt"></i> Roles
                    </router-link>
                </li>
                <li v-if="pages.includes('Config')" :class="{ 'active': isActive('/settings/config') }">
                  
                    
                    <router-link to="/settings/config">
                      <i class="las la-id-card-alt"></i> Config
                    </router-link>
                </li>
                <li v-if="pages.includes('Payment Types')" :class="{ 'active': isActive('/settings/paymentTypes') }">
                  
                    
                    <router-link to="/settings/paymentTypes">
                      <i class="las la-id-card-alt"></i> Payment Types
                    </router-link>
                </li>
              </ul>
            </li>
            <li :class="{ 'active': isActiveSingle('/profile') }">
              <a class="iq-waves-effect"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/profile">
                  My Profile
                </router-link>
              </a>
            </li>
            <li>
              <a class="iq-waves-effect btn btn-danger" :style="{color: '#fff'}"><span class="ripple rippleEffect"></span>
                <i class="las la-id-card-alt iq-arrow-left"></i>
                <router-link to="/Logout" :style="{color: '#fff'}">
                  Log Out
                </router-link>
              </a>
            </li>
        </ul>
      </nav>
      <div class="p-3"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'side-menu',
  props:{
    pages:Array,
    unionName: String
  },
  data(){
    return {
      isMenuExpanded: false
    }
  },
  computed: {
    isPaymentActive(){
      return this.isActive('/myPayments', '/myLoan/history', '/myLoan/request', '/guarantorRequest', '/meetingCalendar', '/makePayment')
    },

    isPaymentCollapsed(){
      return !this.isActive('/myPayments', '/myLoan/history', '/myLoan/request', '/guarantorRequest', '/meetingCalendar', '/makePayment')
    },

    isLoanActive(){
      return this.isActive('/loan/society/status', '/loan/member/status')
    },

    isLoanCollapsed(){
      return !this.isActive('/loan/society/status', '/loan/member/status')
    },

    isSocietyActive(){
      return this.isActive('/societies/view', '/societies/create', '/societies/AssignMembers', '/societies/MoveMembers', '/users/', '/societies/monthlyDue', '/societies/loanRequest', '/societies/setMinimumAmount')
    },

    isSocietyCollapsed(){
      return !this.isActive('/societies/view', '/societies/create', '/societies/AssignMembers', '/societies/MoveMembers', '/users/', '/societies/monthlyDue', '/societies/loanRequest', '/societies/setMinimumAmount')
    }, 

    isLedgerActive(){
      return this.isActive('/payments/editMemberPayments', '/payments/records', '/payments/membersDue')
    },

    isLedgerCollapsed(){
      return !this.isActive('/payments/editMemberPayments', '/payments/records', '/payments/membersDue')
    },

    isSettingsActive(){
      return this.isActive('/settings/roles', '/settings/config', '/settings/paymentTypes')
    }, 

    isSettingsCollapsed(){
      return !this.isActive('/settings/roles', '/settings/config', '/settings/paymentTypes')
    }
  },
  methods: {
    isActive(...routes) {
      // Use this.$route.path to get the current route
      return routes.includes(this.$route.path)
    },

    isActiveSingle(route) {
      // Use this.$route.path to get the current route
      return this.$route.path == route
    },
  },
}
</script>