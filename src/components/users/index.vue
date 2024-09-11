<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
         <form @submit.prevent="getUserFromServer()">
          <div class="container">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-6 col-md-offset-3">
                  <div class="input-field col s12">
                    <input type="text" v-model="query.filter.name">
                    <label for="user name">Enter User Name</label>
                    <span class="error-message" id="username-error"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Filter" class="btn-general">
            </div>
          </div>
        </form>
        <div class="container">
          <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit"/>
           <div v-if="successMsg">
            <div class="text-center success-div">
              <span>
                {{ successMsg }}
              </span>
            </div>
          </div>
          <div v-if="error">
            <div class="error-div text-center">
              <span>
                {{ error.message }}
              </span>
            </div>
          </div>
  
          <div class="table-responsive">
            <!-- <button type="button" class="btn btn-default pull-right btn-sm" @click="reloadData()">Reload</button> -->
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Set Permission</th>
                  <th>Reset Password</th>
                  <th>Deactivate</th>
                </tr>
              </thead>
              <UsersList :users="users" :error="error" 
              :isLoading="isLoading" 
              :currentPage="pagination.currentPage" 
              :limit="pagination.limit"
              :deactivateUserEventHandler="deactivateUserEventHandler"
              :resetUserPasswordEventHandler="resetUserPasswordEventHandler"/>
            </table>
          </div>
        </div> 
        <Pagination :pagination="pagination"/>
      </div>
    </div>
    <UserPermissionModal/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import UserPermissionModal from '@/components/users/UserPermissionModal'
import UsersList from '@/components/users/UsersList'
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import { closeNavbar, toggleAvatarDropDown, closeModal, openModal } from "../../assets/js/helpers/utility"
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from "../../utility"

export default {
  name: 'Users',
  components: {
    HeaderNav,
    PageHeader,
    UserPermissionModal,
    UsersList,
    Pagination,
    LimitDataFetch
  },
  data(){
    return {
      query: {
        filter:{
          name: '',
        },
        limit:10,
        page:1
      },
      pageTitle: 'Users',
      previousPage: 'Dashboard',
      notificationMessage: null,
      users: [],
      pagination: {},
      successMsg: ''
    }
  },
  methods: {
    ...mapActions("app/user", [
      "getUsers", 
      "resetMemberPassword", 
      "activateDeactivateMemberAccount"
      ]
    ),
    ...mapActions("app/member", ['fetchManyMember', 'getMembers']),

    displayUserHelper(data){
      const _userList = data.users

      const userIDs = _userList.map(u=>u.member_id)

      this.fetchManyMember(userIDs)
      .then(result => {
        const memberObj = turnArrayToObject(result.members)

        this.$data.users = _userList.map(u=>{
          const m = memberObj[u.member_id]

          if (m){
              u.name = m.name
              u.phone = m.phone
          } else {
            u.name = "Unknown"
            u.phone = "Unknown"
          }
          return u;
        })// end map
        this.$data.pagination = data.pagination
      }) // end then
      .catch(e=>{
        this.setError(e)
      })
    },

    getUserFromServer(){
      this.getUsers({query:this.$data.query})
      .then(data => {
        if (data){
          this.displayUserHelper(data)
        }
      });
    },

    getLimit(event){
      this.$data.query.limit = event.target.value;
      this.getUserFromServer()
    },//end method getLimit,

    deactivateUserEventHandler(id){
      this.activateDeactivateMemberAccount(id)
      .then(result => {
        if (result){

          this.$data.successMsg = 'Operation successful'

          this.$data.users = this.$data.users.map(u=>{

            if(u.id.toString() === result.id.toString()){
              result.name = u.name
              result.phone = u.phone
              return result
            }
            return u
          })
        }
      })
    },

    resetUserPasswordEventHandler(id){
      this.resetMemberPassword(id)
      .then(result => {
        if (result){
          this.$data.successMsg = `Password reset successful. New password is: ${result.new_default_psd}`

          this.$data.users = this.$data.users.map(u=>{

            if(u.id.toString() === result.id.toString()){
              result.name = u.name
              result.phone = u.phone
              return result
            }
            return u
          })
        }
      })
    }
  },

  computed: {
    ...mapGetters("app/user", ["error", "isLoading"])
  },
  
  created(){
    this.getUsers()
    .then(data => {
      if (data){
        this.displayUserHelper(data)
      }
    });


  },
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>
