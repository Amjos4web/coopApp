<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <!-- <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i></p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div> -->
              <form action="" method="get" id="filter">
                <div class="filter-result">
                  <div class="row">
                    <div class="col-md-3">
                      <div class="form-group">
                        <label>Select society</label>
                        <select name="society" id="society" class="form-control">
                          <option value="">Select Society</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label>Enter Member's Name</label>
                        <input type="text" name="" id="name">
                      </div>
                    </div>
                    <div class="col-md-3">
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
                    <div class="col-md-3">
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
          </div>
        </div>
        <div class="text-center filter">
          <h4>Loan history for all societies</h4>
        </div>
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>Date Issued</th>
                  <th>Amount requested</th>
                  <th>Amount paid back</th>
                  <th>Amount still owing</th>
                  <th>Interest rate</th>
                  <th>View history</th>
                  <th>Interest Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
                <LoanHistoryList :loanHistory="loanHistory"/>
            </table>
          </div>
          <div class="loan-record-summary text-center">
            <h4>Loan Records / Transaction Summary</h4>
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>Total loan Amount Issued out</th>
                  <th>Total amount Paid</th>
                  <th>Total amount yet to pay</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>&#x20A6;50,000, 000</td>
                  <td>&#x20A6;33,300, 000</td>
                  <td>&#x20A6;16,700, 000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> 
      </div>
    </div> 

    <div class="modal fade" id="loanHistoryModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Loan payment history for Amos Taiwo Joseph</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="row">
              <div class="col-md-8">
                <h5>27th, October 2020</h5>
              </div>
              <div class="col-md-4">
                &#x20A6;20,000
              </div>
               <div class="col-md-8">
                <h5>27th, October 2020</h5>
              </div>
              <div class="col-md-4">
                &#x20A6;20,000
              </div>
               <div class="col-md-8">
                <h5>27th, October 2020</h5>
              </div>
              <div class="col-md-4">
                &#x20A6;20,000
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button"  class="btn btn-info" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div> 

    <div class="modal fade" id="updateInterestRateModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <form action="" method="post" id="editLoan">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Updating interest rate for Amos Taiwo Joseph's loan</h4>
            </div>
            <div class="modal-body padtrbl">
              <div class="container">
                <div class="row">
                  <div class="col-md-10 col-md-offset-1">
                    <div class="form-group">
                      <label for="interest rate">Enter new interest rate</label>
                      <input type="number" name="interestRate" id="interestRate" class="form-control">
                    </div>
                    <span class="error-message" id="interest_rate_error"></span>
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
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import LoanHistoryList from '@/components/loan/member/LoanHistoryList'

export default {
  name: 'MembersHistory',
  components: {
    HeaderNav,
    PageHeader,
    LoanHistoryList
  },
   data() {
    return{
      pageTitle: 'Members Loan History',
      previousPage: 'Dashboard',
      notificationMessage: '',
      loanHistory: [] 
    }
  },
}
</script>
