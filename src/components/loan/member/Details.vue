<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper" >
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="memberPaymentIsLoading || memberIsLoading || societyIsLoading || loanRequestIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div v-if="memberPaymentError">
          <div class="error-div">
            <span>
              {{memberPaymentError.message}}
            </span>
          </div>
        </div>
        <div v-else-if="loanRequestError">
          <div class="error-div">
            <span>
              {{loanRequestError.message}}
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
        <div class="container" v-if="loanRequest.member">
          <div class="panel panel-default">
            <div class="panel-heading">
              <i class="fa fa-user"></i> {{loanRequest.member.name}} Profile
            </div>
            <!-- /.panel-heading -->
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 text-center mb-20">
                  <img src="@/assets/passports/avata.png" class="avatar">
                </div>
                <div class="col-md-8">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                      <tbody>
                        <tr>
                          <th width="50%">Name</th>
                          <td>{{ loanRequest.member.name }}</td>
                        </tr>
                        <tr>
                          <th width="50%">Email Address</th>
                          <td>{{ loanRequest.member.email ? loanRequest.member.email : 'No email address' }}</td>
                        </tr>
                        <tr>
                          <th width="50%">Phone Number</th>
                          <td>{{ loanRequest.member.phone }}</td>
                        </tr>
                        <tr>
                          <th width="50%">Residential Address</th>
                          <td>{{ loanRequest.member.address }}</td>
                        </tr>
                        <tr>
                          <th width="50%">Can Make Payment</th>
                          <td>{{ loanRequest.member.can_pay ? 'Yes' : 'No' }}</td>
                        </tr>
                        <tr>
                          <th>Society</th>
                          <td>{{loanRequest.societyName}}</td>
                        </tr>
                        <tr>
                          <th>Total Asset</th>
                          <td>&#x20A6;{{loanRequest.totalAsset}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> 
            
            </div>
            <!-- /.panel-body -->
          </div>
        
            <div class="panel panel-default">
              <div class="panel-heading">
                <i class="fa fa-users"></i> Guarrantors
              </div>
              <!-- /.panel-heading -->
              <div class="panel-body">
                <div class="row">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Society</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="g in loanRequest.guarantors" :key="g.id">
                          <td>{{g.name}}</td>
                          <td>{{loanRequest.societyName}}</td>
                          <td>{{g.status}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> 
              </div>
              <!-- /.panel-body -->
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <i class="fa fa-users"></i> List of Guarrantors
              </div>
              <!-- /.panel-heading -->
              <div class="panel-body">
                <div class="row">
                  <div class="guarantor-lists d-flex">
                    <div class="guarantors" v-for="g in loanRequest.guarantors" :key="g.id">
                      <img :src="g.guarantor_img" :alt="g.name">
                      <div class="guarantor-info">
                        <p class="p-title text-center">{{ g.name }}</p>
                        <small>{{ loanRequest.societyName }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.panel-body -->
            </div>
            <div v-if="successMsg">
              <div class="text-center success-div">
                <span>
                  {{ successMsg }}
                </span>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <i class="fa fa-money"></i> Loan Details
              </div>
              <!-- /.panel-heading -->
              <div class="panel-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="table-responsive">
                      <table class="table table-striped table-hover table-bordered">
                        <tbody v-if="loanRequest.status == 'pending'">
                          <tr>
                            <th>Amount Requested</th>
                            <td>&#x20A6; {{loanRequest.amountRequested}}</td>
                          </tr>
                          <tr>
                            <th>Total Amount to grant</th>
                            <td>
                              <div class="form-group">
                                <input type="text" v-model="amountGiven" class="form-control">
                              </div>
                              <span class="error" v-if="elementHasError('amount_given')">
                                {{ loanRequestError.errors.amount_given[0] }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                        <tbody v-else>
                          <tr>
                            <th>Amount Requested</th>
                            <td>&#x20A6; {{loanRequest.amountRequested}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div> 
              
              </div>
              <!-- /.panel-body -->
            </div>
            <div class="text-center" v-if="loanRequest.status == 'pending'">
              <button type="button" class="btn btn-success ml-10" @click="adminRespondToLoanRequestHandler(true)">Grant</button>
              <button type="button"  class="btn btn-danger ml-10"  @click="adminRespondToLoanRequestHandler(false)">Reject</button>
              <a class="btn btn-warning custom-link ml-10">
                <router-link to="/loan/member/Status">
                  Back
                </router-link>
              </a>
            </div>
            <div class="text-center" v-else>
              <a class="btn btn-warning custom-link ml-10">
                <router-link to="/loan/member/Status">
                  Back
                </router-link>
              </a>
            </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import { toggleAvatarDropDown, closeNavbar } from '../../../assets/js/helpers/utility';
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'
import {turnArrayToObject} from '../../../utility'


export default {
  name: 'MemberLoanDetails',
  components: {
    HeaderNav,
    PageHeader
  },
  data(){
    return{
      totalAsset: 0.0,
      loanRequest:{
        member:null, 
        guarantors:[], 
        societyName:'',
        totalAsset:0.0,
        amount_requested:0.0,
        status:'',
      },
      pageTitle: 'Members Loan Details',
      previousPage: 'Dashboard',
      amountGiven: '',
      fetchManyMemberError:null,
      successMsg: '',
    }
   
  },
  methods: {
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/society", ["getOneSociety"]),
    ...mapActions("app/loan", ['getOneLoan', "getGuarantorForAdmin", "adminRespondToLoanRequest"]),
    ...mapActions("app/member_payment", ['fetchMemberTotalAsset']),
    ...mapMutations('app/loan', {setLoanRequestError:"setError"}),

    adminRespondToLoanRequestHandler(fromGranted){
      this.setLoanRequestError(null)

      const formData = {
        loan_request_id: this.$route.params.loan_request_id,
      }

      if(fromGranted){
        formData.amount_given = this.$data.amountGiven
        formData.response = "granted"
      }else{
        formData.response = "rejected"
      }

      let validation = new Validator(formData, (fromGranted ? ({
        response: 'required',
        loan_request_id: 'required|numeric',
        amount_given: 'required|numeric'
      }) : ({
        response: 'required',
        loan_request_id: 'required|numeric',
      })))

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors;
        this.setLoanRequestError(error)
      } else {
        this.adminRespondToLoanRequest(formData)
        .then(data => {
          console.log(data)
          if (data){
            this.$data.successMsg = `Loan ${fromGranted ? "granted" : "rejected"} successfully`
          }
        })
      }
    },

    rejectLoanRequestEventHandler(){

    },

    elementHasError(elemID){
      return ((
        this.loanRequestError 
        && this.loanRequestError.errors 
        && this.loanRequestError.errors[elemID] 
        && this.loanRequestError.errors[elemID].length > 0
      ))
    },
  },
  computed:{
    ...mapGetters("app/member", {memberIsLoading:"isLoading"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/loan", {loanRequestError:"error", loanRequestIsLoading:"isLoading"}),
    ...mapGetters("app/member_payment", {memberPaymentError:"error", memberPaymentIsLoading:'isLoading'})
  },

  created(){
    const loan_request_id = this.$route.params.loan_request_id
    Promise.all([
      this.getOneLoan(loan_request_id),
      this.getGuarantorForAdmin({loanRequestID:loan_request_id})
    ])
    .then(result=>{
      console.log(result);
      //ensure we have all neccessary data
      let noError = result.every(r=>!!r)
      //if no error occur while fetching
      if(noError){
        const loanRequest = result[0]
        const guarantors = result[1].guarantors

        console.log(guarantors)

        const memberIDs = guarantors.map(g=>g.member_id).concat(loanRequest.member_id)

        Promise.all([
          this.getOneSociety(loanRequest.society_id),
          this.fetchManyMember(memberIDs),
          this.fetchMemberTotalAsset({member_id:loanRequest.member_id, society_id:loanRequest.society_id})
        ])
        .then(result=>{
          console.log("getOneSociety", result)
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
              phone:m.phone,
              can_pay:m.can_pay,
              address:m.address,
            } : {
              name:"unknown",
              phone:"unknown",
              can_pay:false,
              address:"unknown",
            }//end default object

            //set in data
            this.$data.loanRequest = {
              member, 
              //set the name of all the guarantor
              guarantors:guarantors.map((g, index)=>{
                const m = memberObj[g.member_id]

                return m ? {
                  name:m.name,
                  id:g.id,
                  status:g.status,
                  guarantor_img:g.guarantor_img
                } : {
                  name : "Unknown",
                  id:index,
                  status:"Unknown",
                  guarantor_img:""
                }//end object
              }),//end map
              societyName:society.name,
              //set member total assets
              totalAsset:result[2].totalAsset,
              amountRequested:loanRequest.amount_requested,
              status:loanRequest.status
            }//end set loanRequest
            
          }//end noError
          console.log(this.$data.loanRequest.guarantors)
        })
        .catch(e=>this.fetchManyMemberError=e)
      }
    })
  },
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  },
  
}
</script>
