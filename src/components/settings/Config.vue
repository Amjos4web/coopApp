<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
     <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
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
          <form @submit.prevent="saveConfig()" class="col s12">
            <div class="box">
              <div v-if="isLoading">
                <div class="text-center">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <div class="row">
                    <div class="input-field col s12">
                      <input 
                      type="text"
                      v-model="form.union_name" 
                      autofocus
                      >
                      <label for="Society Name">Union Name</label>
                      <span class="error" v-if="elementHasError('union_name')">
                        {{ error.errors.union_name[0] }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="input-field col s12">
                      <input 
                      type="text" 
                      v-model="form.interest_rate"
                      autofocus
                      >
                      <label for="interest rate">Interest Rate</label>
                      <span class="error" v-if="elementHasError('interest_rate')">
                        {{ error.errors.interest_rate[0] }}
                      </span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <input 
                      type="number" 
                      v-model="form.loan_duration"
                      autofocus
                      >
                      <label for="loan duration">Loan Duration</label>
                      <span class="error" v-if="elementHasError('loan_duration')">
                        {{ error.errors.loan_duration[0] }}
                      </span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            <div class="text-center">
              <input type="submit" value="Save" class="btn-general">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'
import event, {EVENT_TYPE} from "../../utility/event"

export default {
  name: 'Config',
  components: {
    HeaderNav,
    PageHeader
  },
  data(){
    return{
      form: {
        union_name: '',
        loan_duration: '',
        interest_rate: '',
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
      console.log(this.$data.form)
      let validation  = new Validator(this.$data.form, {
        union_name: 'required',
        interest_rate: 'required|numeric',
        loan_duration: 'required|numeric'
      });
      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.saveSetting(this.$data.form)
        .then(data => {
          this.successMsg = 'Data saved successfully'
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
  mounted(){
    toggleAvatarDropDown()
    closeNavbar()
  },
  beforeDestroy(){
    console.log("event handler removed before component is destroyed")
    event.removeHandler(EVENT_TYPE.DONE_FETCHING_SETTING)
  },
  created(){
    event.on(EVENT_TYPE.DONE_FETCHING_SETTING, ()=>{
      this.getSetting()
      .then(data => {
        // check if data is not null
        console.log(data)
        if (data){
          console.log(data.setting);
          // set the data values into form data 
          this.$data.form = {union_name:data.setting.union_name, loan_duration:data.setting.loan_duration, interest_rate:data.setting.interest_rate}
        }
      })
    })
  },
  computed: {
    ...mapGetters("app/setting", ["isLoading", "error"])
  }
}
</script>
