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
          <form @submit.prevent="saveSociety()" class="col s12">
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
                        v-model="form.name"
                        autofocus
                      >
                      <label for="Society Name">Soceity Name</label>
                      <span class="error" v-if="elementHasError('name')">
                        {{ error.errors.name[0] }}
                      </span>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <textarea 
                      id="textarea1" 
                      class="materialize-textarea" 
                      v-model="form.notes"
                      >
                      </textarea>
                      <label for="notes">Notes</label>
                      <span class="error" v-if="elementHasError('notes')">
                        {{ error.errors.notes[0] }}
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
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";

export default {
  name: 'addSociety',
  components: {
    HeaderNav,
    PageHeader,
  },
  data(){
    return{
      form: {
        name: '',
        notes: '',
      },
      pageTitle: 'Create Society',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where societies are being added to the system',
      successMsg: ''
    } 
  },
  methods: {
    ...mapActions("app/society", ["addNewSociety"]),
    ...mapMutations("app/society", ["setError"]),
    
    saveSociety(){
      this.setError(null);

      let validation = new Validator(this.$data.form, {
        name: 'required|max:200',
        notes: 'required|max:200'
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.addNewSociety(this.$data.form)
        .then(message => {
          this.$data.successMsg = 'Society added successfully'
          this.$data.form = {}
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
  computed: {
    ...mapGetters("app/society", ["error", "isLoading"])
  },
  mounted(){
    closeNavbar(),
    toggleAvatarDropDown()
  }
}
</script>
