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
        <form @submit.prevent="authenticate()" class="col s12">
          <div class="container">
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
                      type="password" 
                      v-model="form.old_psd" 
                      id="old_password" 
                      autofocus
                      >
                      <label for="old password">Old Password</label>
                      <span class="error" id="old_password-error" v-if="elementHasError('old_psd')">{{ error.errors.old_psd[0] }}</span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <input 
                      type="password" 
                      id="new_password"
                      v-model="form.new_psd"
                      >
                      <label for="new password">New Password</label>
                      <span class="error" id="new_password-error" v-if="elementHasError('new_psd')">{{ error.errors.new_psd[0] }}</span>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="input-field col s12">
                      <input 
                      type="password" 
                      id="cfm_new_password"
                      v-model="form.cfm_psd"
                      >
                      <label for="confirm new password">Confirm New Password</label>
                      <span class="error" id="cfm_new_password-error" v-if="elementHasError('cfm_psd')">{{ error.errors.cfm_psd[0] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <input 
              type="submit" 
              value="Save Password"
              class="btn-general" 
              name="changePassword"
              :disabled="isLoading"
              >
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
import {closeNavbar, toggleAvatarDropDown} from "../../assets/js/helpers/utility";
import Validator from 'validatorjs'
import { mapActions , mapGetters, mapMutations } from 'vuex'

export default {
  name: 'changePassword',
  components: {
    HeaderNav,
    PageHeader
  },
  data(){
     return{
      form: {
        old_psd: '',
        new_psd: '',
        cfm_psd: '',
      },
      pageTitle: 'Change Password',
      previousPage: 'Dashboard',
      notificationMessage: null,
      successMsg: '',
    } 
  },
  methods: {
    ...mapActions("app/auth", ["changePassword"]),
    ...mapMutations("app/auth", ["setError"]),

    authenticate(){
      this.setError(null);
      
      let validation = new Validator(this.form, {
        old_psd: 'required',
        new_psd: 'required|min:6',
        cfm_psd: 'required|min:6',
      });

      if(validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        if(this.form.new_psd != this.form.cfm_psd){
          const error = new Error("Password does not match")
          error.errors = validation.errors.errors;
          this.setError(error)
        } else {
          this.changePassword(this.$data.form)
          .then(message => {
            this.successMsg = message
            this.form = {};
          })
        }
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
  computed: {
    ...mapGetters("app/auth", ["isLoading", "error"])
  },
  mounted(){
		closeNavbar(); 
		toggleAvatarDropDown();
	}
}
</script>
