<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Loan Records
        </h3>
        <ol class="breadcrumb">
           <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Loan Records</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> All registered members that have loan to pay are being showed here</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p>
              </div>
            </div>
          </div>
          <form action="" method="get" id="filter">
          <div class="filter-result">
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
                  <label>Payment Type</label>
                  <select name="paymentTypes" id="paymentType" class="form-control">
                    <option value="">Select Payment Type</option>
                    <option value="All">All Payments</option>
                  </select>
                </div>
              </div>
            </div>
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
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Society</th>
                  <th>Payment Type</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Ada Dorcas</td>
                  <td>Odokoto Ife-Oluwa C.I.C.S</td>
                  <td>Savings</td>
                  <td>&#x20A6;50,000</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div class="text-center">
            <h4>Total: &#x20A6;50,000, 000</h4>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'records',
}
</script>
