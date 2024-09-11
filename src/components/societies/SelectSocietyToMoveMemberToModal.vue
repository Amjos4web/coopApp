<template>
  <div class="modal fade" id="selectMembers" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <div v-if="societyIsLoading || smIsLoading">
        <div class="text-center">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
        </div>
      </div>
      <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ modalTitle }}</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-8 m-auto">
                <div v-if="errorDisplay"> 
                  <div class="text-center error-div">
                    <span>
                      {{ errorDisplay }}
                    </span>
                  </div>
                </div>
                <div v-if="societyIsLoading">
                  <div class="text-center">
                    <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                  </div>
                </div>
                <div class="text-center">
                  <span class="error" v-if="societyMemberError">{{societyMemberError.message}}</span>
                  <span class="error" v-if="societyError">{{societyError.message}}</span>
                  <div v-if="smIsLoading || societyIsLoading">
                    <div class="text-center">
                      <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                    </div>
                  </div>
                </div>
                
                <form @submit.prevent="moveMemberEventHandler()">
                  <div class="row">
                    <select class="form-control" v-model="form.new_society_id">
                      <option value="">Choose new society</option>
                      <option v-for="society in societies" :key="society.id" :value="society.id">{{ society.name }}</option>
                    </select>
                    <span class="error" v-if="elementHasError('new_society_id')">
                      {{ error.errors.new_society_id[0] }}
                    </span>
                    <input type="hidden" v-model="form.member_id">
                    <input type="hidden" v-model="form.old_society_id">
                  </div>
                  <div class="text-center mt-10">
                    <input type="submit" value="Move" class="btn btn-primary">
                  </div>
                </form><br>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

const ID  = String | Number
const oldSocietyID = String | Number

export default {
  name: 'select-members-for-society-modal',
  props: {
    modalTitle: String,
    societies: Array,
    errorDisplay: String,
    memberID: ID, 
    oldSocietyID: oldSocietyID,
    updateDataOnParent: Function
  },

  data(){
    return{
      form: {
        member_id: '',
        old_society_id: '',
        new_society_id: '',
      }
    }
  },

  methods: {
    ...mapActions("app/society_member", ["moveMemberToNewSociety"]),
    ...mapMutations("app/society_member", ["setError"]),

    moveMemberEventHandler(){
      this.$data.form = {
        member_id: this.$props.memberID,
        old_society_id: this.$props.oldSocietyID,
        new_society_id: this.$data.form.new_society_id
      }

      this.setError(null)

      let validation = new Validator(this.$data.form, {
        member_id: 'required|numeric',
        old_society_id: 'required|numeric',
        new_society_id: 'required|numeric',
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.moveMemberToNewSociety(this.$data.form)
        .then((data)=>{
          if (data){
            this.$props.updateDataOnParent(data.data.old_society_id)
            this.$toasted.show(data.msg, {
              type: "success", 
              icon: 'check-circle'
            })
          } else {
            this.$toasted.show("Error has occured", {
              type: "error", 
              icon: 'check-circle'
            })
          }
        })
        this.$data.form = {}
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
    ...mapGetters("app/society_member", {societyMemberError:"error", smIsLoading:"isLoading"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
  },

  mounted(){
    // console.log(this.$props.societies)
  }
}
</script>