<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Union Revenue
        </h3>
        <ol class="breadcrumb">
           <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Union Revenue</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i>
                  This is where the union total revenue is being calculated and shown based on society
                </p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div>
            </div>
          </div>
          <div class="filter-result">
            <form action="" method="get" id="filter">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>From</label>
                    <input type="date" name="from" id="from">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>To</label>
                    <input type="date" name="to" id="to">
                  </div>
                </div>
             
              <div class="col-md-4">
                <div class="form-group">
                  <label>Select society</label>
                  <select name="society" id="society" class="form-control">
                    <option value="">Select Society</option>
                  </select>
                </div>
              </div>
              </div>
            </form>
          </div>
          <div class="text-center">
            <input type="submit" value="Proceed" class="btn-general">
          </div>
        </div>
        
        <div class="container">
          <div class="table-responsive">
            <h4 class="text-center">Income Revenue for All Societies</h4>
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>Society</th>
                  <th>Savings</th>
                  <th>Shares</th>
                  <th>Buiding Fund</th>
                  <th>Loan Issues Out</th>
                  <th>Loan Repaid</th>
                  <th>Interest</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>&#x20A6;50,000</td>
                  <td>&#x20A6;50,000</td>
                  <td>&#x20A6;50,000</td>
                  <td>&#x20A6;50,000</td>
                  <td>&#x20A6;50,000</td>
                  <td>&#x20A6;50,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="revenue-summary text-center">
            <h4>Revenue / Transaction Summary for all Societies</h4>
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>Total Asset</th>
                  <th>Total Outstanding Loan</th>
                  <th>Total Profit Made</th>
                  <th>Total Loss</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>&#x20A6;50,000, 000</td>
                  <td>&#x20A6;33,300, 000</td>
                  <td>&#x20A6;16,700, 000</td>
                  <td>&#x20A6;0</td>
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
  name: 'revenueRecord',
}
</script>
