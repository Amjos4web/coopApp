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
          <div class="error-div text-center">
            <span>
              {{societyLoanError.message}}
            </span>
          </div>
        </div>
        <div v-if="societyError">
          <div class="error-div text-center">
            <span>
              {{societyError.message}}
            </span>
          </div>
        </div>
        <div class="container">
          <div v-if="successMsg">
            <div class="text-center success-div">
              <span>
                {{ successMsg }}
              </span>
            </div>
          </div>
          <!-- <Notification :notificationMessage="notificationMessage"/> -->
            <div class="box">
              <div class="row">
                <div class="col-12">
                  <form @submit.prevent="saveLoanRequestEventHandler()">
                  <div class="row">
                    <div class="form-group col-12">
                    <label>Select Society</label>
                      <select class="form-control" v-model="form.society_id">
                        <option value="">Select Society</option>
                        <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                      </select>
                      <span class="error" v-if="elementHasError('society_id')">
                        {{ societyLoanError.errors.purpose[0] }}
                      </span>
                  </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-12">
                      <label for="amount">Amount Requested</label>
                      <input type="number" v-model="form.amount_requested" class="form-control">
                        <span class="error" v-if="elementHasError('amount_requested')">
                        {{ societyLoanError.errors.amount_requested[0] }}
                      </span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col-12">
                      <label for="amount">Amount Given</label>
                      <input type="number" v-model="form.amount_given" class="form-control">
                        <span class="error" v-if="elementHasError('amount_given')">
                        {{ societyLoanError.errors.amount_given[0] }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="form-group col-12">
                      <label for="purpose">Purpose of Request</label>
                      <textarea id="textarea" class="form-control" v-model="form.purpose"></textarea>
                      <span class="error" v-if="elementHasError('purpose')">
                        {{ societyLoanError.errors.purpose[0] }}
                      </span>
                    </div>
                  </div>
                 <div class="text-center">
                  <input type="submit" value="Request Loan" class="btn btn-info">
                </div>
                </form>
                </div>
                
              </div>
            </div>
        </div>
      </div>
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
// import Notification from '@/components/includes/PageNotification'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

const loanForm = {
  society_id: '',
  amount_requested: '',
  amount_given: '',
  purpose: ''
}

export default {
  name: 'LoanRequest',
  components: {
    HeaderNav,
    FooterBar,
    // Notification
  },
  data(){
    return{
      form: loanForm,
      pageTitle: 'Loan Request',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where you request for loan. Kindly fill the form below',
      societies: [],
      successMsg: '',
    } 
  },
  methods: {
    ...mapActions("app/society_loan", ["saveLoanRequestFromAdmin"]),
    ...mapActions("app/society", ["getSocieties"]),
    ...mapMutations("app/society_loan", ["setError"]),

    saveLoanRequestEventHandler(){
      this.setError(null)

      let validation = new Validator(this.$data.form, {
        society_id: 'required|numeric',
        amount_requested: 'required|numeric',
        purpose: 'required|max:500',
        amount_given: 'required|numeric'
      })

      if (validation.fails()){
        const error = new Error('You have error in your data, make neccessary change(s) and submit again')
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.saveLoanRequestFromAdmin(this.$data.form)
        .then(data => {
          if (data){
            this.$toasted.show('Loan request successful', { 
              type: "success", 
              icon: 'check-circle'
            })
            this.$data.form = loanForm
          }
        })
      } 
    },

    elementHasError(elemID){
      return ((
        this.loanError 
        && this.societyLoanError.errors 
        && this.societyLoanError.errors[elemID] 
        && this.societyLoanError.errors[elemID].length > 0
      ))
    },
  },

  computed: {
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/society_loan", {societyLoanError:"error", societyLoanIsLoading:"isLoading"})
  },

  created(){
    this.getSocieties()
    .then(data => {
      if (data){
        this.$data.societies = data.societies
      }
    })
  }
}
</script>