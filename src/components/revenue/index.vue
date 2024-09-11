<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="societyIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container" v-else>
          <div v-if="societyMembersPaymentError">
            <div class="error-div text-center">
              <span>{{ societyMembersPaymentError.message }}</span>
            </div>
          </div>
          <form @submit.prevent="getRevenueEventHandler()">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>From</label>
                    <input type="date" v-model="from" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>To</label>
                    <input type="date" v-model="to" class="form-control">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Select society</label>
                    <select class="form-control" v-model="society_id">
                      <option value="">Select Society</option>
                      <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" value="Proceed" class="btn btn-primary">
              </div>
            </div>
          </form>
        </div>
        
        <div v-if="societyMembersPaymentIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container" v-else>
          <RevenueList :revenueLists="revenueLists" :loanIssueOut="loanIssueOut" :resultText="resultText"/>
        </div> 
      </div>
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import RevenueList from '@/components/revenue/RevenueList'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'revenueRecord',
  components: {
    HeaderNav,
    FooterBar,
    RevenueList
  },
  data(){
    return {
      pageTitle: 'Revenue',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where the union total revenue is being calculated and shown based on society',
      resultText: null,
      societies: [],
      revenueLists: [],
      loanIssueOut: 0.0,
      society_id: '',
      from: '',
      to:''
    }
  },
  methods: {
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/revenue", ["societyMembersPaymentRecordDataAnalysis"]),
    ...mapActions("app/society", ["getOneSociety"]),

    getRevenueEventHandler(){
      this.societyMembersPaymentRecordDataAnalysis({society_id:this.$data.society_id, from:this.$data.from, to:this.$data.to})
      .then(data => {
        if (data){
          const store = {};
          for(const rev of data.result){
            if(store[rev.payment_type_id]){
              store[rev.payment_type_id].total += parseFloat(rev.total);
            }else{
              store[rev.payment_type_id] = {
                total:parseFloat(rev.total),
                name: rev.name,
                payment_type_id: rev.payment_type_id,
                society_id: rev.society_id,
                meeting_calendar_id: rev.meeting_calendar_id 
              }
            }
          }
          this.$data.revenueLists = Object.values(store)
          this.$data.loanIssueOut = data.loanIssueOut
          this.getOneSociety(this.$data.society_id)
          .then(response => {
            if (response){
              if (data.result.length){
                this.$data.resultText = `All Payment Types Revenue Summary for ${response.name}`
              } else {
                this.$data.resultText = `No Payment Type Summary Found for ${response.name}`
              }
            } 
          }) 
          
        } 
      })
    }
  },

  created(){
    // get all societies
    this.getSocieties({query:{limit:500}})
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })
  },

  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/revenue", {societyMembersPaymentIsLoading:"isLoading", societyMembersPaymentError:"error"})
  }
}
</script>
