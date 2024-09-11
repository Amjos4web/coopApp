<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <form @submit.prevent="searchUser()">
          <div class="container">
            <div class="row">
              <div class="col-md-8 m-auto">
                <div class="form-group col-12 text-center">
                  <label for="user name">Enter User Name</label>
                  <input type="text" v-model="query.filter.name" class="form-control">
                </div>
                <div class="text-center mt-20">
                  <input type="submit" value="Search Member" class="btn btn-info">
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="container">
          <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit" :reloadIndexData="reloadIndexData"/>
           <div v-if="successMsg">
            <div class="text-center success-div">
              <span>
                {{ successMsg }}
              </span>
            </div>
          </div>
          <div v-if="usersError">
            <div class="error-div text-center">
              <span>
                {{ usersError.message }}
              </span>
            </div>
          </div>
  
          <div class="table-responsive">
            <!-- <button type="button" class="btn btn-default pull-right btn-sm" @click="reloadData()">Reload</button> -->
            <table class="styled-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Permission</th>
                  <th>Delegate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <UsersList :users="users" :usersError="usersError" 
              :userIsLoading="userIsLoading" 
              :currentPage="pagination.currentPage" 
              :limit="pagination.limit"
              :deactivateUserEventHandler="deactivateUserEventHandler"
              :resetUserPasswordEventHandler="resetUserPasswordEventHandler"
              :uploadProfileImageModalHandler="uploadProfileImageModalHandler"
              :switchOnCamera="switchOnCamera"
              />
            </table>
          </div>
        </div> 
        <Pagination :pagination="pagination" :changePage="changePage"/>
      </div>
      <FooterBar/>
    <div class="modal fade" id="uploadProfileImage" role="dialog" style="border-radius: 5px;" ref="modal">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content" v-show="userName">
          <div class="modal-header">
            <h4 class="modal-title" v-if="userName">
              Uploading Profile Image for {{ userName }}
            </h4>
            <button type="button" class="close" data-dismiss="modal" @click="switchOffCamera()">&times;</button>
          </div>
          
          <div class="modal-body">
            <div v-if="successMsg">
              <div class="text-center success-div">
                <span>
                  {{ successMsg }}
                </span>
              </div>
            </div>
             <div v-if="memberIsLoading || userIsLoading">
              <div class="text-center" :style="{width: '100%'}">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
              </div>
            </div>
            <div v-if="memberError">
              <div class="error-div text-center">
                <span>
                  {{ memberError.message }}
                </span>
              </div>
            </div>
            <div v-if="usersError">
              <div class="error-div text-center">
                <span>
                  {{usersError.message}}
                </span>
              </div>
            </div>
            <div class="container" :style="{width: '100%;'}">
              <PhotoCapture :onOrOff="onOnOffCamera" :savePicture="savePicture" :snapshotSize="{width:160, height:160}"/> 
              <div class="text-center modal-footer">
                <input type="submit" value="Save" class="btn btn-primary btn-sm" @click="uploadProfileImageEventHandler()">
                <button type="button" class="btn btn-warning btn-sm" @click="switchOffCamera()" data-dismiss="modal">Cancel</button>
              </div>         
            </div>
          </div>
          
        </div>
      </div>
    
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import UsersList from '@/components/users/UsersList'
import FooterBar from '@/components/includes/Footer'
import PhotoCapture from "@/components/includes/PhotoCapture";
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import { closeModal, openModal } from "../../assets/js/helpers/utility"
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from "../../utility"

let passport = null


export default {
  name: 'users-index',
  components: {
    HeaderNav,
    FooterBar,
    UsersList,
    Pagination,
    PhotoCapture,
    LimitDataFetch,
  },
  data(){
    return {
      query: {
        filter:{
          name: '',
        },
      },
      pageTitle: 'Users',
      previousPage: 'Dashboard',
      notificationMessage: null,
      users: [],
      usersSearchResult: [],
      userName: null,
      memberID: null,
      pagination: {},
      successMsg: '',
      onOnOffCamera:false,
    }
  },
  methods: {
    ...mapActions("app/user", [
      "getUsers", 
      "resetMemberPassword", 
      "activateDeactivateMemberAccount",
      "updateUserProfileImage",
      ]
    ),
    ...mapActions("app/member", ['fetchManyMember', 'getOneMember']),
    ...mapMutations("app/member", ["setError"]),

    uploadProfileImageModalHandler(userID){
      this.$data.userID = userID 
    },

    displayUserHelper(data){
      const _userList = data.users
      const userIDs = _userList.map(u=>u.member_id)
      this.fetchManyMember(userIDs)
      .then(result => {
        if (result){
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
          }) 
          this.$data.users = data.users
          this.$data.pagination = data.pagination
        }
      }) // end then
    },

    getUserFromServer(reload=false, filter){
      this.getUsers({query:this.$data.query, reload, filter})
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

    deactivateUserEventHandler(userID){
      this.activateDeactivateMemberAccount(userID)
      .then(result => {
        if (result){
          this.$toasted.show(`Account operation successful`, { 
            type: "success", 
            icon: 'check-circle'
          })
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

    resetUserPasswordEventHandler(userID){
      this.resetMemberPassword(userID)
      .then(result => {
        if (result){
          this.$data.successMsg = `Password reset successful. New password is: ${result.new_default_psd}`
          const _userdata = result.user
          this.$data.users = result.user.map(u=>{
            if(u.id.toString() === _userdata.id.toString()){
              _userdata.name = u.name
              _userdata.phone = u.phone
              return result
            }
            return u
          })
          
        }
      })
    },

    reloadIndexData(page){
      this.getUsers({query:{page, limit:200}})
      .then(data => {
        if (data){
          this.displayUserHelper(data)
        }
      });
    },

    changePage(page){
      this.getUsers({query:{page, limit:200}})
      .then(data => {
        if (data){
          this.displayUserHelper(data)
        }
      });
    },

    switchOffCamera(){
      this.$data.onOnOffCamera = false
    },

    switchOnCamera(member_id, user_name){
      this.$data.onOnOffCamera = true
      this.$data.memberID = member_id
      this.$data.userName = user_name
    },

    savePicture(snapshotURL){
      passport = snapshotURL
    },

    uploadProfileImageEventHandler(){
      this.updateUserProfileImage({memberID:this.$data.memberID, passport:passport})
      .then(result => {
        if (result){
          this.$data.successMsg = `Profile image has been captured successfully` 
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
    searchUser(){
      const searchMeta = this.$data.query.filter.name.toLocaleString()
      this.getUsers({query:{filter:{name:searchMeta}}})
      .then(data => {
        if (data){
          this.displayUserHelper(data)
        }
      });
      this.$data.users
    }
  },

  computed: {
    ...mapGetters("app/user", {usersError:"error", userIsLoading:"isLoading"}),
    ...mapGetters("app/role_permission", {rolePermissionError:"error", rolePermissionIsLoading:"isLoading"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"})
  },
  
  created(){
    this.getUsers({query:{limit:200}})
    .then(data => {
      if (data){
        this.displayUserHelper(data)
      }
    });
  }
}
</script>
