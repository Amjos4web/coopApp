<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Assign Delegates
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active"> Assign Delegates</a></li>
        </ol>
      </div>
     <div class="page-inner">
        <div class="container">
          <!-- <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info text-center">
                <p style="font-size: 18px"><i class="fa fa-info-home"></i> This is where to assign roles to each of the societies</p>
              </div>
            </div>
          </div> -->
          <div class="filter-result">
            <div class="row">
              <form action="" method="get">
                <div class="col s12">
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label>Select Society</label>
                      <select name="society" id="society" class="form-control">
                        <option value="">Choose an Option</option>
                      </select>
                    </div>
                    <div class="form-group col-md-6">
                      <label>Select Role</label>
                      <select name="societyDelegate" id="societyDelegate" class="form-control">
                        <option value="">Choose an Option</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <input type="submit" value="Proceed" name="" class="btn-general">
          </div>
        </div>
        <div class="container">
         <div class="text-center">
            <h4><b>Role:</b> Chairman</h4>
          </div>
          <hr/>
           <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>Name</th>
                  <th>Change</th>
                  <th>Permissions</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>Amos Taiwo Joseph</td>
                  <td>
                   <select name="role" id="role" class="form-control">
                     <option value="">Select an Option</option>
                   </select>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm permissions" data-target="#permissionsModal" data-toggle="modal"> Permission</button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm remove" data-target="#removeUserRoleModal" data-toggle="modal">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div> 

    <div class="modal fade" id="permissionsModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Manage Permissions for Amos Taiwo Joseph as the Union President</h4>
          </div>
          <div class="modal-body padtrbl">
            <!-- <div class="row">
              <div class="input-field col s12">
                <input type="text" name="userName" id="memberName">
                <label for="Society Name">Search </label>
                <span class="error-message" id="societyName-error"></span>
              </div>
            </div> -->
            <div class = "row">
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID">
                  <label for="memberID"></label>
                </p>
              </div>
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID2">
                  <label for="memberID2"></label>
                </p>
              </div>
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID3">
                  <label for="memberID3"></label>
                </p>
              </div>
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID4">
                  <label for="memberID4"></label>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" id="continue" class="btn btn-info" data-dismiss="modal">continue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AssignDelegates',
  
}
</script>
