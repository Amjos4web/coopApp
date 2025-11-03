<template>
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

          <!-- 1. Dashboard -->
          <li :class="{ 'active': isActiveSingle('/') }">
            <a class="iq-waves-effect">
              <span class="ripple rippleEffect"></span>
              <i class="las la-home iq-arrow-left"></i>
              <router-link to="/">Dashboard</router-link>
            </a>
          </li>

          <!-- 2. My Account -->
          <li :class="{ 'active': isMyAccountActive }">
            <a href="#myAccount" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isMyAccountActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-user-circle iq-arrow-left"></i>
              <span>My Account</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="myAccount" class="iq-submenu collapse" :class="{ 'show': isMyAccountActive }">
              <li :class="{ 'active': isActive('/myPayments') }">
                <router-link to="/myPayments"><i class="las la-book"></i> My Passbook</router-link>
              </li>
              <li :class="{ 'active': isActive('/myLoan/history') }">
                <router-link to="/myLoan/history"><i class="las la-history"></i> Loan History</router-link>
              </li>
              <li :class="{ 'active': isActive('/myLoan/request') }">
                <router-link to="/myLoan/request"><i class="las la-file-invoice-dollar"></i> Loan Request</router-link>
              </li>
              <li :class="{ 'active': isActive('/guarantorRequest') }">
                <router-link to="/guarantorRequest"><i class="las la-user-check"></i> Guarantor Request</router-link>
              </li>
              <li :class="{ 'active': isActive('/meetingCalendar') }">
                <router-link to="/meetingCalendar"><i class="las la-calendar-alt"></i> My Meeting Calendar</router-link>
              </li>
              <li :class="{ 'active': isActive('/makePayment') }">
                <router-link to="/makePayment"><i class="las la-credit-card"></i> Make Payment</router-link>
              </li>
            </ul>
          </li>

          <!-- 3. Loans -->
          <li v-if="hasLoanPermissions" :class="{ 'active': isLoanActive }">
            <a href="#loans" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isLoanActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-hand-holding-usd iq-arrow-left"></i>
              <span>Loans</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="loans" class="iq-submenu collapse" :class="{ 'show': isLoanActive }">
              <li v-if="pages.includes('Society Status')" :class="{ 'active': isActive('/loan/society/status') }">
                <router-link to="/loan/society/status"><i class="las la-building"></i> Society Loans</router-link>
              </li>
              <li v-if="pages.includes('Member Status')" :class="{ 'active': isActive('/loan/member/status') }">
                <router-link to="/loan/member/status"><i class="las la-users"></i> Member Loans</router-link>
              </li>
              <li v-if="pages.includes('Members Loan Req')" :class="{ 'active': isActive('/requestLoanForMembers') }">
                <router-link to="/requestLoanForMembers"><i class="las la-file-signature"></i> Loan Requests</router-link>
              </li>
            </ul>
          </li>

          <!-- 4. Societies -->
          <li v-if="hasSocietyPermissions" :class="{ 'active': isSocietyActive }">
            <a href="#societies" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isSocietyActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-sitemap iq-arrow-left"></i>
              <span>Societies</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="societies" class="iq-submenu collapse" :class="{ 'show': isSocietyActive }">
              <li v-if="pages.includes('View Edit Societies')" :class="{ 'active': isActive('/societies/view') }">
                <router-link to="/societies/view"><i class="las la-edit"></i> View/Edit</router-link>
              </li>
              <li v-if="pages.includes('Create New Society')" :class="{ 'active': isActive('/societies/create') }">
                <router-link to="/societies/create"><i class="las la-plus-circle"></i> Create New</router-link>
              </li>
              <li v-if="pages.includes('Assign Members')" :class="{ 'active': isActive('/societies/AssignMembers') }">
                <router-link to="/societies/AssignMembers"><i class="las la-user-plus"></i> Assign Members</router-link>
              </li>
              <li v-if="pages.includes('Move Members')" :class="{ 'active': isActive('/societies/MoveMembers') }">
                <router-link to="/societies/MoveMembers"><i class="las la-exchange-alt"></i> Move Members</router-link>
              </li>
              <li v-if="pages.includes('Assign Delegates')" :class="{ 'active': isActive('/users/') }">
                <router-link to="/users/"><i class="las la-user-shield"></i> Assign Delegates</router-link>
              </li>
              <li v-if="pages.includes('Society Monthly Due')" :class="{ 'active': isActive('/societies/monthlyDue') }">
                <router-link to="/societies/monthlyDue"><i class="las la-calendar-check"></i> Monthly Due</router-link>
              </li>
              <li v-if="pages.includes('Request Loan')" :class="{ 'active': isActive('/societies/loanRequest') }">
                <router-link to="/societies/loanRequest"><i class="las la-file-alt"></i> Request Loan</router-link>
              </li>
              <li v-if="pages.includes('Society Min Amount')" :class="{ 'active': isActive('/societies/setMinimumAmount') }">
                <router-link to="/societies/setMinimumAmount"><i class="las la-ruler"></i> Min. Amount</router-link>
              </li>
            </ul>
          </li>

          <!-- 5. Members & Ledger -->
          <li v-if="hasLedgerOrMembers" :class="{ 'active': isLedgerActive }">
            <a href="#ledger" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isLedgerActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-users-cog iq-arrow-left"></i>
              <span>Members & Ledger</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="ledger" class="iq-submenu collapse" :class="{ 'show': isLedgerActive }">
              <li v-if="pages.includes('Members')" :class="{ 'active': isActiveSingle('/members') }">
                <router-link to="/members"><i class="las la-users"></i> All Members</router-link>
              </li>
              <li v-if="pages.includes('Edit Member Payment')" :class="{ 'active': isActive('/payments/editMemberPayments') }">
                <router-link to="/payments/editMemberPayments"><i class="las la-edit"></i> Edit Payments</router-link>
              </li>
              <li v-if="pages.includes('Record')" :class="{ 'active': isActive('/payments/records') }">
                <router-link to="/payments/records"><i class="las la-list-alt"></i> Payment Records</router-link>
              </li>
              <li v-if="pages.includes('Members Due')" :class="{ 'active': isActive('/payments/membersDue') }">
                <router-link to="/payments/membersDue"><i class="las la-user-clock"></i> Members Passbook</router-link>
              </li>
              <li v-if="pages.includes('Members Due')" :class="{ 'active': isActive('/payment/membersAsset') }">
                <router-link to="/payment/membersAsset"><i class="las la-gem"></i> Members Assets</router-link>
              </li>
            </ul>
          </li>

          <!-- 6. Finance -->
          <li v-if="hasFinance" :class="{ 'active': isFinanceActive }">
            <a href="#finance" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isFinanceActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-chart-line iq-arrow-left"></i>
              <span>Finance</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="finance" class="iq-submenu collapse" :class="{ 'show': isFinanceActive }">
              <li v-if="pages.includes('Revenue')" :class="{ 'active': isActiveSingle('/revenue') }">
                <router-link to="/revenue"><i class="las la-chart-bar"></i> Account Summary</router-link>
              </li>
              <li v-if="pages.includes('Revenue')" :class="{ 'active': isActiveSingle('/onlinePaymentRecord') }">
                <router-link to="/onlinePaymentRecord"><i class="las la-receipt"></i> Online Payments</router-link>
              </li>
              <li v-if="pages.includes('Society Joint Account')" :class="{ 'active': isActiveSingle('/society_accounts') }">
                <router-link to="/society_accounts"><i class="las la-university"></i> Joint Account</router-link>
              </li>
            </ul>
          </li>

          <!-- 7. Asset Withdrawal (with submenu) -->
          <li v-if="hasAssetWithdrawal" :class="{ 'active': isAssetWithdrawalActive }">
            <a href="#assetWithdrawal" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isAssetWithdrawalActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-coins iq-arrow-left"></i>
              <span>Asset Withdrawal</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="assetWithdrawal" class="iq-submenu collapse" :class="{ 'show': isAssetWithdrawalActive }">
              <li v-if="pages.includes('Edit Member Payment')" :class="{ 'active': isActive('/assetWithdrawal/manage') }">
                <router-link to="/assetWithdrawal/manage">
                  <i class="las la-cog"></i> Manage
                </router-link>
              </li>
              <li v-if="pages.includes('Record')" :class="{ 'active': isActive('/assetWithdrawal/start') }">
                <router-link to="/assetWithdrawal/start">
                  <i class="las la-hand-holding-usd"></i> Withdraw Asset
                </router-link>
              </li>
            </ul>
          </li>

          <!-- 7. Admin Tools -->
          <li v-if="hasAdmin" :class="{ 'active': isAdminActive }">
            <a href="#admin" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isAdminActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-tools iq-arrow-left"></i>
              <span>Tools</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="admin" class="iq-submenu collapse" :class="{ 'show': isAdminActive }">
              <li v-if="pages.includes('Meeting')" :class="{ 'active': isActiveSingle('/meeting') }">
                <router-link to="/meeting"><i class="las la-video"></i> Meetings</router-link>
              </li>
              <li v-if="pages.includes('Meeting Calendar')" :class="{ 'active': isActiveSingle('/calendar') }">
                <router-link to="/calendar"><i class="las la-calendar"></i> Meeting Calendar</router-link>
              </li>
              <li v-if="pages.includes('Members')" :class="{ 'active': isActiveSingle('/login-history') }">
                <router-link to="/login-history"><i class="las la-history"></i> Login History</router-link>
              </li>
              
            </ul>
          </li>

          <!-- 8. Settings -->
          <li v-if="hasSettingsPermissions" :class="{ 'active': isSettingsActive }">
            <a href="#settings" class="iq-waves-effect" data-toggle="collapse" :aria-expanded="isSettingsActive">
              <span class="ripple rippleEffect"></span>
              <i class="las la-cogs iq-arrow-left"></i>
              <span>Settings</span>
              <i class="ri-arrow-right-s-line iq-arrow-right"></i>
            </a>
            <ul id="settings" class="iq-submenu collapse" :class="{ 'show': isSettingsActive }">
              <li v-if="pages.includes('Roles')" :class="{ 'active': isActive('/settings/roles') }">
                <router-link to="/settings/roles"><i class="las la-shield-alt"></i> Roles</router-link>
              </li>
              <li v-if="pages.includes('Config')" :class="{ 'active': isActive('/settings/config') }">
                <router-link to="/settings/config"><i class="las la-sliders-h"></i> Config</router-link>
              </li>
              <li v-if="pages.includes('Payment Types')" :class="{ 'active': isActive('/settings/paymentTypes') }">
                <router-link to="/settings/paymentTypes"><i class="las la-money-check-alt"></i> Payment Types</router-link>
              </li>
            </ul>
          </li>

          <!-- Profile -->
          <li :class="{ 'active': isActiveSingle('/profile') }">
            <a class="iq-waves-effect">
              <span class="ripple rippleEffect"></span>
              <i class="las la-id-card-alt iq-arrow-left"></i>
              <router-link to="/profile">My Profile</router-link>
            </a>
          </li>

          <!-- Logout -->
          <li>
            <a class="iq-waves-effect btn btn-danger" :style="{color: '#fff'}">
              <span class="ripple rippleEffect"></span>
              <i class="las la-sign-out-alt iq-arrow-left"></i>
              <router-link to="/Logout" :style="{color: '#fff'}">Log Out</router-link>
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
  props: {
    pages: Array,
    unionName: String
  },
  computed: {
    // === Permission Groups ===
    hasMyAccount() {
      return this.pages.some(p => [
        'My Payments', 'Loan History', 'Loan Request', 'Guarantor Request', 'Meeting Calendar', 'Make Payment'
      ].includes(p));
    },
    hasLoanPermissions() {
      return this.pages.some(p => ['Society Status', 'Member Status', 'Members Loan Req'].includes(p));
    },
    hasSocietyPermissions() {
      return this.pages.some(p => [
        'View Edit Societies','Create New Society','Assign Members','Move Members',
        'Assign Delegates','Society Monthly Due','Request Loan','Society Min Amount'
      ].includes(p));
    },
    hasLedgerOrMembers() {
      return this.pages.some(p => ['Members','Edit Member Payment','Record','Members Due'].includes(p));
    },
    hasFinance() {
      return this.pages.includes('Revenue') || this.pages.includes('Society Joint Account');
    },
    hasAdmin() {
      return this.pages.some(p => ['Meeting','Meeting Calendar','Edit Member Payment','Record'].includes(p));
    },
    hasSettingsPermissions() {
      return this.pages.some(p => ['Roles','Config','Payment Types'].includes(p));
    },
    hasAssetWithdrawal() {
      return this.pages.includes('Edit Member Payment') || this.pages.includes('Record');
    },


    // === Active States ===
    isMyAccountActive() {
      return this.isActive('/myPayments','/myLoan/history','/myLoan/request','/guarantorRequest','/meetingCalendar','/makePayment');
    },
    isLoanActive() {
      return this.isActive('/loan/society/status','/loan/member/status','/requestLoanForMembers');
    },
    isSocietyActive() {
      return this.isActive('/societies/view','/societies/create','/societies/AssignMembers','/societies/MoveMembers','/users/','/societies/monthlyDue','/societies/loanRequest','/societies/setMinimumAmount');
    },
    isLedgerActive() {
      return this.isActive('/members','/payments/editMemberPayments','/payments/records','/payments/membersDue','/payment/membersAsset');
    },
    isFinanceActive() {
      return this.isActive('/revenue','/onlinePaymentRecord','/society_accounts');
    },
    isAdminActive() {
      return this.isActive('/meeting','/calendar','/assetWithdrawal/manage');
    },
    isSettingsActive() {
      return this.isActive('/settings/roles','/settings/config','/settings/paymentTypes');
    },
    isAssetWithdrawalActive() {
      return this.isActive('/assetWithdrawal/manage', '/assetWithdrawal/start');
    }
  },
  methods: {
    isActive(...routes) {
      return routes.includes(this.$route.path);
    },
    isActiveSingle(route) {
      return this.$route.path === route;
    }
  }
}
</script>