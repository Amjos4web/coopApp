<template>
  <div class="modal fade" id="viewSociety" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit {{ society.name }}'s Data</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body padtrbl">
          <div v-if="error"> 
            <div class="text-center error-div">
              <span>
                {{ error.message }}
              </span>
            </div>
          </div>
          <div v-if="isLoading">
            <div class="text-center">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

export default {
  name: 'edit-society-modal',
  props: ["society", "updateSocietyOnParent"],
  data:function(){
    return { 
      form:{
        name:this.$props.society.name,
        notes:this.$props.society.notes,
        active:this.$props.society.active
      },//end form 
    }//end object
  },
  methods: {
    ...mapActions("app/society", ["updateSociety"]),
    ...mapMutations("app/society", ["setError"]),
    saveSociety(){
      this.setError(null);
      let validation = new Validator(this.$data.form, {
        name: 'required|max:200',
        notes: 'required|max:200',
        active: 'required|max:1'
      }) 

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        const id = this.$props.society.id;
        //this is update since parent sent ID
        if(id){
          this.updateSociety({id, formData : this.$data.form})
          .then(society => {
            // check if society is not null
            if (society){
              this.$props.updateSocietyOnParent(society)
            } //end if
          })//end then method
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
    ...mapGetters("app/society", ["error", "isLoading"])
  },
  watch: {
    society(newSociety, oldSociety){
      this.$data.form = {name:newSociety.name, notes:newSociety.notes, active:newSociety.active}
    }
  }
}
</script>