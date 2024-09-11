<template>
  <nav class="navbar-default navbar-side" role="navigation">
    <div class="sidebar-collapse">
      <ul class="nav" id="main-menu">	
        <li>
          <a class="active-menu waves-effect waves-dark">
            <router-link to="/"><i class="fa fa-dashboard"></i>
              Dashboard
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="#">
              <i class="fa fa-bar-chart-o"></i>
              Finance<span class="fa arrow"></span>
            </router-link>
          </a>
          <ul class="nav nav-second-level collapse">
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/myPayments/myPayments">
                  Payment History
                </router-link>
              </a>
            </li>
              <li>
              <a class="waves-effect waves-dark">
                <router-link to="/myLoan/history">
                  Loan History
                </router-link>
              </a>
            </li>
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/myLoan/request">
                  Loan Request
                </router-link>
              </a>
            </li>
          
          </ul>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/guarantorRequest"><i class="fa fa-user"></i>
              Guarantor Request
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/meetingCalendar"><i class="fa fa-book"></i>
              Meeting Calendar
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/myLoan/request"><i class="fa fa-bar-chart-o"></i>
              Make Payment
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="#"><i class="fa fa-bar-chart-o"></i>
                Loan<span class="fa arrow"></span>
            </router-link>
          </a>
          <ul class="nav nav-second-level">
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/loan/society/Status">
                  Society Status
                </router-link>
              </a>
            </li>

            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/loan/society/History">
                  Society History
                </router-link>
              </a>
            </li>

            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/loan/member/status">
                  Members Status
                </router-link>
              </a>
            </li>

            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/loan/member/History">
                  Members History
                </router-link>
              </a>
            </li>
          </ul>
        </li> 

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/members"><i class="fa fa-user"></i>
              Members
            </router-link>
          </a>  
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="#"><i class="fa fa-users"></i>
              Societies<span class="fa arrow"></span>
            </router-link>
          </a>
          <ul class="nav nav-second-level">
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/view">
                  View/Edit Societies
                </router-link>
              </a>
            </li>
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/create">
                  Create Society
                </router-link>
              </a>
            </li>
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/AssignMembers">
                  Assign Members
                </router-link>
              </a>
            </li>
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/AssignDelegates">
                  Assign Delegates
                </router-link>
              </a>
            </li>

            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/monthlyDue">
                  Monthly Due
                </router-link>
              </a>
            </li>

            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/loanRequest">
                  Request Loan
                </router-link>
              </a>
            </li>

            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/societies/setMinimumAmount">
                  Set Society Min. Amount
                </router-link>
              </a>
            </li>

          </ul>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/meeting"><i class="fa fa-table"></i>
              Meeting
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/revenue"><i class="fa fa-bar-chart-o"></i>
              Revenue
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/requestLoanForMembers"><i class="fa fa-money"></i>
              Members Loan Req.
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="#"><i class="fa fa-bar-chart-o"></i>
                Payments<span class="fa arrow"></span>
            </router-link>
          </a>
          <ul class="nav nav-second-level">
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/payments/records">
                  Records
                </router-link>
              </a>
            </li>
            
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/payments/membersDue">
                  Members Due
                </router-link>
              </a>
            </li>
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/payments/societyDue">
                  Societies Due
                </router-link>
              </a>
            </li>
          
          </ul>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/users"><i class="fa fa-users"></i>
              Users
            </router-link>
          </a>
        </li>
      
        <li>
          <a class="waves-effect waves-dark">
            <router-link to="/calendar"><i class="fa fa-calendar"></i>
              Calendar
            </router-link>
          </a>
        </li>

        <li>
          <a class="waves-effect waves-dark">
            <router-link to="#"><i class="fa fa-gear"></i>
              Settings<span class="fa arrow"></span>
            </router-link>
          </a>
          <ul class="nav nav-second-level">
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/settings/roles">
                  Roles
                </router-link>
              </a>
            </li>
          
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/settings/config">
                  Config
                </router-link>
              </a>
            </li>
          
            <li>
              <a class="waves-effect waves-dark">
                <router-link to="/settings/paymentTypes">
                  Payment Types
                </router-link>
              </a>
              <a class="waves-effect waves-dark">
                <router-link to="/profile">
                    <i class="fa fa-user fa-fw"></i> My Profile
                </router-link>
              </a>
              <a>
                <router-link to="/login">
                  <i class="fa fa-sign-out fa-fw"></i> Logout
                </router-link>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'side-menu'
}
</script>