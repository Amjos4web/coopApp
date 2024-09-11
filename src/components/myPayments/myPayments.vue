<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Payment Records
        </h3>
        <ol class="breadcrumb">
          <li>
            <a>
							<router-link to="/dashboard">
								Dashboard
							</router-link>
						</a>
          </li>
          <li><a href="#" class="active">Payment Records</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <form action="" method="get">
          <div class="container">
            <div class="filter-result">
              <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Select Society</label>
                      <select name="society" id="society" class="form-control">
                        <option value="">Select Society</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Select Year</label>
                      <select name="year" id="year" class="form-control">
                        <option value="">Select Year</option>
                      </select>
                    </div>
                  </div>
              </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Show Payment Records" class="btn-general" data-target="#paymentRecords" data-toggle="modal">
            </div>
          </div>
        </form>
      </div>
    

    <div class="modal fade" id="paymentRecords" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Payment Records for the year 2020 (Odokoto Ifeoluwa C.I.C.S)</h4>
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
import HeaderNav from '@/components/includes/headerNav';
export default {
    name: 'myPayments',
    components: {
      HeaderNav
    }
}
</script>