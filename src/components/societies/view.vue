<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Societies
        </h3>
        <ol class="breadcrumb">
           <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Societies</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> All list of societies are being showed here</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div>
            </div>
          </div>
          <form action="" method="get">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Select a member</label>
                    <select name="societyName" id="societyName" class="form-control">
                      <option value="">Select a Society</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Select a member</label>
                    <input type="text" name="societyNameInput" id="societyNameInput" class="form-control">
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="text-center">
            <input type="submit" value="Filter Result" class="btn-general">
          </div>
        </div>
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Society Name</th>
                  <th>No of Members</th>
                  <th>Date Established</th>
                  <th>View</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>55 Members</td>
                  <td>5th, Janaury 2018</td>
                  <td>
                    <button class="btn btn-info btn-sm viewSociety" data-target="#viewSociety" data-toggle="modal">View</button>
                  </td>
                  <td>
                    <button class="btn btn-warning btn-sm editSociety" data-target="#editSociety" data-toggle="modal">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div> 

    <div class="modal fade" id="viewSociety" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Odokoto Ifeoluwa C.I.C.S Details</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="container" :style="{width: '100%;'}">
            <div class="table-responsive">
              <table class="table table-striped table-hover table-bordered">
                <tbody>
                  <tr>
                    <th width="50%">Name</th>
                    <td id="name"></td>
                  </tr>
                  <tr>
                    <th width="50%">Number of Members</th>
                    <td id="noOfMembers"></td>
                  </tr>
                  <tr>
                    <th width="50%">Date Established</th>
                    <td id="dateEstablished"></td>
                  </tr>
                  <tr>
                    <th width="50%">Day of Meeting</th>
                    <td id="dom"></td>
                  </tr>
                  <tr>
                    <th>Total Saving</th>
                    <td id="savings"></td>
                  </tr>
                  <tr>
                    <th>Total Shares</th>
                    <td id="shares"></td>
                  </tr>
                  <tr>
                    <th>Total Buiding Fund</th>
                    <td id="buildingFund"></td>
                  </tr>
                  <tr>
                    <th>Total Loan Issued</th>
                    <td id="loanIssued"></td>
                  </tr>
                  <tr>
                    <th>Total Loan Repaid</th>
                    <td id="loanRepaid"></td>
                  </tr>
                  <tr>
                    <th width="50%">Total Asset</th>
                    <td id="asset"></td>
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
</template>

<script>
export default {
  name: 'societies',
}
</script>
