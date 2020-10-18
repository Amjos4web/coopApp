<template>
  <div>
    <nav class="navbar navbar-default top-navbar" role="navigation">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle waves-effect waves-dark" data-toggle="collapse" data-target=".sidebar-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
				</button>
				<!-- <div class="text-center logo">
					<router-link to="/">
					<img src="@/assets/logo.png">
				</router-link>
				
				</div> -->
				<div id="sideNav" href=""><i class="material-icons dp48 side-bar-icon">toc</i>
				</div>
      </div>
			<!-- <ul class="app-name"> -->
				<label class="app-name">{{ unionName }}</label>
			<!-- </ul> -->
      <ul class="nav navbar-top-links navbar-right">
				<li><a class="dropdown-button waves-effect waves-dark" href="#!" data-activates="dropdown2"><i class="fa fa-bell fa-fw"></i> <i class="material-icons right">arrow_drop_down</i></a></li>
				<li><a class="dropdown-button waves-effect waves-dark" href="#!" data-activates="dropdown1"><i class="fa fa-user fa-fw"></i> <b>Amos Joseph</b> <i class="material-icons right">arrow_drop_down</i></a></li>
      </ul>
    </nav>
		<!-- Dropdown Structure -->
		<ul id="dropdown1" class="dropdown-content">
			<li>
				<a>
					<router-link to="/profile">
						<i class="fa fa-user fa-fw"></i> My Profile
					</router-link>
				</a>
			</li>
		
			<li>
				<a>
					<router-link to="/login">
						<i class="fa fa-sign-out fa-fw"></i> Logout
					</router-link>
				</a>
			</li>
		</ul>

		<ul id="dropdown2" class="dropdown-content w250">
			<li>
				<div>
						<i class="fa fa-table fa-fw"></i> Odokoto Ifeoluwa meeting is today
						<!-- <span class="pull-right text-muted small">4 min</span> -->
				</div>
			</li>
			<li class="divider"></li>
			<li>
				<div>
						<i class="fa fa-table fa-fw"></i> Odokoto Ifeoluwa 2 meeting is today
						<!-- <span class="pull-right text-muted small">12 min</span> -->
				</div>
			</li>            
			<li class="divider"></li>
			<li>
				<a class="waves-effect waves-dark">
					<router-link to="/meeting"><i class="fa fa-table"></i>
						<strong>See All Meetings</strong>
					</router-link>
				</a>
			</li>
		</ul>
    <nav class="navbar-default navbar-side" role="navigation">
			<div class="sidebar-collapse">
				<ul class="nav" id="main-menu">	
					<!-- <li>
						<a href="form.html" class="waves-effect waves-dark"><i class="fa fa-edit"></i> Forms </a>
					</li> -->
					<li>
						<a class="active-menu waves-effect waves-dark">
							<router-link to="/"><i class="fa fa-dashboard"></i>
								Dashboard
							</router-link>
						</a>
					</li>

					<li>
						<a class="active-menu waves-effect waves-dark">
							<router-link to="/dashboard"><i class="fa fa-dashboard"></i>
								My Dashboard
							</router-link>
						</a>
					</li>

					<li>
						<a class="waves-effect waves-dark">
							<router-link to="#"><i class="fa fa-bar-chart-o"></i>
									Finance<span class="fa arrow"></span>
							</router-link>
						</a>
						<ul class="nav nav-second-level">
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
									<router-link to="/loan/member/Status">
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
							<router-link to="#"><i class="fa fa-users"></i>
								Members<span class="fa arrow"></span>
							</router-link>
						</a>
						<ul class="nav nav-second-level">
							<li>
								<a class="waves-effect waves-dark">
									<router-link to="/members/view">
										View Member
									</router-link>
								</a>
							</li>
							<li>
								<a class="waves-effect waves-dark">
									<router-link to="/members/register">
										Register Member
									</router-link>
								</a>
							</li>
						</ul>
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

					<!-- <li>
						<a class="waves-effect waves-dark">
							<router-link to="/users"><i class="fa fa-users"></i>
								Users Management
							</router-link>
						</a>
					</li> -->
				
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
									<router-link to="/settings/interestRate">
										Set Interest Rate
									</router-link>
								</a>
							</li>
							<li>
								<a class="waves-effect waves-dark">
									<router-link to="/settings/loanPaymentDuration">
										Set Loan Payment Duration
									</router-link>
								</a>
							</li>
							<li>
								<a class="waves-effect waves-dark">
									<router-link to="/settings/unionExcutives">
										Union Executives
									</router-link>
								</a>
							</li>
							<li>
								<a class="waves-effect waves-dark">
									<router-link to="/settings/Staff">
										Staff
									</router-link>
								</a>
							</li>
							<li>
								<a class="waves-effect waves-dark">
									<router-link to="/settings/calendar">
										Calendar
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
    <!-- /. NAV SIDE  -->
  </div>
</template>

<script>
export default {
	computed: {
		unionName(){
			return this.$store.getters.unionName
		}
	}
}
</script>