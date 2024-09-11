<template>
   <div class="modal fade" id="addMemberModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <form @submit.prevent="saveMember()" class="col-12" v-if="!member.id">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title"><i class="fa fa-plus"></i> {{ modalTitle }}</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
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
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="form-group col-12">
                    <label for="fullname">Full Name</label>
                    <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.name"
                    autofocus
                    >
                    <span class="error" v-if="elementHasError('name')">
                      {{ error.errors.name[0] }}
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-12">
                    <label for="email">Email Address</label>
                    <input 
                    type="email"
                    class="form-control"
                    v-model="form.email"
                    >
                    <span class="error" v-if="elementHasError('email')">
                      {{ error.errors.email[0] }}
                    </span>
                  </div>
                </div>
                
                <div class="row">
                  <div class="form-group col-12">
                    <label for="phone">Phone Number</label>
                    <input 
                    type="text"
                    class="form-control"
                    v-model="form.phone"
                    >
                    <span class="error" v-if="elementHasError('phone')">
                      {{ error.errors.phone[0] }}
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-12">
                    <label for="address">Address</label>
                    <textarea 
                    id="address" 
                    class="form-control"
                    v-model="form.address"
                    >
                    </textarea>
                    <span class="error" v-if="elementHasError('address')">
                      {{ error.errors.address[0] }}
                    </span>
                  </div>
                </div>
                
                <div class="row">
                  <div class="form-group col-12">
                    <label>Gender</label>
                    <select v-model="form.gender" class="form-control">
                      <option value="">Choose your option</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <span class="error" v-if="elementHasError('gender')">
                      {{ error.errors.gender[0] }}
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col s12">
                    <label>Can Make Payment</label>
                    <select v-model="form.can_pay" class="form-control">
                      <option value="">Choose your option</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                    <span class="error" v-if="elementHasError('can_pay')">
                      {{ error.errors.can_pay[0] }}
                    </span>
                  </div>
                </div>
                
                <div class="row">
                  <div class="form-group col-8">
                    <label>Active</label>
                  </div>
                  <div class="col-4" style="margin-top: 5px; text-align: right;">
                    <label for="memberID4"></label>
                    <!-- <p>
                      <input type="checkbox"
                      v-model="form.active" 
                      id="memberID4"
                      class="form-control"
                      >
                      
                    </p> -->
                    <p>
                      <label class="switch"><input type="checkbox" v-model="form.active">
                        <span class="slider round"></span>
                      </label>
                    </p>
                  </div>
                  <span class="error" v-if="elementHasError('active')">
                    {{ error.errors.active[0] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer text-center">
            <input type="submit" name="save" class="btn btn-primary" value="Save" id="yes">
            <button type="button" id="continue" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </form>
      <form @submit.prevent="updateMemberData()" class="col-12" v-if="member.id">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title"> {{ modalTitle }}</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
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
          <div class="modal-body">
            <div class="row">
              <div class="form-group col-12">
                <label for="fullname">Full Name</label>
                <input 
                type="text" 
                class="form-control" 
                v-model="updateFormData.name"
                autofocus
                >
                <span class="error" v-if="elementHasError('name')">
                  {{ error.errors.name[0] }}
                </span>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-12">
                <label for="email">Email Address</label>
                <input 
                type="email"
                class="form-control"
                v-model="updateFormData.email"
                >
                
                <span class="error" v-if="elementHasError('email')">
                  {{ error.errors.email[0] }}
                </span>
              </div>
            </div>
            
            <div class="row">
              <div class="form-group col-12">
                <label for="phone">Phone Number</label>
                <input 
                type="text"
                class="form-control"
                v-model="updateFormData.phone"
                >
                <span class="error" v-if="elementHasError('phone')">
                  {{ error.errors.phone[0] }}
                </span>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-12">
                <label for="address">Address</label>
                <textarea 
                id="address" 
                class="form-control"
                v-model="updateFormData.address"
                >
                </textarea>
                <span class="error" v-if="elementHasError('address')">
                  {{ error.errors.address[0] }}
                </span>
              </div>
            </div>
            
            <div class="row">
              <div class="form-group col-12">
                <label>Gender</label>
                <select v-model="updateFormData.gender" class="form-control">
                  <option value="">Choose your option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <span class="error" v-if="elementHasError('gender')">
                  {{ error.errors.gender[0] }}
                </span>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-12">
                <label>Can Make Payment</label>
                <select v-model="updateFormData.can_pay" class="form-control">
                  <option value="">Choose your option</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                <span class="error" v-if="elementHasError('can_pay')">
                  {{ error.errors.can_pay[0] }}
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer text-center">
            <input type="submit" name="save" class="btn btn-primary" value="Update" id="yes">
            <button type="button" id="continue" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

export default {
  name: 'register-member-modal',
  props:["member", "updateMemberOnParent", "modalTitle"],

  data:function(){
    return { 
      form:{
        name:'',
        phone:'',
        email:'',
        gender:'',
        can_pay:'',
        address:'',
        active:''
      },//end form 
      updateFormData: {
        name:this.$props.member.name,
        phone:this.$props.member.phone,
        email:this.$props.member.email,
        gender:this.$props.member.gender,
        can_pay:this.$props.member.can_pay,
        address:this.$props.member.address,
      }
    }//end object
  },

  methods: {
    ...mapActions("app/member", ["addNewMember", "updateMember"]),
    ...mapMutations("app/member", ["setError"]),

    saveMember(){
      this.setError(null)

      let validation = new Validator(this.$data.form, {
        name: 'required|max:100',
        gender: 'required',
        can_pay: 'required|numeric',
        address: 'required|min:10',
        active: 'required'
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.addNewMember(this.$data.form)
        .then(data => {
          this.$props.updateMemberOnParent(data, false, true)
        })//end then method
      }// end else 
      // clear form
      this.$data.form = {}
    },

    updateMemberData(){
      this.setError(null)

      let validation = new Validator(this.$data.updateFormData, {
        name: 'required|max:100',
        gender: 'required',
        can_pay: 'required|numeric',
        address: 'required|min:10',
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        const id = this.$props.member.id
        //this is update since parent sent ID
        if(id){
          this.updateMember({id, formData : this.$data.updateFormData})
          .then(data => {
            // check if member is not null
            if (data){
              console.log(data)
              this.$props.updateMemberOnParent(data, true, false)
            }//end if
          })// end then method
        }// end if
        this.$data.updateFormData = {}
      } // end else
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
    ...mapGetters("app/member", ["error", "isLoading"])
  },

  watch: {
    member(newMember, oldMember){
      this.$data.updateFormData = {
        name: newMember.name,
        phone: newMember.phone,
        email: newMember.email,
        gender: newMember.gender,
        address: newMember.address,
        can_pay: newMember.can_pay,
      }
    }
  }
}
</script>
