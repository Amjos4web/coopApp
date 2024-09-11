<template>
  <div>
    <HeaderNav/>
      <div v-if="userIsLoading || rolePermissionIsLoading || roleIsLoading">
        <div class="text-center mb-20" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
        </div>
      </div>
      <div id="content-page" class="content-page" v-else>
        <div v-if="roleError"> 
          <div class="text-center error-div">
            <span>
              {{ roleError.message }}
            </span>
          </div>
        </div>
        <div v-if="rolePermissionError"> 
          <div class="text-center error-div">
            <span>
              {{ rolePermissionError.message }}
            </span>
          </div>
        </div>
        <div v-if="userError"> 
          <div class="text-center error-div">
            <span>
              {{ userError.message }}
            </span>
          </div>
        </div>
         <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
         <form @submit.prevent="saveRolePermissionEventHandler()">
          <div class="container">
            <RefreshAndBackBtn :reloadIndexData="reloadIndexData" :link="link"/>
            <div class="filter-result mt-20">
              <div class="row">
                <div class="col-md-8 m-auto">
                  <div class="form-group">
                    <label for="role">Choose role</label>
                    <select class="form-control" v-model="form.role_id">
                      <option value="">Choose an Option</option>
                      <option v-for="r in roles" :value="r.id" :key="r.id">{{ r.name }}</option>
                    </select>
                    <span class="error" v-if="elementHasError('role_id')">
                      {{ error.errors.role_id[0] }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card" v-for="r in routesPaths" :key="r.route.key">
                <div class="card-body" v-for="p in r.permissions" :key="p.key">
                  <h3 class="card-title" :style="{fontWeight: '100', fontSize: '14px;'}">{{ r.route.name }}</h3>
                  <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp;{{ p.name }}
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePermission(r.route.key, p.key)">
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title" :style="{fontWeight: '100', fontSize: '14px;'}">Pages</h3>
                  <div class="row">
                    <div class="col-md-8">
                      <i class="fa fa-check-circle"></i>&nbsp; Society Loan Status
                    </div>
                    <div class="col-md-4 pull-right">
                      <label class="switch"><input type="checkbox" @click="togglePagesPermission('Society Status')">
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Member Loan Status
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox"  @click="togglePagesPermission('Member Status')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Members
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Members')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; View/Edit Societies
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('View Edit Societies')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Create New Society
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Create New Society')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Assign Members
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Assign Members')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Assign Delegates
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Assign Delegates')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Society Monthly Due
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Society Monthly Due')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Request Loan 
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Request Loan')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Society Min. Amount
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Societies Min Amount')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Meeting
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Meeting')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Revenue
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Revenue')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Members Loan Request
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Members Loan Req')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Edit Member Payment
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Edit Member Payment')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Records
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Record')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Members Due
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Members Due')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Users
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Users')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Meeting Calendar
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Meeting Calendar')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Roles
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Roles')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Config
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Config')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  <div class="row">
                   <div class="col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp; Payment Types
                  </div>
                  <div class="col-md-4 pull-right">
                    <label class="switch"><input type="checkbox" @click="togglePagesPermission('Payment Types')">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  </div>
                  </div>
                </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Save" class="btn btn-info">
            </div>
          </div>
        </form>
      </div>
    <FooterBar/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import RefreshAndBackBtn from '@/components/includes/RefreshAndBackBtn'
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'
import {turnArrayToObject} from "../../utility"

const selectedPermission = []
const selectedPages = []

export default {
  name: 'ssers-permission-component',
  components: {
    HeaderNav,
    FooterBar,
    RefreshAndBackBtn
  },
  data(){
    return {
      routesPaths: {},
      roles: [],
      userName: '',
      pageTitle: '',
      previousPage: 'Dashboard',
      form: {
        role_id: '',
        permissions: {},
        member_id: parseFloat(this.$route.params.member_id),
        pages: []
      },
      successMsg: '',
      link: '/users',
      
    }
  },
  methods: {
    ...mapActions("app/role_permission", ["fetchRolePermissionRoutesPaths", "saveStaffOrUnionExecutiveRolePermission", "getPermissionsRole"]),
    ...mapActions("app/role", ["getRoles"]),
    ...mapActions("app/member", ["getOneMember"]),
    ...mapMutations("app/role_permission", ["setError"]),

    togglePermission(routeKey, permissionKey){

      if(this.$data.form.permissions[routeKey]){
        const index = this.$data.form.permissions[routeKey].indexOf(permissionKey)

        if(index > -1){
          this.$data.form.permissions[routeKey].splice(index, 1)
        }else{
          this.$data.form.permissions[routeKey].push(permissionKey)
        }
        this.$data.form.permissions[routeKey] = [].concat(this.$data.form.permissions[routeKey])
        
      }else{
        this.$data.form.permissions[routeKey] = [permissionKey];
      }
    },

     elementHasError(elemID){
      return ((
        this.error 
        && this.error.errors 
        && this.error.errors[elemID] 
        && this.error.errors[elemID].length > 0
      ) ? true : false)
    },

    togglePagesPermission(page){
      const index = selectedPages.indexOf(page)
      if (index > -1){
        selectedPages.splice(page, 1)
      } else {
        selectedPages.push(page)
      }
      this.$data.form.pages = selectedPages
    },

    saveRolePermissionEventHandler(){
      this.setError(null)
      // console.log(this.$data.form)
      let validation = new Validator(this.$data.form, {
        role_id: 'required|numeric',
        member_id: 'required|numeric'
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.saveStaffOrUnionExecutiveRolePermission(this.$data.form)
        .then(data => {
          if (data){
            this.$toasted.show(`Role permission set successfully`, { 
              type: "success", 
              icon: 'check-circle'
            })
          }
        })
      }
    },
    reloadIndexData(){
      // console.log('I got here')
    }
  },

  computed: {
    ...mapGetters("app/user", {userError:"error", userIsLoading:"isLoading"}),
    ...mapGetters("app/role_permission", {rolePermissionError:"error", rolePermissionIsLoading:"isLoading"}),
    ...mapGetters("app/role", {roleError:"error", roleIsLoading:"isLoading"}), 
    
  },
  
  created(){
    this.fetchRolePermissionRoutesPaths()
    .then(data => {
      if (data) {
        this.$data.routesPaths = data.routesPaths
      }
    }),

    this.getRoles()
    .then(response => {
      if (response){
        this.$data.roles = response.roles
      }
    }),


    this.getOneMember(this.$route.params.member_id)
    .then(data2=> {
      if (data2) {
        this.$data.pageTitle = `Set Role Permission for ${data2.name}`
      }
    })

    this.getPermissionsRole({member_id:this.$route.params.member_id})
    .then(data3 => {
      // console.log(data3)
      if (data3){
        if (data3.rolePermission){
          this.$data.form.permissions = data3.rolePermission.permissions
          //this.$data.routesPaths = data3.rolePermission[0]
          const routeKey = data3.rolePermission.permissions[0]
          //const permissionObj = turnArrayToObject(data3.rolePermission.permissions)
          // console.log(routeKey)
          //const routeKey = 
          //const index = this.$data.form.permissions[routeKey].indexOf(permissionKey)
          // let p =  
          // if (index > -1){

          // }
          //console.log(index)
        }
      }
    })

  }
}
</script>
