<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="memberIsLoading ||  memberPaymentIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        
        <div class="container" v-else>
          <div v-if="memberError">
          <div class="error-div text-center">
            <span>
              {{memberError.message}}
            </span>
          </div>
        </div>
        <div v-if="societyError">
          <div class="error-div text-center">
            <span>
              {{societyError.message}}
            </span>
          </div>
        </div>
        <div v-if="memberPaymentError">
          <div class="error-div text-center">
            <span>
              {{memberPaymentError.message}}
            </span>
          </div>
        </div>
        <div v-if="hasError">
          <div class="error-div text-center">
            <span>
              {{errorMessage}}
            </span>
          </div>
        </div>
       
         <RefreshAndBackBtn :reloadIndexData="reloadIndexData" :link="link"/>
          <form @submit.prevent="filterData()">
            <div class="filter-result mt-20">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>From</label>
                    <input type="date" v-model="from" class="form-control">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>To</label>
                    <input type="date" v-model="to" class="form-control">
                  </div>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" value="Filter" class="btn btn-info">
              </div>
            </div>
          </form>
          <div class="row mt-50">
            <div class="col-md-12">
              <div class="message">
                {{ message }}
              </div>
              <div class="table-responsive">
                <table class="styled-table" id="payment-details" v-if="store">
                  <thead>
                    <tr>
                      <th class="bg-lightblue">Date</th>
                      <th v-for="payment_type_name in store.paymentNames" :key="payment_type_name">
                        {{payment_type_name}} &#x20A6;
                      </th>
                    </tr>
                  </thead>
                  <tbody id="tbody">
                    <tr v-for="(d, meeting_calendar) in store.memberPassbook" :key="meeting_calendar">
                      <td class="bg-lightblue"><b>{{meeting_calendar}}</b></td>
                      <td v-for="(payment_type_name) in store.paymentNames" :key="meeting_calendar + '|' + payment_type_name">
                        <b>{{`Cr: ${Number(d[payment_type_name].credit).toLocaleString()} - Bal: ${Number(d[payment_type_name].balance).toLocaleString()}`}}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import RefreshAndBackBtn from '@/components/includes/RefreshAndBackBtn'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'myPayments',
  components: {
    HeaderNav,
    FooterBar,
    RefreshAndBackBtn
  },
  data(){
    return{
      pageTitle: null,
      previousPage: 'Dashboard',
      noPassbook: null,
      store:null,
      link: '/meeting',
      from: '',
      to: '',
      message: '',
      hasError: false,
      errorMessage: ''
    }
  },

  methods: {
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapActions("app/member_payment", ["getMemberPassbookForAdmin"]),
    ...mapActions("app/member", ["getOneMember"]),

    reloadIndexData(){
      console.log(this)
    },

    filterData(){
      if (this.$data.from == ""){
        this.$data.hasError = true
      } else {
        this.$data.hasError = false
      }

      if (this.$data.hasError == false){
        this.getMemberPassbookForAdmin({society_id:this.$route.params.society_id, member_id:this.$route.params.member_id, from:this.$data.from, to:this.$data.to})
        .then(response=>{
          if (response){
            this.$data.store = response;
            this.$data.message = `Payments/Transactions from ${this.$data.from} to ${this.$data.to ? this.$data.to : 'date'}`
          } 
        })
      } else {
        this.$data.errorMessage = 'Please select necessary date parameters'
      }
    }

  },

  created(){
    this.getOneMember(this.$route.params.member_id)
    .then(data2=> {
      if (data2) {
        this.$data.pageTitle = `${data2.name} Member Passbook`
      }
    })

    this.getMemberPassbookForAdmin({society_id:this.$route.params.society_id, member_id:this.$route.params.member_id, from:this.$data.from, to:this.$data.to})
    .then(data=>{
      if (data){
        this.$data.store = data;
      } 
    })
  },

  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    ...mapGetters("app/member", {memberError:"error", memberIsLoading:"isLoading"})
  }
}
</script>