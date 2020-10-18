<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Society Loan History
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Society Loan History</a></li>
        </ol>
      </div>
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
                        <label>Enter Member's Name</label>
                        <input type="text" name="" id="name">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>Requested Date</label>
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>6/20/2020</td>
                  <td>&#x20A6;50,000</td>
                  <td>&#x20A6;30,000</td>
                  <td>&#x20A6;20,000</td>
                  <td>1,500 Monthly</td>
                  <td><label class="in-progress">In Progress</label></td>
                </tr>
              </tbody>
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
  </div>
</template>

<script>
export default {
  name: 'SocietyHistory',
}
</script>
