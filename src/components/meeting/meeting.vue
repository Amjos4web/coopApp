<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Meeting for today <b>15th of June 2020</b>
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">Meeting</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info text-center">
                <p style="font-size: 20px"><i class="fa fa-info-home"></i> Odokoto Ife-Oluwa C.I.C.S</p>
              </div>
            </div>
          </div>
          <div class="filter-result">
            <div class="row">
              <form action="" method="get">
                <div class="row text-center">
                  <div class="input-field col s8 m8 offset-m2">
                    <input type="text" name="memberName" id="memberName" class="" autofocus>
                    <label for="member name">Enter Member's Name</label>
                    <span class="error-message" id="memberName-error"></span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <input type="submit" value="Filter Result" class="btn-general">
          </div>
        </div>
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Make Payment</th>
                  <th>View Payment Records</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Amos Taiwo Joseph</td>
                  <td>
                    <button class="btn btn-danger btn-sm makePayment" data-target="#makePayment" data-toggle="modal">Make Payment</button>
                  </td>
                  <td>
                    <button class="btn btn-info btn-sm viewPayments" data-target="#paymentRecords" data-toggle="modal">View Payment Records</button>
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
            <h4 class="modal-title">Amos Taiwo Payment Records (Passbook)</h4>
          </div>
          <div class="modal-body">
            <p>List of all previous and current payment records made by <b>Amos Taiwo Joseph</b></p>
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


      <div class="modal fade" id="makePayment" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Monthly Due For Amos Taiwo</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="container" :style="{width: '100%;'}">
            <p>List of all monthly payments to be made by <b>Amos Taiwo Joseph</b> for today <b>15th of June 2020</b></p>
              <div class="table-responsive">
                <table class="table table-bordered table-hover make-payment" :style="{width:'60%', margin:'auto'}">
                  <!-- <form action="" method="post" id="pay"> -->
                    <thead>
                      <tr>
                        <th width="40%">Savings<br><label>Min. Amount expected to pay is N2,500</label></th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="savingsAmount" id="savingsAmount">
                            <label for="savings amount">Enter Savings Amount &#x20A6;</label>
                            <span class="error-message" id="savingsAmount-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Shares<br><label>Min. Amount expected to pay is N10,500</label></th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="sharesAmount" id="sharesAmount">
                            <label for="shares amount">Enter Shares Amount &#x20A6;</label>
                            <span class="error-message" id="sharesAmount-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Building Fund<br><label>Min. Amount expected to pay is N100</label></th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="buildingFundAmount" id="buildingFundAmount">
                            <label for="building fund amount">Enter Building Fund Amount &#x20A6;</label>
                            <span class="error-message" id="buildingFundAmount-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Loan Interest<br><label>Amount expected to pay is N100</label></th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="interestAmount" id="interestAmount">
                            <label for="interest amount">Enter Loan Interest Amount &#x20A6;</label>
                            <span class="error-message" id="interestAmount-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Loan Repaid<br><label>Min. Amount expected to pay is N2000</label></th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="loanRepaidAmount" id="loanRepaidAmount">
                            <label for="loan repaid amount">Enter Loan Repaid Amount &#x20A6;</label>
                            <span class="error-message" id="loanRepaidAmount-error"></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th width="40%">Particulars</th>
                        <td width="60%">
                          <div class="input-field">
                            <input type="text" name="particulars" id="particulars">
                            <label for="particulars">Enter Particulars </label>
                            <span class="error-message" id="particulars-error"></span>
                          </div>
                        </td>
                      </tr>
                    </thead>
                    
                  <!-- </form> -->
                </table>
                <div class="text-center">
                  <input type="submit" name="makePayment" class="btn-general" value="Save">
                </div>
              </div>
          </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
  name: 'meeting',
}
</script>
