<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
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
        <Modal/>
      </div>
    </div>
  </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import LoanHistoryList from '@/components/loan/society/LoanHistoryList'
import Modal from '@/components/myLoan/Modal'

export default {
  name: 'SocietyHistory',
  components: {
    HeaderNav,
    PageHeader,
    LoanHistoryList,
    Modal
  },
  data() {
    return{
      pageTitle: 'Society Loan History',
      previousPage: 'Dashboard',
      notificationMessage: '',
      loanHistory: [
        {
          id: 1,
          date: '30/10/2020', 
          amountRequested: 30000,
          amountPaidBack: 25000,
          amountOwing: 5000,
          interestRate: 1000
        },
        {
          id: 2,
          date: '30/10/2020', 
          amountRequested: 30000,
          amountPaidBack: 75000,
          amountOwing: 45000,
          interestRate: 1000
        },
      ]
    } 
  },
  computed: {
    "columns": function columns(){
      if (this.loanHistory.length == 0){
        return [];
      }
      return Object.keys(this.loanHistory[0])
    }
  }
}
</script>
