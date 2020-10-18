<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Member's Due
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Members Due</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <!-- <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info text-center">
                <p style="font-size: 20px"><i class="fa fa-info-home"></i> Odokoto Ife-Oluwa C.I.C.S</p>
              </div>
            </div>
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
                  <th>Phone No</th>
                  <th>View Payment Records</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Amos Taiwo Joseph</td>
                  <td>Oba-loluwa C.I.C.S</td>
                  <td>09023234345</td>
                  <td>
                    <button class="btn btn-info btn-sm modal-trigger" data-target="#paymentRecords" data-toggle="modal">View Payment Records</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal fade" id="paymentRecords" role="dialog" style="border-radius: 5px;">
        <div class="modal-dialog modal-lg">
          <!-- Modal content no 1-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Payment Records for Amos Taiwo Joseph</h4>
            </div>
            <div class="modal-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover" id="payment-details">
                  <thead>
                    <tr>
                      <th rowspan="2" width="8%" class="_style">Date</th>
                      <th rowspan="2" width="12%" class="_style">Particulars</th>
                      <th width="80%" class="_style">
                        
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody id="tbody">
                    <tr>
                      <td>6/18/2020</td>
                      <td>To Balance</td>
                      <td>
                        <table class="table" id="payment-types" style="height:inherit">
                          <tbody>
                            <tr>
                              <th class="_style" colspan="3">Shares</th>
                              <th class="_style" colspan="3">Savings</th>
                              <th class="_style" colspan="3">Loans</th>
                              <th class="_style" colspan="3">Interest</th>
                              <th class="_style" colspan="3">Fixed Deposit</th>
                              <th class="_style" colspan="3">Building Fund</th>
                              <th class="_style" colspan="3">Signature</th>
                              
                            </tr>
                            <tr>
                              <td>Cr.</td>
                              <td>Dr.</td>
                              <td>Bal.</td>
                              <td>Cr.</td>
                              <td>Dr.</td>
                              <td>Bal.</td>
                              <td>Cr.</td>
                              <td>Dr.</td>
                              <td>Bal.</td>
                              <td>Cr.</td>
                              <td>Dr.</td>
                              <td>Bal.</td>
                              <td>Cr.</td>
                              <td>Dr.</td>
                              <td>Bal.</td>
                              <td>Cr.</td>
                              <td>Dr.</td>
                              <td>Bal.</td>
                              <td rowspan="2">Secretary</td>
                            </tr>
                            <tr>
                              <td>10000</td>
                              <td>50000</td>
                              <td>100000</td>
                              <td>10000</td>
                              <td>50000</td>
                              <td>100000</td>
                              <td>10000</td>
                              <td>50000</td>
                              <td>100000</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>10000</td>
                              <td>50000</td>
                              <td>100000</td>
                              <td>10000</td>
                              <td>50000</td>
                              <td>100000</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-right cancel ml-10" data-dismiss="modal" id="cancel">Ok</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
  name: 'membersDue',
}
</script>
