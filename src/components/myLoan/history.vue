<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Loan History
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/dashboard">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Loan History</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <form action="" method="get">
          <div class="container">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-6 col-md-offset-3">
                  <div class="form-group">
                    <label>Select Society</label>
                    <select name="society" id="society" class="form-control">
                      <option value="">Select Society</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Proceed" class="btn-general">
            </div>
          </div>
        </form>

        <div class="container">
          <h4></h4>
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
        </div> 
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  name: 'history',
}
</script>
