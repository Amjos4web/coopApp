<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="error"> 
          <div class="text-center error-div">
            <span>
              {{ error.message }}
            </span>
          </div>
        </div>
        <div v-else-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div class="container">
          <form @submit.prevent="saveConfig()" class="col-12">
            <div class="box">
              <div v-if="isLoading">
                <div class="text-center">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                </div>
              </div>
                <div class="row">
                  <div class="form-group col-12">
                    <label for="Society Name">Union Name</label>
                    <input 
                    type="text"
                    v-model="form.union_name" 
                    class="form-control"
                    autofocus
                    >
                    
                    <span class="error" v-if="elementHasError('union_name')">
                      {{ error.errors.union_name[0] }}
                    </span>
                  </div>
                </div>
                
                <div class="row">
                  <div class="form-group col-12">
                    <label for="interest rate">Interest Rate</label>
                    <input 
                    type="text" 
                    v-model="form.interest_rate"
                    class="form-control"
                    autofocus
                    >
                    
                    <span class="error" v-if="elementHasError('interest_rate')">
                      {{ error.errors.interest_rate[0] }}
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-12">
                    <label for="interest rate">Society Interest Rate</label>
                    <input 
                    type="text" 
                    v-model="form.society_interest_rate"
                    class="form-control"
                    autofocus
                    >
                    
                    <span class="error" v-if="elementHasError('society_interest_rate')">
                      {{ error.errors.society_interest_rate[0] }}
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-12">
                    <label for="loan duration">Loan Duration</label>
                    <input 
                    type="number" 
                    v-model="form.loan_duration"
                    class="form-control"
                    autofocus
                    >
                    
                    <span class="error" v-if="elementHasError('loan_duration')">
                      {{ error.errors.loan_duration[0] }}
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-12">
                    <label for="loan duration">Society Loan Duration</label>
                    <input 
                    type="number" 
                    v-model="form.society_loan_duration"
                    class="form-control"
                    autofocus
                    >
                    
                    <span class="error" v-if="elementHasError('society_loan_duration')">
                      {{ error.errors.society_loan_duration[0] }}
                    </span>
                  </div>
                </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Save" class="btn btn-primary">
            </div>
          </form>
        </div>
      </div>
      <FooterBar/>
    </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'
import event, {EVENT_TYPE} from "../../utility/event"

export default {
  name: 'config-component',
  components: {
    HeaderNav,
    FooterBar
  },
  data(){
    return{
      form: {
        union_name: '',
        loan_duration: '',
        interest_rate: '',
        society_interest_rate: '',
      },
      pageTitle: 'Configurations',
      previousPage: 'Dashboard',
      notificationMessage: null,
      successMsg: '',
    } 
  },
  methods: {
    ...mapActions("app/setting", ["getSetting", "saveSetting"]),
    ...mapMutations("app/setting", ["setError"]),
    saveConfig(){
      this.setError(null);

      let validation  = new Validator(this.$data.form, {
        union_name: 'required',
        interest_rate: 'required|numeric',
        loan_duration: 'required|numeric',
        society_interest_rate: 'required|numeric',
      });
      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.saveSetting(this.$data.form)
        .then(data => {
          this.$toasted.show(`Configuration set successfully`, { 
            type: "success", 
            icon: 'check-circle'
          })
        })  
      }
    },
    elementHasError(elemID){
      return ((
        this.error 
        && this.error.errors 
        && this.error.errors[elemID] 
        && this.error.errors[elemID].length > 0
      ) ? true : false)
    }
  },

  beforeDestroy(){
    event.removeHandler(EVENT_TYPE.DONE_FETCHING_SETTING)
  },
  created(){
    event.on(EVENT_TYPE.DONE_FETCHING_SETTING, ()=>{
      this.getSetting()
      .then(data => {
        // check if data is not null
        if (data){
          // set the data values into form data 
          this.$data.form = {union_name:data.setting.union_name, loan_duration:data.setting.loan_duration,society_loan_duration:data.setting.society_loan_duration, interest_rate:data.setting.interest_rate, society_interest_rate:data.setting.society_interest_rate}
        }
      })
    })
  },
  computed: {
    ...mapGetters("app/setting", ["isLoading", "error"])
  }
}
</script>
