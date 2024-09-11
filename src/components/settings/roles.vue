<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div class="container">
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <UserRoleList :roles="roles" :isLoading="isLoading" :error="error" :getOneRoleEventHandler="getOneRoleEventHandler"/>
            </table>
          </div>
        </div> 
      </div>
    <FooterBar/>
    <AddRoleModal :updateRolesOnParent="updateRolesOnParent" :role="role" ref="modal" :error="error"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import UserRoleList from '@/components/settings/UserRoleList'
import AddRoleModal from '@/components/settings/AddRoleModal'
import { closeNavbar, toggleAvatarDropDown, openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'

const initRole = { name:'', type:'' }

export default {
  name: 'roles-component',
  components: {
    HeaderNav,
    FooterBar,
    UserRoleList,
    AddRoleModal
  },
  
  data(){
    return{
      pageTitle: 'User Role',
      previousPage: 'Dashboard',
      notificationMessage: 'Add New User Role',
      successMsg: '',
      roles:[],
      role:initRole,
    } 
  },
  methods: {
    ...mapActions("app/role", ["getRoles", "getOneRole"]),
    showModal(){
      let element = this.$refs.modal.$el
      openModal(element);
    },
    hideModal(){
      let element = this.$refs.modal.$el
      closeModal(element)
    },
    updateRolesOnParent(role, isUpdate){
      if(isUpdate){
        this.$data.roles = this.$data.roles.map(
          r=>((r.id.toString() === role.id.toString()) ? role : r)
        )
        this.$toasted.show(`Role updated successfully`, { 
          type: "success", 
          icon: 'check-circle'
        })
      }else{
        this.$data.roles = [role, ...this.$data.roles]
        this.$toasted.show(`Role added successfully`, { 
          type: "success", 
          icon: 'check-circle'
        })
      }
      //initialize role
      this.$data.role = initRole
      // hide modal
      this.hideModal();
    },
    
    getOneRoleEventHandler(id){
      this.getOneRole(id)
      .then(role=>{
        if(role){
          this.$data.role = role;
          //raise modal here
          this.showModal();
        }//end if
      })//end then
    }
  },
  computed: {
    ...mapGetters("app/role", ["isLoading", "error"])
  },
  created(){
    this.getRoles()
    .then(data => {
      //check if data is not null
      if(data){
        //save to trigger rerendering
        this.roles = data.roles;
      }//end if
    })
  }
}
</script>
