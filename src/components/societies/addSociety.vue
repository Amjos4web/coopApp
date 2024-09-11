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
          <form @submit.prevent="saveSociety()" class="col-12">
            <div class="box">
              <div v-if="isLoading">
                <div class="text-center">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                </div>
              </div>

              <div class="row">
                <div class="form-group col-12">
                  <label for="Society Name">Soceity Name</label>
                  <input 
                    type="text" 
                    v-model="form.name"
                    class="form-control"
                    autofocus
                  >
                  
                  <span class="error" v-if="elementHasError('name')">
                    {{ error.errors.name[0] }}
                  </span>
                </div>
              
                <div class="form-group col-12">
                  <label for="notes">Notes</label>
                  <textarea 
                  id="textarea1" 
                  class="form-control" 
                  v-model="form.notes"
                  >
                  </textarea>
                  
                  <span class="error" v-if="elementHasError('notes')">
                    {{ error.errors.notes[0] }}
                  </span>
                </div>

                <div class="form-group col-12">
                  <label for="active">Make active</label>
                  <select v-model="form.active" class="form-control">
                    <option value="">Select an Option</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <span class="error" v-if="elementHasError('active')">
                    {{ error.errors.active[0] }}
                  </span>
                </div>
              </div>
              <div class="text-center mt-20">
                <input type="submit" value="Save" class="btn btn-primary">
              </div>
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

export default {
  name: 'addSociety',
  components: {
    HeaderNav,
    FooterBar,
  },
  data(){
    return{
      form: {
        name: '',
        notes: '',
        active: '',
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
        notes: 'required|max:200',
        active: 'required|max:1',
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.addNewSociety(this.$data.form)
        .then(message => {
          if (message){
            this.$toasted.show(`${message.name} added successfully`, { 
              type: "success", 
              icon: 'check-circle'
            })
            this.$data.form = {}
          }
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
  }
}
</script>
