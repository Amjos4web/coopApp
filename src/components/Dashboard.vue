<template>
  <div>
		<div id="page-wrapper">
			<div class="header">
				<h3 class="page-header">
					My Dashboard
				</h3>
				<ol class="breadcrumb">
					<li><a href="#" class="active">My Dashboard</a></li>
				</ol>
			</div>
			<div id="page-inner">
				<div class="row padding">
					<div class="col-md-4 col-sm-12 text-center"> 
            <img src="@/assets/passports/avata.png" class="avatar">
            <h4 class="custom-singleline-heading">Role: Member</h4>
          </div><!--/.row-->
          <div class="col-md-8 col-sm-12 text-center"> 
            <div class="table-responsive">
              <table class="table table-striped table-hover table-bordered" id="profile-table">
                <tbody>
                  <tr>
                    <th width="50%">Name</th>
                    <td id="name">Amos Joseph</td>
                  </tr>
                  <tr>
                    <th width="50%">Email Address</th>
                    <td id="email">amosjoseph6@gmail.com</td>
                  </tr>
                  <tr>
                    <th width="50%">Phone Number</th>
                    <td id="phone">09038693378</td>
                  </tr>
                  <tr>
                    <th width="50%">Residential Address</th>
                    <td id="address">Mikky Area, Ogbomoso</td>
                  </tr>
                  <tr>
                    <th width="50%">Can Make Payment</th>
                    <td id="makePayment">Yes</td>
                  </tr>
                  <tr>
                    <th>Society</th>
                    <td id="society">Otitoloju C.I.C.S</td>
                  </tr>
                  <tr>
                    <th>Total Asset</th>
                    <td id="asset">N300,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div><!--/.row-->
        </div>	
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
}
</script>
