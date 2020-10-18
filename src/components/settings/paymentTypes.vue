<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Payment Types
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">Payment Types</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> Add new payment type</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#addPaymentTypesModal"><i class="fa fa-plus"></i>&nbsp;Add New Payment Type</button></p>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Payment Name</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Shares</td>
                  <td>
                    <a href="#" class="btn btn-info">Edit</a>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> 
      </div>
    </div>  


    <div class="modal fade" id="addPaymentTypesModal" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <form action="" method="post" id="addPaymentType">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Add New Payment Type</h4>
            </div>
            <div class="modal-body padtrbl">
              <div class="table-responsive">
                <table class="table table-bordered table-hover" :style="{width:'60%', margin:'auto'}">
                  <thead>
                    <tr>
                      <th width="40%">Payment Name</th>
                      <td width="60%">
                        <div class="input-field">
                          <input type="text" name="name" id="name">
                          <label for="user name">Enter name</label>
                          <span class="error-message" id="name-error"></span>
                        </div>
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <input type="submit" name="addPaymentType" class="btn btn-info" value="Save">
              <button type="button" id="continue" class="btn btn-warning ml-10" data-dismiss="modal">close</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paymentTypes',
}
</script>
