<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Manage Users
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">Manage Users</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> Add new users to the system</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#addUserModal"><i class="fa fa-plus"></i>&nbsp;Add New User</button></p>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Role</th>
                  <th>Edit</th>
                  <th>Deactivate</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Ada Dorcas</td>
                  <td>08123234345</td>
                  <td>Society Chairman</td>
                  <td>
                    <a class="btn btn-info btn-sm" href="#">Edit Profile</a>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm">Deactivate Account</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> 
      </div>
    </div>

    <div class="modal fade" id="addUserModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <form action="" method="post" id="addUser">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Add User</h4>
            </div>
            <div class="modal-body padtrbl">
              <div class="table-responsive">
                <table class="table table-bordered table-hover make-payment" :style="{width:'60%', margin:'auto'}">
                  <!-- <form action="" method="post" id="pay"> -->
                    <thead>
                      <tr>
                        <th width="40%">Name</th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="name" id="name">
                            <label for="user name">Enter name</label>
                            <span class="error-message" id="name-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Phone Number</th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="phoneNo" id="phoneNo">
                            <label for="user phone">Enter Phone Number</label>
                            <span class="error-message" id="phoneNo-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Email Address</th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="emailAddress" id="emailAddress">
                            <label for="email address">Enter Email Adress</label>
                            <span class="error-message" id="emailAddresss-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Role</th>
                        <td width="60%">
                          <div class="row">
                            <div class="form-group col-md-10 col-md-offset-1">
                              <label>Choose Role</label>
                              <select name="userRole" id="userRole" class="form-control">
                                <option value="" selected>Choose your option</option>
                              </select>
                              <span class="error-message" id="userRole-error"></span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </thead>
                  <!-- </form> -->
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <input type="submit" name="addUser" class="btn btn-info" value="Save">
              <button type="button" id="continue" class="btn btn-warning ml-10" data-dismiss="modal">close</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'manageUsers',
}
</script>
