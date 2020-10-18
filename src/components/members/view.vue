<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Members
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">View Members</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> All registered members in all the societies are being showed here</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div>
            </div>
          </div>
          <form action="" method="get" id="filter">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Select society</label>
                    <select name="society" id="society" class="form-control">
                      <option value="">Select Society</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Select a member</label>
                    <select name="memberSelect" id="memberSelect" class="form-control">
                      <option value="">Select a Member</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Enter member name</label>
                    <input type="text" name="memberName" id="memberName" class="form-control">
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <input type="submit" value="Filter Result" class="btn-general">
            </div>
          </form>
          </div>
        </div>
     
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Society</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Deactivate</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Amos Joseph</td>
                  <td>08123434567</td>
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>
                    <button class="btn btn-warning btn-sm" data-target="#viewProfile" data-toggle="modal">View Profile</button>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm">Edit</button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm">Deactive</button>
                  </td>
                </tr>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Amos Joseph</td>
                  <td>08123434567</td>
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>
                    <button class="btn btn-warning btn-sm" data-target="#viewProfile" data-toggle="modal">View Profile</button>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm">Edit</button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm">Deactive</button>
                  </td>
                </tr>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Amos Joseph</td>
                  <td>08123434567</td>
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>
                    <button class="btn btn-warning btn-sm" data-target="#viewProfile" data-toggle="modal">View Profile</button>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm">Edit</button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm">Deactive</button>
                  </td>
                </tr>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Amos Joseph</td>
                  <td>08123434567</td>
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>
                    <button class="btn btn-warning btn-sm" data-target="#viewProfile" data-toggle="modal">View Profile</button>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm">Edit</button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm">Deactive</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
    <div class="modal fade" id="viewProfile" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Ada Dorcas Pofile Details</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="container" :style="{width: '100%;'}">
          <div class="row">
            <div class="col-md-12 text-center">
              <img src="@/assets/passports/avata.png" class="avatar">
            </div>
          </div>
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
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
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
  name: 'viewMembers',
}
</script>
