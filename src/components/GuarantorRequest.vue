<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="societyError">
          <div class="error-div text-center">
            <span>
              {{ societyError.message }}
            </span>
          </div>
        </div>
        <div v-if="memberError">
          <div class="error-div text-center">
            <span>
              {{ memberError.message }}
            </span>
          </div>
        </div>
        <div v-if="loanRequestError">
          <div class="error-div text-center">
            <span>
              {{ loanRequestError.message }}
            </span>
          </div>
        </div>

        <div v-if="smError">
          <div class="error-div text-center">
            <span>
              {{ smError.message }}
            </span>
          </div>
        </div>
        
        <div class="container">
          <div class="filter-result mb-20">
            <RefreshOnly :reloadIndexData="reloadIndexData"/>
            <div class="row">
              <div class="col-md-8 m-auto">
                <div class="form-group">
                  <label>Filter by Loan Status</label>
                  <select class="form-control" @change="filterGuarantorsEventHandler($event)">
                    <option value="">Choose an Option</option>
                    <option value="accepted">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
         
          <div v-if="successMsg">
            <div class="success-div text-center">
              <span>{{ successMsg }}</span>
            </div>
          </div>
          <form>
            <div class="card">
              <div class="card-body">
                <h5 class="card-title"><i class="fa fa-users"></i> List of member(s) that want you as guarantor</h5>
                <div class="row">
                  <div class="table-responsive">
                    <table class="styled-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Accept</th>
                          <th>Reject</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody v-if="loanRequestIsLoading || memberIsLoading || societyIsLoading || smIsLoading">
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
                        <tr v-for="g in guarantors" :key="g.id">
                          <td>{{ g.name }}</td>
                          <!-- <td>{{ loanRequest.societyName }}</td> -->
                          <td>
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#approveGuarantor" data-backdrop="static" data-keyboard="false" @click="switchOnCamera(g.member_id, g.name, g.loan_request_id)" :disabled="g.status == 'accepted'">Approve</button>
                          </td>
                          <td>
                            <button type="button" class="btn btn-danger" data-target="#rejectGuarrantor" data-toggle="modal" data-backdrop="static" data-keyboard="false" :disabled="g.status == 'rejected'" @click="rejectGuarantor(g.name, g.loan_request_id)">Reject</button>
                          </td>
                          <td>{{ g.status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> 
                <!-- <vuetable :fields="columns"></vuetable> -->
              </div>
              <!-- /.panel-body -->
            </div>
          </form>
        </div>
      </div> 

      <FooterBar />

      <div class="modal fade" id="approveGuarantor" role="dialog" style="border-radius: 5px;">
        <div class="modal-dialog modal-lg">
          <!-- Modal content no 1-->
          <div v-if="memberIsLoading">
            <div class="text-center" :style="{width: '100%'}">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
            </div>
          </div>
          <div v-if="memberError">
            <div class="error-div text-center">
              <span>
                {{ memberError.message }}
              </span>
            </div>
          </div>
        
          <div class="modal-content" v-show="guarantors">
            <div class="modal-header">
              <h5 class="modal-title" v-if="guarantors && guarantor_name">
                Approving {{guarantor_name}} as Guarrantor for {{loanRequesterName}}
              </h5>
              <button type="button" class="close" data-dismiss="modal" @click="switchOffCamera()">&times;</button>
            </div>
            
            <div class="modal-body">
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
        
          <div class="modal-content" v-show="loanRequesterName">
            <div class="modal-header">
              <h5 class="modal-title" v-if="loanRequesterName">
                Reject {{loanRequesterName}} Loan Guarrantor Request
              </h5>
              <button type="button" class="close" data-dismiss="modal" @click="switchOffCamera()">&times;</button>
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
                <div class="text-center mb-20"  v-if="loanRequesterName">
                  <h4>Are you sure of rejecting {{ loanRequesterName }} loan guarantor request</h4>
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
import FooterBar from '@/components/includes/Footer'
import RefreshOnly from '@/components/includes/RefreshOnly'
import PhotoCapture from "@/components/includes/PhotoCapture";
import Validator from 'validatorjs'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from '../utility'

const form =  {
  response: 'accepted',
  loan_request_id: '',
  guarantor_img: '',
}

const rejectGuarrantorForm = {
  response: 'rejected',
  loan_request_id: '',
}

export default {
  name: 'GuarantorRequest',
  components: {
    HeaderNav,
    FooterBar,
    PhotoCapture,
    RefreshOnly
  },
  data() {
    return{
      guarantors: [],
      member: null,
      pageTitle: 'Guarantor Request',
      previousPage: 'Dashboard',
      notificationMessage: '',
      onOnOffCamera:false,
      guarantor_name:"",
      loanRequesterName: "",
      loanRequestID: "",
      successMsg: "",
      
    } 
  },
  methods: {
    ...mapActions("app/member", ["getOneMember", "fetchManyMember"]),
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapActions("app/loan", ["getOneLoan", "getAllMyLoanGuarantorRequest", "memberRespondToGuarantorRequest"]),
    ...mapActions("app/society_member", ["getSocietiesToWhichManyMemberBelongsByID"]),

    ...mapMutations('app/loan', {setLoanRequestError:"setError"}),

    memberRespondToLoanGuarrantorRequestHelper(form){
      this.memberRespondToGuarantorRequest(form)
      .then(data => {
        if (data){
          this.successMsg = `You have successfully ${ form.response } this guarantor loan request`
          this.$data.guarantors = this.$data.guarantors.map(
            g=>{
              if(g.loan_request_id.toString() === data.loan_request_id.toString()){
                g.status = data.status
              }//end if(g.id.toString() === data.id.toString())
              return g
            }//end anonymous function
          );
        }
        
        //remove previous snapshot, in preparation for next guarantor
        form.guarantor_img = ''
      })
    },

    switchOffCamera(){
      this.$data.onOnOffCamera = false
    },

    switchOnCamera(member_id, loanRequesterName, loanRequestID){
      return this.getOneMember(member_id)
      .then(data =>{
        //if member
        if(data){
          this.$data.guarantor_name = data.name
          this.$data.loanRequesterName = loanRequesterName
          form.loan_request_id = loanRequestID
          rejectGuarrantorForm.loan_request_id = loanRequestID
          this.$data.onOnOffCamera = true
        }//end if(member)
        else{
          this.$data.guarantor_name = ""
          form.loan_request_id = ""
          rejectGuarrantorForm.loan_request_id = ""
        }
      })
    },

    rejectGuarantor(loanRequesterName, loan_request_id){
      this.$data.loanRequesterName = loanRequesterName 
      rejectGuarrantorForm.loan_request_id = loan_request_id
    },

    savePicture(snapshotURL){
      form.guarantor_img  = snapshotURL
    },

    acceptGuarantorRequest(){
      this.setLoanRequestError(null)
      let validation = new Validator(form, {
        response: 'required',
        loan_request_id: 'required|numeric',
        guarantor_img: 'required'
      })

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors
        this.setLoanRequestError(error)
      } else {
        this.memberRespondToLoanGuarrantorRequestHelper(form)
      }
    },

    rejectGuarantorRequest(){
      this.setLoanRequestError(null)
      let validation = new Validator(rejectGuarrantorForm, {
        response: 'required',
        loan_request_id: 'required|numeric',
      })

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors;
        this.setLoanRequestError(error)
      } else {
        this.memberRespondToLoanGuarrantorRequestHelper(rejectGuarrantorForm)
      }
    },

    filterGuarantorsEventHandler(event){
      const search_meta = event.target.value
      this.$data.guarantors = this.$data.guarantors.filter(
        g=>(
          (g.status.toLocaleLowerCase().indexOf(search_meta) > -1)
        )
      )
      this.$data.successMsg = ''
    },

    reloadIndexData(){
     
    }
  },

  created(){
    let noError = null
    this.getAllMyLoanGuarantorRequest()
    .then(data => {
      if (data) {
        const loanRequesterIDs = data.guarantors.map(g=>g.loan_request_member_id)

        Promise.all([
          //this.getSocietiesToWhichManyMemberBelongsByID(loanRequesterIDs),
          this.fetchManyMember(loanRequesterIDs),
        ])
        .then(result => {
          //ensure we have all neccessary data
          noError = result.every(r=>!!r)

          if(noError){
            const memberObj = turnArrayToObject(result[0].members)

            this.$data.guarantors = data.guarantors.map((g, index)=>{
              const m = memberObj[g.loan_request_member_id]

              return m ? {
                name:m.name,
                id:g.id,
                status:g.status,
                loan_request_id:g.loan_request_id,
                member_id:g.member_id
              } : {
                name : "Unknown",
                id:index,
                status:"Unknown",
                loan_request_id:index,
                member_id:index
              }//end object
            })
          }
        })
      } 
    })
  },

  computed: {
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/loan", {loanRequestError:"error", loanRequestIsLoading:"isLoading"}),
    ...mapGetters("app/society_member", {smIsLoading:"isLoading", smError:"error"})
  }
}
</script>
