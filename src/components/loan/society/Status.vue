<template>
  <div>
      <HeaderNav/>
      <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
        <div class="page-inner">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="alert alert-info flex-container">
                  <p><i class="fa fa-info-circle"></i> All registered members that requested for laon are being showed here</p>
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
                      <label>Status</label>
                      <select name="status" id="status" class="form-control">
                        <option value="">Choose an Option</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Requested Date From</label>
                      <input type="date" name="date" id="date">
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" value="Filter Result" class="btn-general">
              </div>
            </form>
          </div>
          
          <div class="container">
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr class="theading">
                    <th>S/N</th>
                    <th>Society</th>
                    <th>Total Assets</th>
                    <th>Total Amount Requested</th>
                    <th>View Details</th>
                    <th>View Profile</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                  <LoanRequestList/>
              </table>
            </div>
          </div>
        </div> 

      <div class="modal fade" id="loanDetails" role="dialog" style="border-radius: 5px;">
        <div class="modal-dialog modal-lg">
          <!-- Modal content no 1-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Info on Odokoto Ife-Oluwa Loan Request Form</h4>
            </div>
            <form action="" method="post" id="requestLoan">
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
                        <tr>
                          <th>Total Amount to grant</th>
                          <td>
                            <div class="form-group">
                              <input type="text" name="amount" id="amount" class="form-control">
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>	
                </div>
                <div class="modal-footer">
                  <input type="submit" class="btn btn-success" value="Grant Loan">
                  <button type="button" class="btn btn-warning pull-right ml-10" data-dismiss="modal" id="cancel">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="modal fade" id="profileDetails" role="dialog" style="border-radius: 5px;">
        <div class="modal-dialog modal-lg">
          <!-- Modal content no 1-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Odokoto Ifeoluwa Details</h4>
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

    <div class="modal fade" id="editLoan" role="dialog" style="border-radius: 5px;">
        <div class="modal-dialog modal-lg">
          <!-- Modal content no 1-->
          <form action="" method="post" id="editLoan">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Editing loan for Odokoto Ife-Oluwa</h4>
              </div>
              <div class="modal-body padtrbl">
                <div class="container" :style="{width: '100%'}">
                  <div class="row">
                    <div class="col-md-10 col-md-offset-1">
                      <table class="table table-bordered">
                        <tbody>
                          <tr>
                            <th>28th, October 2020</th>
                            <td>
                              <input type="text" name="payments" id="payments" class="form-control" value="50000">
                            </td>
                          </tr>
                          <tr>
                            <th>29th, October 2020</th>
                            <td>
                              <input type="text" name="payments" id="payments" class="form-control" value="70000">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              <div class="text-center">
                <input type="submit" value="Save" class="btn btn-info ml-10" name="save">
                <button type="button" class="btn btn-warning ml-10" data-dismiss="modal" id="cancel">Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div> 
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import LoanRequestList from '@/components/loan/society/LoanRequestList'

export default {
  name: 'SocietyStatus',
  components: {
    HeaderNav,
    PageHeader,
    LoanRequestList
  },
  data() {
    return{
      pageTitle: 'Society Loan Status',
      previousPage: 'Dashboard',
      notificationMessage: '',
    } 
  }
}
</script>
