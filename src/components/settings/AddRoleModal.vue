<template>
  <div class="modal fade" id="addRoleModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <form @submit.prevent="saveRole()">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Add New Role</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div v-if="isLoading">
            <div class="text-center">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
            </div>
          </div>
          <div v-if="error"> 
            <div class="text-center error-div">
              <span>
                {{ error.message }}
              </span>
            </div>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="styled-table" :style="{width:'60%', margin:'auto'}">
                <thead>
                  <tr>
                    <th width="40%">Role</th>
                    <td width="60%">
                      <div class="form-group">
                        <label for="user name">Enter role</label>
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
                      <hr/>
                      <div class="form-group">
                        <label for="user name">Role Type</label>
                        <select 
                        v-model="form.type" 
                        class="form-control"
                        >
                          <option value="">Select Role Type</option>
                          <option value="Staffs">Staffs</option>
                        </select>
                        <span class="error"  v-if="elementHasError('type')">
                          {{ error.errors.type[0] }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <input type="submit" name="addRole" class="btn btn-primary" value="Save">
            <button type="button" id="continue" class="btn btn-warning ml-10" data-dismiss="modal">close</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Validator from 'validatorjs'

export default {
  name: 'add-role-modal',
  props: {
    role: Object,
    updateRolesOnParent: Function,
    isLoading: Boolean,
    error: Error
  },
  data:function(){
    return { 
      form:{
        type:this.$props.role.type, 
        name:this.$props.role.name
      },//end form 
    }//end object
  },
  methods: {
    ...mapActions("app/role", ["addNewRole", "updateRole"]),
    ...mapMutations("app/role", ["setError"]),

    saveRole(){
      this.setError(null);
      let validation  = new Validator(this.$data.form, {
        name: 'required',
        type: 'required',
      });

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        const id = this.$props.role.id;
        //this is update since parent sent ID
        if(id){
          this.updateRole({id, formData : this.$data.form})
          .then(role => {
            //if role is not null
            if(role){
              this.$props.updateRolesOnParent(role, true)
            }//end if
          })//end then method
        } 
        else {
          //add new role
          this.addNewRole(this.$data.form)
          .then(role => {
            //if role is not null
            if(role){
              this.$props.updateRolesOnParent(role, false)
            }//end if
          })//end then method
        }//end else
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

  watch:{
    role(newRole, oldRole){
      this.$data.form = {type:newRole.type, name:newRole.name}
    }
  }
}
</script>