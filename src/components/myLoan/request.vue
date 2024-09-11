<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="getMembersFromSocietyIsLoading || getMembersIsLoading || getSocietyIsLoading || loanIsLoading">
          <div class="text-center mb-20">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
          </div>
        </div>
        <div class="container" v-else>
          <div v-if="successMsg">
              <div class="text-center success-div">
                <span>
                  {{ successMsg }}
                </span>
              </div>
            </div>
            <div v-if="loanError">
              <div class="text-center error-div">
                <span>
                  {{ loanError.message }}
                </span>
              </div>
            </div>
          <Notification :notificationMessage="notificationMessage"/>
          
          <div class="box">
            <div class="row">
              <form action="" method="get" class="col s12" id="loanRequest">
              <div class="row">
              <form @submit.prevent="saveLoanRequestEventHandler()">
              <div class="row">
                <div class="form-group col s12">
                  <label>Select Society</label>
                    <select class="form-control" @change="getMembersInSociety($event)" v-model="form.society_id">
                      <option value="">Select Society</option>
                      <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  <span class="error" v-if="elementHasError('society_id')">
                    {{ loanError.errors.society_id[0] }}
                  </span>
                </div>
              </div>
             
              <div class="row">
                <div class="input-field col s12">
                  <input type="number" v-model="form.amount_requested" autofocus>
                  <label for="amount">Amount to borrow</label>
                  <span class="error" v-if="elementHasError('amount_requested')">
                    {{ loanError.errors.amount_requested[0] }}
                  </span>
                </div>
              </div>
              
              <div class="row">
                <div class="input-field col s12">
                  <textarea id="textarea1" class="materialize-textarea" v-model="form.purpose"></textarea>
                  <label for="purpose">Purpose of Request</label>
                  <span class="error" v-if="elementHasError('purpose')">
                    {{ loanError.errors.purpose[0] }}
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col s12 text-center">
                  <button class="btn-general" data-target="#addGuarantors" data-toggle="modal" type="button" :disabled="form.member_id == ''"><i class="fa fa-user"></i>&nbsp;Select Guarantors</button>
                  <span class="" id="listOfGuarantors"></span>
                  <input type="hidden" name="listOfGuarantors" value="">
                </div>
                <span class="error" v-if="elementHasError('guarantor_ids')">
                  {{ loanError.errors.guarantor_ids[0] }}
                </span>
              </div>

              <div class="list-of-gurantors mb-20">

                <button v-for="selMemItem in selectedMemberList" type="button" class="btn btn-default btn-sm cursor-default" :key="selMemItem.id">
                  {{selMemItem.name}} <i class="fa fa-times cursor-pointer" :style="{color: 'red'}" @click="toggleSelectedMember(selMemItem.id)"></i>
                </button>

              </div>
              
                <div class="text-center">
                  <input type="submit" value="Request Loan" class="btn-general">
                </div>
              </form>
            </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

      
    <div class="modal fade" id="addGuarantors" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Select Guarantors</h4>
            </div>
            <div class="modal-body padtrbl">
              <form @submit.prevent="searchMember()">
                <div class="row">
                  <div class="input-field col-md-6 col-md-offset-3">
                    <input type="text" v-model="searchMeta">
                    <label for="Society Name">Search member</label>
                    <span class="error"></span>
                  </div>
                </div>
                <div class="text-center">
                  <input type="submit" value="Search" class="btn btn-primary">
                </div>
              </form><br>
              
              <div class = "row" v-for="m in searchMemberResult" :key="m.id">
                <div class="col-md-8">
                  <h5>{{m.name}}</h5>
                </div>
                <div class="col-md-4" style="margin-top: 5px; text-align: right;">
                  <p>
                    <label class="switch"><input type="checkbox" @click="toggleSelectedMember(m.id)">
                      <span class="slider round"></span>
                    </label>
                  </p>
                </div>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Continue</button>
                
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Notification from '@/components/includes/PageNotification'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Validator from 'validatorjs'
//store member object with member id as key and member as value
//it'll be needed to display the name of guarantor later
let membersObj = {}

const initForm = {
  society_id: '',
  amount_requested: '',
  purpose: '',
  guarantor_ids: [],
}

export default {
  name: 'request',
  components: {
    HeaderNav,
    PageHeader,
    Notification
  },
  data() {
    return{
      pageTitle: 'Loan Request',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where you request for loan. Kindly fill the form below',
      societies: [],
      searchMemberResult:[],
      members:[],
      fetchManyMemberError:null,
      successMsg: '',
      form: initForm,
      searchMeta: '',
    } 
  },
  methods: {
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapActions("app/society_member", ["fetchMemberInSociety", "fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/loan", ["saveLoanRequestFromMember"]),
    ...mapMutations("app/loan", ["setError"]),
   
    saveLoanRequestEventHandler(){
      this.setError(null)

      //console.log(this.$data.form)

      let validation = new Validator(this.$data.form, {
        society_id: 'required|numeric',
        amount_requested: 'required|numeric',
        purpose: 'required|max:500',
      })

      let hasError = false

      const error = new Error('You have error in your data, make neccessary change(s) and submit again')

      if (validation.fails()){
        error.errors = validation.errors.errors;
        //console.log(error.errors)
        //this.setError(error)
        hasError = true
      } 
      
      if (this.$data.form.guarantor_ids.length < 4){
        if(hasError){
          error.errors.guarantor_ids = ['You need atleast four(4) guarantors to request for loan.']
        }//end if(hasError)
        else{
          error.errors = {guarantor_ids: ['You need atleast four(4) guarantors to request for loan.']}
          hasError = true
        }//end else
      }// end if(this.$data.form.guarantor_ids.length < 4)
      
      if(hasError){
        this.setError(error)
      }else{
        this.saveLoanRequestFromMember(this.$data.form)
        .then(data => {
          console.log(data)
          if(data){
            this.$data.successMsg = 'Loan request is successful'
          }
        })
      }
    },

    elementHasError(elemID){
      return ((
        this.loanError 
        && this.loanError.errors 
        && this.loanError.errors[elemID] 
        && this.loanError.errors[elemID].length > 0
      ))
    },

    getMembersInSociety(event){
      this.$data.form = {...initForm, society_id:this.$data.form.society_id}

      this.$data.searchMeta = ''
      
      this.$data.searchMemberResult = []

      const society_id = event.target.value

      this.fetchMemberInSociety({society_id})
      .then(data => {
        if (data){
          // get all member ids to fetch their names from members table
          const memberIDs = data.societyMembers.map(sm=>sm.member_id)
          // get members name using their IDs
          this.fetchManyMember(memberIDs)
          .then(data => {
            if(data){
              this.$data.members = data.members.map(m=>({name:m.name, id:m.id}))
              //turn member array to object, it'll be needed to display the name of
              //the selected member as guarantor
              for(let i = 0; i < this.$data.members.length; i++){
                const m = this.$data.members[i]
                membersObj[m.id] = m
              }
            }//end if
          })
          .catch(e=>this.$data.fetchManyMemberError=e)
          
        }
      })
    },

    searchMember(){
      const searchValue = this.$data.searchMeta.toLocaleLowerCase()
      this.$data.searchMemberResult = this.$data.members.filter(
        m=>(
          (m.name.toLocaleLowerCase().indexOf(searchValue) > -1) 
          && (m.id != this.$data.form.member_id)
        )
      )
    },

    toggleSelectedMember(id){
      const clone = [].concat(this.$data.form.guarantor_ids);

      const index = clone.indexOf(id)

      if (index > -1){
        clone.splice(index, 1)  
      } else {
        clone.push(id)
        
      }
      this.$data.form.guarantor_ids = clone
    }
  },
  computed: {
    ...mapGetters("app/member", {getMembersIsLoading:'isLoading', getMembersError:'error'}),
    ...mapGetters("app/society_member", {getMembersFromSocietyIsLoading:'isLoading', getMembersFromSocietyError:'error'}),
    ...mapGetters("app/society", {getSocietyIsLoading:'isLoading', getSocietyError:'error'}),
    ...mapGetters("app/loan", {loanError:"error", loanIsLoading:"isLoading"}),

    //every time a new guarantor is added or removed, this computed method will execute
    //it'll list the members selected as guarantor
    selectedMemberList(){
      return this.$data.form.guarantor_ids.map(id=>{
        const m = membersObj[id]
        return m ? {id, name:m.name} : {id, name:"Unknown"}
      })
    },

    selectedMemberName(){
      return membersObj[this.$data.form.member_id] ? membersObj[this.$data.form.member_id].name : "Unknown"
    }
  },

  created(){
   this.fetchAllSocietyToWhichIBelongs()
    .then(result => {
      if(result){
        const society_ids = result.societyMembers.map(sm=>sm.society_id)
        this.fetchManySociety(society_ids)
        .then(data => {
          console.log(data)
          if (data){
            this.$data.societies = data.societies
            console.log(this.$data.societies)
          } // end if (data)
        })// end then method
      } // end if(result.every(r=>!!r))
    })
  },
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>