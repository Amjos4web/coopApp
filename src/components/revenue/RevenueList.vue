<template>
  <div>
    <div class="text-center mt-20" :style="{marginBottom: '30px'}">
      <h5 class="custom-heading-2">{{ resultText }}</h5>
    </div>
    <div class="dashboard-cards" :style="{marginBottom: '50px'}"> 
      <div class="row">
        <div class="col-lg-4 col-sm-12 col-md-4" v-for="r in revenueLists" :key="r.id">
          <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div class="iq-card-body iq-box-relative">
              <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
                <i class="fa fa-money iq-arrow-left"></i>
              </div>
              <p class="text-secondary"><strong>{{ r.name }}</strong></p>
              <div class="d-flex align-items-center justify-content-between">
                <h3>&#x20A6;{{ Number(r.total).toLocaleString() }}</h3> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <div class="dashboard-cards"> 
      <div class="row">
        <div class="col-lg-6 col-sm-12 col-md-6" v-if="revenueLists.length">
          <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div class="iq-card-body iq-box-relative">
              <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
                <i class="fa fa-money iq-arrow-left"></i>
              </div>
              <p class="text-secondary"><strong>Grand Total</strong></p>
              <div class="d-flex align-items-center justify-content-between">
                <h3>&#x20A6;{{ Number(total).toLocaleString() }}</h3> 
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-sm-12 col-md-6"  v-if="loanIssueOut">
          <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div class="iq-card-body iq-box-relative">
              <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
                <i class="fa fa-money iq-arrow-left"></i>
              </div>
              <p class="text-secondary"><strong>Loan Issued Out</strong></p>
              <div class="d-flex align-items-center justify-content-between">
                <h3>&#x20A6;{{ Number(loanIssueOut).toLocaleString() }}</h3> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const _loanIssueOut = String | Number

export default {
  name: 'revenue-list',
  props: {
    revenueLists: Array,
    loanIssueOut: _loanIssueOut,
    resultText: String
  },
  data(){
    return{
      total: 0.0
    }
  },
  updated(){
    const total = this.revenueLists.reduce((pre, cur)=> {
      return parseFloat(pre) + parseFloat(cur.total)
    }, 0)

    this.$data.total = total
  },
}
</script>