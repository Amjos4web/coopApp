<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
     <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="memberIsLoading || societyIsLoading || loanRequestIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div v-if="loanRequestError">
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
              <i class="fa fa-user"></i> {{ loanRequest.member.name }} Profile
            </div>
            <!-- /.panel-heading -->
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 text-center">
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
                       
                      </tbody>
                    </table>
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
                          <th>Approve</th>
                          <th>Reject</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="g in loanRequest.guarantors" :key="g.id">
                          <td>{{ g.name }}</td>
                          <td>{{ loanRequest.societyName }}</td>
                          <td>
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#approveGuarrantor" data-backdrop="static" data-keyboard="false" @click="switchOnCamera(g.member_id)" :disabled="g.status == 'accepted'">Approve</button>
                          </td>
                          <td>
                            <button type="button" class="btn btn-danger" data-target="#rejectGuarrantor" data-toggle="modal" :disabled="g.status == 'rejected'" @click="setRejectGuarantorMemberID(g.member_id)">Reject</button>
                          </td>
                          <td>{{ g.status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> 
              </div>
              <!-- /.panel-body -->
            </div>
        </div>
      </div> 
    </div>
    
    <div class="modal fade" id="approveGuarrantor" role="dialog" style="border-radius: 5px;" ref="modal">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
         <div v-if="memberIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div v-if="memberError">
          <div class="error-div">
            <span>
              {{ memberError.message }}
            </span>
          </div>
        </div>
       
        <div class="modal-content" v-show="loanRequest.member && guarantor_name">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" @click="switchOffCamera()">&times;</button>
            <h4 class="modal-title" v-if="loanRequest.member && guarantor_name">
              Approve {{guarantor_name}} as Guarrantor for {{loanRequest.member.name}}
            </h4>
          </div>
          
          <div class="modal-body padtrbl">
            <div v-if="loanRequestError">
              <div class="error-div">
                <span>
                  {{loanRequestError.message}}
                </span>
              </div>
            </div>
            <div class="container" :style="{width: '100%;'}">
              <PhotoCapture :onOrOff="onOnOffCamera" :savePicture="savePicture" :snapshotSize="{width:160, height:160}"/> 
              <div class="text-center modal-footer">
                <input type="submit" value="Save" class="btn btn-primary btn-sm" @click="acceptGuarantorRequest()">
                <button type="button" class="btn btn-warning btn-sm" @click="switchOffCamera()" data-dismiss="modal">Cancel</button>
              </div>         
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <div class="modal fade" id="rejectGuarrantor" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
         <!--Modal content no 1-->
         <div v-if="memberIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div v-if="memberError">
          <div class="error-div">
            <span>
              {{ memberError.message }}
            </span>
          </div>
        </div>
       
        <div class="modal-content" v-show="loanRequest.member && guarantor_name">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" @click="switchOffCamera()">&times;</button>
            <h4 class="modal-title" v-if="loanRequest.member && guarantor_name">
              Reject {{guarantor_name}} as Guarrantor for {{loanRequest.member.name}}
            </h4>
          </div>
          
          <div class="modal-body padtrbl">
            <div v-if="loanRequestError">
              <div class="error-div">
                <span>
                  {{loanRequestError.message}}
                </span>
              </div>
            </div>
            <div class="container" :style="{width: '100%;'}">
              <div class="text-center mb-20"  v-if="loanRequest.member && guarantor_name">
                <h4>Are you sure of rejecting {{ guarantor_name }} as guarantor for {{ loanRequest.member.name }}</h4>
              </div>
              <div class="text-center modal-footer">
                <button type="button" class="btn btn-warning btn-sm" @click="rejectGuarantorRequest()">Yes</button>
                <button type="button" class="btn btn-primary btn-sm" data-dismiss="modal">No</button>
              </div>         
            </div>
          </div>
          
        </div>
      </div>
    </div> 
  </div>
</template>

<script>

import HeaderNav from '@/components/includes/headerNav';
import PhotoCapture from "@/components/includes/PhotoCapture";
import { toggleAvatarDropDown, closeNavbar, openModal, closeModal } from '../../../assets/js/helpers/utility';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import $ from 'jquery'
import Validator from 'validatorjs'
import {turnArrayToObject} from '../../../utility'

const form =  {
  response: 'accepted',
  member_id: '',
  loan_request_id: '',
  guarantor_img: '',
}

const rejectGuarrantorForm = {
  response: 'rejected',
  loan_request_id: '',
  member_id: ''
}
export default {
  name: 'MemberLoanGuarantors',
  components: {
    HeaderNav,
    PageHeader,
    PhotoCapture
  },

  data(){
    return{
      loanRequest:{
        member:null, 
        guarantors:[], 
        societyName:'',
      },
      fetchManyMemberError:null,
      pageTitle: 'Members Loan Guarantor Lists',
      previousPage: 'Dashboard',
      onOnOffCamera:false,
      guarantor_name:"",
      guarantor_img: "",
      successMsg: ""
    }
  },
  methods: {
    ...mapActions("app/member", ["fetchManyMember", "getOneMember"]),
    ...mapActions("app/society", ["getOneSociety"]),
    ...mapActions("app/loan", ["getOneLoan", "getGuarantorForAdmin", "adminRespondToGuarantorRequest"]),

    ...mapMutations('app/loan', {setLoanRequestError:"setError"}),

    setRejectGuarantorMemberID(member_id){
      //console.log(member_id)
      rejectGuarrantorForm.member_id = member_id
    },

    showModal(){
      let element = this.$refs.modal.$el
      openModal(element);
    },

    hideModal(){
      let element = this.$refs.modal.$el
      closeModal(element)
    },

    adminRespondToGuarantorRequestHelper(form){
      this.adminRespondToGuarantorRequest(form)
      .then(data => {
        console.log(data)
        if(data){
          this.getOneMember(data.member_id)
          .then(member => {
            let name = "Unknown"
            if (member){
              name = member.name
            }
            this.successMsg = `${ name } has been ${ form.response } successfully`
            this.hideModal()

            this.$data.loanRequest.guarantors = this.$data.loanRequest.guarantors.map(
              g=>{
                if(g.id.toString() === data.id.toString()){
                  g.status = data.status
                }//end if(g.id.toString() === data.id.toString())
                return g
              }//end anonymous function
            );
            
          })  
        }
        //remove previous snapshot, in preparation for next guarantor
        form.guarantor_img = ''
      })
    },

    switchOffCamera(){
      this.$data.onOnOffCamera = false
    },

    switchOnCamera(member_id){
      return this.getOneMember(member_id)
      .then(member=>{
        //if member
        if(member){
          this.$data.guarantor_name = member.name
          this.$data.onOnOffCamera = true
          form.member_id = member_id
        }//end if(member)
        else{
          this.$data.guarantor_name = ""
        }
      })
    },
    savePicture(snapshotURL){
      form.guarantor_img  = snapshotURL
    },

    acceptGuarantorRequest(){
      console.log(form)
      this.setLoanRequestError(null)
      let validation = new Validator(form, {
        response: 'required',
        loan_request_id: 'required|numeric',
        member_id: 'required|numeric',
        guarantor_img: 'required'
      })

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors
        this.setLoanRequestError(error)
      } else {
        this.adminRespondToGuarantorRequestHelper(form)
      }

    },

    rejectGuarantorRequest(){
      this.setLoanRequestError(null)
      let validation = new Validator(rejectGuarrantorForm, {
        response: 'required',
        loan_request_id: 'required|numeric',
        member_id: 'required|numeric'
      })

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors;
        this.setLoanRequestError(error)
      } else {
        this.adminRespondToGuarantorRequestHelper(rejectGuarrantorForm)
      }
    }
  },
  computed: {
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/loan", {loanRequestError:"error", loanRequestIsLoading:"isLoading"}),
  },
  created(){
    const loan_request_id = this.$route.params.loan_request_id
    
    Promise.all([
      this.getOneLoan(loan_request_id),
      this.getGuarantorForAdmin({loanRequestID:loan_request_id})
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
          //this.fetchMemberTotalAsset({member_id:loanRequest.member_id, society_id:loanRequest.society_id})
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
                  member_id:g.member_id,
                  guarantor_img:g.guarantor_img
                } : {
                  name : "Unknown",
                  id:index,
                  status:"Unknown",
                  member_id:index,
                }//end object
              }),//end map
              societyName:society.name,
            }//end set loanRequest
            
          }//end noError
        })
        .catch(e=>this.fetchManyMemberError=e)
      }
    })// end then method
  },
  mounted(){
    toggleAvatarDropDown()
    closeNavbar(),
    form.loan_request_id = this.$route.params.loan_request_id
    rejectGuarrantorForm.loan_request_id = this.$route.params.loan_request_id
  },
  updated(){
    console.log(this.loanRequestError)
  }
}
</script>
