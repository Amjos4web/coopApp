<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper" >
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
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
            <div class="panel panel-default">
              <div class="panel-heading">
                <i class="fa fa-users"></i> List of Guarrantors
              </div>
              <!-- /.panel-heading -->
              <div class="panel-body">
                <div class="row">
                  <div class="col-md-4 text-center" v-for="g in loanRequest.guarantors" :key="g.id">
                    <img class="avatar" :src="g.guarantor_img"/>
                    <h5>{{ g.name }}</h5>
                    <small>{{ loanRequest.societyName }}</small>
                  </div>
                </div>
              </div>
              <!-- /.panel-body -->
            </div>
            <div class="text-center">
              <a class="btn btn-warning custom-link ml-10">
                <router-link to="/myLoan/history">
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
import { toggleAvatarDropDown, closeNavbar } from '../../assets/js/helpers/utility';
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'
import {turnArrayToObject} from '../../utility'


export default {
  name: 'my-loan-guarantors',
  components: {
    HeaderNav,
    PageHeader
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
      console.log(result);
      //ensure we have all neccessary data
      let noError = result.every(r=>!!r)
      //if no error occur while fetching
      if(noError){
        const loanRequest = result[0]
        const guarantors = result[1].guarantors

        //console.log(guarantors)

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
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  },
  
}
</script>
