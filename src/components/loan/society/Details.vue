<template>
  <div>
    <HeaderNav/>
      <div v-if="societyIsLoading || societyLoanIsLoading">
        <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
        </div>
      </div>
      <div id="content-page" class="content-page" v-else>
        <div v-if="societyLoanError">
          <div class="error-div">
            <span>
              {{societyLoanError.message}}
            </span>
          </div>
        </div>
        <div v-else-if="societyError">
          <div class="error-div">
            <span>
              {{societyError.message}}
            </span>
          </div>
        </div>
        <div class="container">
          <div class="card-body">
              <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                      <tbody>
                        <tr>
                          <th>Society Name</th>
                          <td>{{societyLoan.societyName}}</td>
                        </tr>
                        <tr>
                          <th>Amount Requested</th>
                          <td>&#x20A6;{{Number(societyLoan.amountRequested).toLocaleString()}}</td>
                        </tr>
                        <tr>
                          <th>Interest Rate</th>
                          <td>{{societyLoan.intereseRate}}%</td>
                        </tr>
                        <tr>
                          <th>Purpose</th>
                          <td>{{societyLoan.purpose}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> 
            </div>
          <div class="text-center">
            <a class="btn btn-warning custom-link ml-10">
              <router-link to="/loan/society/Status">
                Back
              </router-link>
            </a>
          </div>
        </div>
      </div> 
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import { mapActions, mapGetters } from 'vuex'


export default {
  name: 'SocietyLoanDetails',
  components: {
    HeaderNav,
    FooterBar
  },
  data(){
    return{
      totalAsset: 0.0,
      societyLoan: [],
      pageTitle: '',
      previousPage: 'Dashboard',
      successMsg: '',
      fetchError: null
    }
   
  },
  methods: {
    ...mapActions("app/society", ["getOneSociety"]),
    ...mapActions("app/society_loan", ['getOneLoan']),
   
  },
  computed:{
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/society_loan", {societyLoanError:"error", societyLoanIsLoading:"isLoading"}),
  },

  created(){
    const loan_request_id = this.$route.params.loan_request_id
    
    this.getOneLoan(loan_request_id)
    .then(result=>{
      this.$data.societyLoan = result
      this.getOneSociety(this.$data.societyLoan.society_id)
      .then(data=>{
        //store society
        const society = data
        //set in data
        this.$data.societyLoan = {
          amountRequested: result.amount_requested,
          purpose:result.purpose,
          intereseRate:result.interest_rate,
          societyName:society.name
        }//end set societyLoan
        this.$data.pageTitle = `${this.$data.societyLoan.societyName} Loan Details`
      })
      .catch(e=>this.fetchError=e)
    })
  },
}
</script>
