<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Loan Request
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/dashboard">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Loan Request</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p class="page-notification-message"><i class="fa fa-info-circle"></i> This is where you request for loan. Kindly fill the form below </p>
                <!-- <p class="export-btn"><button class="btn btn-info btn-sm"><i class="fa fa-download"></i>&nbsp;Import CSV</button></p> -->
              </div>
            </div>
          </div>
          
            <div class="box">
              <div class="row">
                <div class="row">
                  <div class="col s12 text-center">
                    <button class="btn-general" data-target="#addGuarantor" data-toggle="modal"><i class="fa fa-user"></i>&nbsp;Select Guarantors</button>
                    <span class="" id="listOfGuarantors"></span>
                    <input type="hidden" name="listOfGuarantors" value="">
                  </div>
                </div>
                <form action="" method="get" class="col s12" id="loanRequest">
                <div class="row">
                  <div class="form-group col s12">
                    <label>Select Society</label>
                      <select name="society" id="society" class="form-control">
                        <option value="">Select Society</option>
                      </select>
                    <span class="error-message" id="society-error"></span>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <input type="number" name="amount" id="amount" autofocus>
                    <label for="amount">Amount to borrow</label>
                    <span class="error-message" id="amount-error"></span>
                  </div>
                </div>
                
                <div class="row">
                  <div class="input-field col s12">
                    <textarea id="textarea1" class="materialize-textarea" name="loanPurpose"></textarea>
                    <label for="purpose">Purpose of Request</label>
                    <span class="error-message" id="loanPurpose-error"></span>
                  </div>
                </div>
                 <div class="text-center">
                  <input type="submit" value="Request Loan" class="btn-general">
                </div>
                </form>
              </div>
            </div>
        </div>
      </div>
    </div>

      
      <div class="modal fade" id="addGuarantor" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Select Guarantors</h4>
          </div>
          <div class="modal-body">
            <p>These are list of members in your society (Society name goes here). Please choose minimum of 4 guarantors from the list</p>
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
            <button type="button" class="btn btn-info" id="continue">Continue</button>
            <button type="button" class="btn btn-default pull-right cancel ml-10" data-dismiss="modal" id="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'request',
}
</script>