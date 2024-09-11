<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="ptIsLoading || societyIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container" v-else>
          <form @submit.prevent="getPaymentRecordEventhandler()">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label>From</label>
                    <input type="date" v-model="query.filter.from" class="form-control">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>To</label>
                    <input type="date" v-model="query.filter.to" class="form-control">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Payment Type</label>
                    <select class="form-control" v-model="query.filter.payment_type_id">
                      <option value="">Select Payment Type</option>
                      <option v-for="p in paymentTypes" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                  </div>
                </div>
            
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Select society</label>
                    <select class="form-control" v-model="query.filter.society_id">
                      <option value="">Select Society</option>
                      <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
          
              <div class="text-center mt-20">
                <input type="submit" value="Filter Result" class="btn btn-primary">
              </div>
            </div>
          </form>
            </div>
            <div v-if="memberError">
              <div class="error-div text-center">
                <span>{{ memberError.message }}</span>
              </div>
            </div>
            <div v-if="revenueError">
              <div class="error-div text-center">
                <span>{{ revenueError.message }}</span>
              </div>
            </div>
            <div v-if="fetchManyError">
              <div class="error-div text-center">
                <span>{{ fetchManyError }}</span>
              </div>
            </div>
            <div class="container">
              <div class="table-responsive">
                <table class="styled-table">
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Name</th>
                      <th>Society</th>
                      <th>Payment Type</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <PaymentRecordList :memberAssets="memberAssets"
                  :revenueIsLoading="revenueIsLoading"
                  :memberIsLoading="memberIsLoading"
                  :total="total"
                  />
                </table>
              </div>
              <div class="alert alert-info text-center" v-if="memberAssets.length">
                <p :style="{fontSize: '22px'}">Total: &#x20A6;{{ total}}</p>
              </div>
              <Pagination :pagination="pagination" :changePage="changePage"/>
            </div> 
      </div>
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import Pagination from '@/components/includes/Pagination'
import PaymentRecordList from '@/components/payments/PaymentRecordList'
import { mapActions, mapGetters } from 'vuex'
import { turnArrayToObject } from '../../utility';

export default {
  name: 'records-component',
  components: {
    HeaderNav,
    FooterBar,
    PaymentRecordList,
    Pagination
  },
  data(){
    return {
      pageTitle: 'Payment Records',
      previousPage: 'Dashboard',
      notificationMessage: 'All payment record lists are being showed here',
      societies: [],
      paymentTypes: [],
      pagination:{},
      memberAssets: [],
      total: 0.0,
      fetchManyError: null,
      query:{
        filter: {
          from: '',
          to: '',
          payment_type_id: '',
          society_id: '',
        },
        page: '',
        limit: 200
      }
    }
  },

  methods: {
    ...mapActions("app/society", ["getSocieties", "fetchManySociety"]),
    ...mapActions("app/payment_type", ["getOnePaymentType", "getPaymentTypes"]),
    ...mapActions("app/revenue", ["memberPaymentDataAnalysis"]),
    ...mapActions("app/member", ["fetchManyMember"]),

    changePage(){
      let noError = ''
      this.memberPaymentDataAnalysis(this.$data.query)
      .then(({data, pagination}) => {
        // get all member ID to fetch many member
        const memberIDs = [] //data.memberAssets.map(m => m.member_id)
        const societyIDs = [] //data.memberAssets.map(m => m.society_id)
        const paymentTypeIDs = []

        let asset = null

        for (let i = 0; i< data.memberAssets.length; i++){
          asset = data.memberAssets[i];
          memberIDs.push(asset.member_id)
          societyIDs.push(asset.society_id)
          paymentTypeIDs.push(asset.payment_type_id)
        }

        Promise.all([
          this.fetchManyMember(memberIDs),
          this.fetchManySociety(societyIDs),
          this.getPaymentTypes()
        ])
        .then(results => {
          //ensure we have all neccessary data
          noError = results.every(r=>!!r)
         
          if (noError){
            const memberObj = turnArrayToObject(results[0].members)
            const societyObj = turnArrayToObject(results[1].societies)
            const paymentTypeObj = turnArrayToObject(results[2].paymentTypes)

            this.$data.memberAssets = data.memberAssets.map(asset => {

              const m = memberObj[asset.member_id]
              const s = societyObj[asset.society_id]
              const p = paymentTypeObj[asset.payment_type_id]

              asset.member_name = m ? m.name : "Unknown"
              asset.member_society = s ? s.name : "Unknown"
              asset.payment_type_name = p ? p.name : "Unknown"

              return asset
            })
            this.$data.pagination = data.pagination

            const inTotal = data.memberAssets.reduce((pre, cur) => {
              return parseFloat(pre) + parseFloat(cur.total)
            }, 0)

            this.$data.total = Number(inTotal).toLocaleString()
          }
        })
        .catch(e=>this.$data.fetchManyError=e)
      })
    },
    
    getPaymentRecordEventhandler(){
      let noError = ''
      const society_id = this.$data.query.filter.society_id
      if (society_id.length === 0){
        this.$data.fetchManyError = 'Please select society'
      } else {
        this.$data.fetchManyError = ''
        this.memberPaymentDataAnalysis(this.$data.query)
        .then(({data, pagination}) => {
          // get all member ID to fetch many member
          const memberIDs = [] //data.memberAssets.map(m => m.member_id)
          const societyIDs = [] //data.memberAssets.map(m => m.society_id)
          const paymentTypeIDs = []

          let asset = null

          for (let i = 0; i< data.memberAssets.length; i++){
            asset = data.memberAssets[i];
            memberIDs.push(asset.member_id)
            societyIDs.push(asset.society_id)
            paymentTypeIDs.push(asset.payment_type_id)
          }

          Promise.all([
            this.fetchManyMember(memberIDs),
            this.fetchManySociety(societyIDs),
            this.getPaymentTypes()
          ])
          .then(results => {
            //ensure we have all neccessary data
            noError = results.every(r=>!!r)
            if (noError){
              const memberObj = turnArrayToObject(results[0].members)
              const societyObj = turnArrayToObject(results[1].societies)
              const paymentTypeObj = turnArrayToObject(results[2].paymentTypes)

              this.$data.memberAssets = data.memberAssets.map(asset => {

                const m = memberObj[asset.member_id]
                const s = societyObj[asset.society_id]
                const p = paymentTypeObj[asset.payment_type_id]

                asset.member_name = m ? m.name : "Unknown"
                asset.member_society = s ? s.name : "Unknown"
                asset.payment_type_name = p ? p.name : "Unknown"

                return asset
              })
              this.$data.pagination = pagination

              const inTotal = data.memberAssets.reduce((pre, cur) => {
                return parseFloat(pre) + parseFloat(cur.total)
              }, 0)

              this.$data.total = Number(inTotal).toLocaleString()
            }
          })
          .catch(e=>this.$data.fetchManyError=e)
        })
      }
    }
  },
  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/payment_type", {ptIsLoading:"isLoading", ptError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/revenue", {revenueIsLoading:"isLoading", revenueError:"error"}),
  },
  created(){
    // get all societies
    this.getSocieties({query:{limit:500}})
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
  }
}
</script>
