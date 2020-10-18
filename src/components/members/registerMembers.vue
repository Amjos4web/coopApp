<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Register Members
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Register Members</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> This is where new member is being added or imported</p>
                <p class="export-btn"><button class="btn modal-trigger" data-target="modal1"><i class="fa fa-download"></i>&nbsp;Import members</button></p>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="row">
              <form action="" method="get" class="col s12">
                <div class="form-group">
                  <div class="row">
                    <div class="input-field col s12">
                      <input type="text" name="name" id="name" class="" autofocus>
                      <label for="fullname">Full Name</label>
                      <span class="error-message" id="fullName-error"></span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <input type="email" name="emailAddress" id="emailAddress" class="">
                      <label for="email">Email Address</label>
                      <span class="error-message" id="phoneNo-error"></span>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="input-field col s12">
                      <input type="text" name="phoneNo" id="phoneNo" class="">
                      <label for="phone">Phone Number</label>
                      <span class="error-message" id="phoneNo-error"></span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <textarea id="address" class="materialize-textarea"></textarea>
                      <label for="address">Address</label>
                      <span class="error-message" id="address-error"></span>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="form-group col s12">
                      <label>Gender</label>
                      <select name="gender" id="gender" class="form-control">
                        <option value="" selected>Choose your option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <span class="error-message" id="gender-error"></span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col s12">
                      <label>Can Make Payment</label>
                      <select name="canPay" id="canPay" class="form-control">
                        <option value="" selected>Choose your option</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                      <span class="error-message" id="canPay-error"></span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col s12">
                      <label>Role</label>
                      <select name="role" id="role" class="form-control">
                        <option value="" selected>Choose your option</option>
                      </select>
                      <span class="error-message" id="role-error"></span>
                    </div>
                  </div>

                   <div class="row">
                    <div class="form-group col s12">
                      <label for="address">Upload Profile Image</label>
                      <input type="file" name="profileIamge" id="profileImage">
                      <span class="error-message" id="address-error"></span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <input type="submit" value="Save" class="btn-general">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'registerMembers',
  
}

</script>
