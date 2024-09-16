<template>
    <div>
      <HeaderNav/>
        <div id="content-page" class="content-page">
          <div v-if="memberPaymentIsLoading || memberIsLoading || societyIsLoading || loanRequestIsLoading">
            <div class="text-center" :style="{width: '100%'}">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
            </div>
          </div>
          <div v-if="memberPaymentError">
            <div class="error-div text-center">
              <span>
                {{memberPaymentError.message}}
              </span>
            </div>
          </div>
          <div v-else-if="loanRequestError">
            <div class="error-div text-center">
              <span>
                {{loanRequestError.message}}
              </span>
            </div>
          </div>
          <div v-else-if="societyError">
            <div class="error-div text-center">
              <span>
                {{societyError.message}}
              </span>
            </div>
          </div>
          
          <div class="container">
            <div class="col-md-12">
              <h4 style="color:grey">{{ pageTitle }}</h4>
              <div class="table-responsive">
                <table class="styled-table">
                  <tbody>
                    <tr>
                      <th width="50%">Name</th>
                      <td>{{ loanRequest.member ? loanRequest.member.name : 'Unknown' }}</td>
                    </tr>
                    <tr>
                      <th>Society</th>
                      <td>{{loanRequest.societyName}}</td>
                    </tr>
                    
                    <tr>
                      <th>Total Amount Granted</th>
                      <td>&#x20A6;{{ Number(amount_given).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <th>Total Amount Paid</th>
                      <td>&#x20A6;{{ Number(total_loan_amount_repaid).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <th>Total Amount Remaining</th>
                      <td>&#x20A6;{{ Number(total_loan_amount_remaining).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <th>Loan Status</th>
                      <td>{{ amount_given == total_loan_amount_repaid ? 'Completed' : 'Still Servicing' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row text-center">
              <div class="col-md-4"></div>
              <div class="col-md-4"></div>
              <div class="col-md-4"></div>
            </div>
            <canvas ref="loan_performance_chart"></canvas>
            <div class="text-center mt-10">
              <a class="btn btn-warning custom-link ml-10">
                <router-link to="/loan/member/Status">
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
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import Chart from 'chart.js'
  import {turnArrayToObject} from '../../../utility'
  
  export default {
    name: 'MemberLoanPerformanceAnalysis',
    components: {
      HeaderNav,
      FooterBar
    },
    data(){
      return{
        totalAsset: 0.0,
        loanRequest:{
          member:null, 
          societyName:'',
          totalAsset:0.0,
        },
        pageTitle: 'Members Loan Performance Analysis',
        previousPage: 'Dashboard',
        loanPaymentHistory: [],
        total_loan_amount_repaid: 0.0,
        total_loan_amount_remaining: 0.0,
        amount_given: 0.0
      }
     
    },
    methods: {
      ...mapActions("app/member", ["fetchManyMember"]),
      ...mapActions("app/society", ["getOneSociety"]),
      ...mapActions("app/loan", ['getOneLoan', 'getGuarantorForAdmin', 'getLoanPaymentHistoryForAdmin']),
      ...mapActions("app/member_payment", ['fetchMemberTotalAsset']),
      ...mapMutations('app/loan', {setLoanRequestError:"setError"}),

      getLoanPaymentHistory(){
        this.getLoanPaymentHistoryForAdmin({loanRequestID:this.$route.params.loan_request_id})
        .then(data=>{
          if (data){
           this.$data.loanPaymentHistory = data.history
           this.$data.total_loan_amount_remaining = data.total_loan_amount_remaining
           this.$data.total_loan_amount_repaid = data.total_loan_amount_repaid
           this.$data.amount_given = data.amount_given
          }
        })
      },

      formatDate(dateString){
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'short' // This will return full month name (e.g. January)
        });
      },

      createChart() {
        const ctx = this.$refs.loan_performance_chart.getContext('2d');
        new Chart(ctx, {
          type: "line",
          data: {
            labels: this.loanPaymentHistory.map(history => this.formatDate(history.created_at)), // Use actual dates
            datasets: [
              {
                label: "Amount Paid",
                data: this.loanPaymentHistory.map(history => history.amount_paid), // Actual paid amounts
                backgroundColor: "rgba(71, 183,132,.5)",
                borderColor: "#47b784",
                borderWidth: 3
              },
            ]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    padding: 25
                  }
                }
              ]
            }
          }
        });
      },
    },
    computed:{
      ...mapGetters("app/member", {memberIsLoading:"isLoading"}),
      ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
      ...mapGetters("app/loan", {loanRequestError:"error", loanRequestIsLoading:"isLoading"}),
      ...mapGetters("app/member_payment", {memberPaymentError:"error", memberPaymentIsLoading:'isLoading'}),
    },

    watch: {
      loanPaymentHistory(newValue) {
        if (newValue.length) {
          this.createChart();
        }
      }
    },

    created(){
      const loan_request_id = this.$route.params.loan_request_id
      Promise.all([
        this.getOneLoan(loan_request_id),
        this.getGuarantorForAdmin({loanRequestID:loan_request_id}),
      ])
      .then(result=>{
        //ensure we have all neccessary data
        let noError = result.every(r=>!!r)
        //if no error occur while fetching
        if(noError){
          const loanRequest = result[0]
          const guarantors = result[1].guarantors

          const memberIDs = guarantors.map(g=>g.member_id).concat(loanRequest.member_id)

          Promise.all([
            this.getOneSociety(loanRequest.society_id),
            this.fetchManyMember(memberIDs),
            this.fetchMemberTotalAsset({member_id:loanRequest.member_id, society_id:loanRequest.society_id})
          ])
          .then(result=>{
            //ensure we have all neccessary data
            noError = result.every(r=>!!r)

            if(noError){
              //turn array to object
              const memberObj = turnArrayToObject(result[1].members)
              //get the member request for loan
              const m = memberObj[loanRequest.member_id]

              //store society
              const society = result[0]
              
              //set the detail of the member requesting for the loan
              const member = m ? {
                name:m.name,
              } : {
                name:"unknown",
                
              }//end default object

              //set in data
              this.$data.loanRequest = {
                member, 
                societyName:society.name,
                //set member total assets
                totalAsset:result[2].totalAsset,
                amountRequested:loanRequest.amount_requested,
                status:loanRequest.status
              }//end set loanRequest
              
            }//end noError
          })
          .catch(e=>this.fetchManyMemberError=e)
        }
      })
      this.getLoanPaymentHistory()
    },
  }
  </script>
  