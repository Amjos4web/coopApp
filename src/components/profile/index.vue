<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          My Profile
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">My Profile</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12 text-center">
              <img src="@/assets/passports/avata.png" class="avatar">
            </div>
          </div>
          <div class="row">
            <div class="col-md-8 col-md-offset-2">
              <div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                  <tbody>
                    <tr>
                      <th width="50%">Name</th>
                      <td id="name"></td>
                    </tr>
                    <tr>
                      <th width="50%">Email Address</th>
                      <td id="email"></td>
                    </tr>
                    <tr>
                      <th width="50%">Phone Number</th>
                      <td id="phone"></td>
                    </tr>
                    <tr>
                      <th width="50%">Residential Address</th>
                      <td id="address"></td>
                    </tr>
                    <tr>
                      <th width="50%">Can Make Payment</th>
                      <td id="makePayment"></td>
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
            </div>
          </div>
          
        </div> 
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'profile',
}
</script>
