<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Set Interest Rate
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">Interest Rate</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p class="text-center">Enter the percentage to be calculated on any amount for loan interest and transaction</p>
              </div>
            </div>
          </div>
          <form action="" method="get" class="col s12">
            <div class="box">
              <div class="row">
                <div class="form-group">
                  <div class="row">
                    <div class="input-field col s12">
                      <input type="number" name="interestRate" id="interestRate">
                      <label for="interest rate">Interest Rate in Percentage</label>
                      <span class="error-message" id="interestRate-error"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" value="Save" name="interestRate" class="btn-general">
              </div>
            </div>
          </form>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  name: 'interestRate',
}
</script>
