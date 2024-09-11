<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="ptIsLoading || societyIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> {{ notificationMessage }}</p>
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
                  <select class="form-control">
                    <option value="">Select Payment Type</option>
                    <option v-for="p in paymentTypes" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Select society</label>
                  <select class="form-control">
                    <option value="">Select Society</option>
                    <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
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
            <table class="table table-bordered table-hover table-striped">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Society</th>
                  <th>Payment Type</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <PaymentRecordList :paymentRecords="paymentRecords"/>
            </table>
          </div>
          <div class="text-center">
            <h4 class="custom-heading">Total: &#x20A6;50,000, 000</h4>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import PaymentRecordList from '@/components/payments/PaymentRecordList'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'records',
  components: {
    HeaderNav,
    PageHeader,
    PaymentRecordList
  },
  data(){
    return {
      pageTitle: 'Payment Records',
      previousPage: 'Dashboard',
      notificationMessage: 'All payment record lists are being showed here',
      societies: [],
      paymentTypes: [],
      paymentRecords: [],
    }
  },

  methods: {
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/payment_type", ["getPaymentTypes"]),
  },
  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/payment_type", {ptIsLoading:"isLoading", ptError:"error"}),
  },
  created(){
    // get all societies
    this.getSocieties()
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })

     // get all payment types
    this.getPaymentTypes()
    .then(data => {
      if (data){
        this.$data.paymentTypes = data.paymentTypes
      }
    })
  },
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>
