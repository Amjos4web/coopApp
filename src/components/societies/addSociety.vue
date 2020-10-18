<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Create Society
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Create Society</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p class="page-notification-message"><i class="fa fa-info-circle"></i> This is where society is being added </p>
                <!-- <p class="export-btn"><button class="btn btn-info btn-sm"><i class="fa fa-download"></i>&nbsp;Import CSV</button></p> -->
              </div>
            </div>
          </div>
          
            <div class="box">
              <div class="row">
                <div class="form-group">
                   <!-- <div class="row">
                    <div class="col s12 text-center">
                      <button class="btn btn-general" data-target="#selectMembers" data-toggle="modal"><i class="fa fa-user"></i>&nbsp;Select Members</button>
                      <span class="" id="listOfMembers"></span>
                      <input type="hidden" name="listOfMembers" value="">
                    </div>
                  </div> -->
                  <form action="" method="get" class="col s12" id="createSociety">
                  <div class="row">
                    <div class="input-field col s12">
                      <input type="text" name="societyName" id="societyName" class="" autofocus>
                      <label for="Society Name">Soiety Name</label>
                      <span class="error-message" id="societyName-error"></span>
                    </div>
                  </div>

                  <table class="table">
                  <tr>
                    <th>Choose</th>
                    <th>Payment Type</th>
                    <th>Amount</th>
                  </tr>
                  <tr>

                    <td style="width: 30%"><label class="switch"><input type="checkbox" id="c-savings" value="Savings" class="payment"><span class="slider round"></span></label></td>
                    <td style="width: 30%">Savings</td>
                    <td style="width: 40%"><input type="text" class="form-control textInput" id="t-savings" name="savingsAmount" disabled>
                      <span class="error-message" id="savings-error"></span>
                    </td>
                    
                  </tr>
                  <tr>
                    <td style="width: 30%"><label class="switch"><input type="checkbox" id="shares" value="Shares" class="payment"><span class="slider round"></span></label></td>
                    <td style="width: 30%">Shares</td>
                    <td style="width: 40%"><input type="text" class="form-control textInput" id="t-shares" name="savingsAmount" disabled>
                      <span class="error-message" id="shares-error"></span>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%"><label class="switch"><input type="checkbox" id="c-bf" value="Building Fund" class="payment"><span class="slider round"></span></label></td>
                    <td style="width: 30%">Building Fund</td>
                    <td style="width: 40%"><input type="text" class="form-control textInput" id="t-bf" name="bfAmount" disabled>
                      <span class="error-message" id="bf-error"></span>
                    </td>
                  </tr>
                </table>

                 <div class="row">
                    <div class="input-field col s12">
                      <textarea id="textarea1" class="materialize-textarea" name="notes"></textarea>
                      <label for="notes">Notes</label>
                      <span class="error-message" id="notes-error"></span>
                    </div>
                  </div>
                </form>
                </div>
              </div>
            </div>
            <div class="text-center">
              <input type="submit" value="Save" class="btn-general">
            </div>
          
        </div>
        </div>
      </div>

    <div class="modal fade" id="selectMembers" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Select Members</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="row">
              <div class="input-field col-md-6 col-md-offset-3">
                <input type="text" name="memberName" id="memberName">
                <label for="Society Name">Search member</label>
                <span class="error-message" id="societyName-error"></span>
              </div>
            </div>
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
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div> 
</template>

<script>
export default {
  name: 'addSociety',

}
</script>
