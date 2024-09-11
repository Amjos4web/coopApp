<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="memberIsLoading || societyIsLoading || loanRequestIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
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
        <div class="container" v-if="loanRequest.guarantors">
          <div class="card">
            <!-- /.panel-heading -->
            <div class="card-body">
              <h5 class="card-title"><i class="fa fa-users"></i> Guarantors</h5>
              <hr>
              <div class="row">
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Society</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody v-if="loanRequestIsLoading || memberIsLoading || societyIsLoading">
                      <tr>
                        <td colspan="4">
                          <div class="text-center" :style="{width: '100%'}">
                            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
                            <small>Fetching data...</small>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
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
          <div class="card">
            <div class="card-body">
              <h5 class="card-title"><i class="fa fa-users"></i> List of Guarantors</h5>
              <hr>
              <div class="row">
                <div class="guarantor-lists d-flex">
                  <div class="guarantors" v-for="g in loanRequest.guarantors" :key="g.id">
                    <img :src="g.guarantor_img" :alt="g.name" class="avatar">
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
          <div class="text-center">
            <a class="btn btn-warning custom-link ml-10 mt-20">
              <router-link to="/myLoan/history">
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
import FooterBar from '@/components/includes/Footer';
import { mapActions, mapGetters } from 'vuex'
import {turnArrayToObject} from '../../utility'

export default {
  name: 'my-loan-guarantors',
  components: {
    HeaderNav,
    FooterBar
  },
  data(){
    return{
      loanRequest:{
        member:null, 
        guarantors:[], 
        societyName:'',
        status:'',
      },  
      pageTitle: 'Loan Request Guarrantor Lists',
      previousPage: 'Dashboard',
      fetchManyMemberError:null,
    }
   
  },
  methods: {
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/society", ["getOneSociety"]),
    ...mapActions("app/loan", ['getOneLoan', "getGuarantorForMember"]),

  },
  computed:{
    ...mapGetters("app/member", {memberIsLoading:"isLoading"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/loan", {loanRequestError:"error", loanRequestIsLoading:"isLoading"}),
  },

  created(){
    const loan_request_id = this.$route.params.loan_request_id
    Promise.all([
      this.getOneLoan(loan_request_id),
      this.getGuarantorForMember({loanRequestID:loan_request_id})
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
              status:loanRequest.status
            }//end set loanRequest
            
          }//end noError
          
        })
        .catch(e=>this.fetchManyMemberError=e)
      }
    })

  },
}
</script>
