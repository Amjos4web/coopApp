<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> {{ notificationMessage }}</p>
                <p class="export-btn">
                  <button class="btn btn-warning btn-sm" @click="showModal"><i class="fa fa-plus"></i>&nbsp;Add New Role</button>
                </p>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
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
    </div> 
    <AddRoleModal :updateRolesOnParent="updateRolesOnParent" :role="role" ref="modal" :error="error"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import UserRoleList from '@/components/settings/UserRoleList'
import AddRoleModal from '@/components/settings/AddRoleModal'
import { closeNavbar, toggleAvatarDropDown, openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'

const initRole = { name:'', type:'' }

export default {
  name: 'roles',
  components: {
    HeaderNav,
    PageHeader,
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
        this.$data.successMsg = 'Role updated successfully'
      }else{
        this.$data.roles = [role, ...this.$data.roles]
        this.$data.successMsg = 'Role created successfully'
      }
      //initialize role
      this.$data.role = initRole
      // hide modal
      this.hideModal();
    },
    
    getOneRoleEventHandler(id){
      //console.log(id);
      this.getOneRole(id)
      .then(role=>{
        console.log(role)
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
  },
  mounted(){
    closeNavbar()
    toggleAvatarDropDown()
  },
}
</script>
