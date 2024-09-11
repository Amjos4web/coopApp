<template>
  <div>
    <HeaderNav/>
      <div v-if="userIsLoading || rolePermissionIsLoading || societyIsLoading || roleIsLoading">
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
        <div v-if="societyError"> 
          <div class="text-center error-div">
            <span>
              {{ societyError.message }}
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
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="society">Choose Society</label>
                    <select class="form-control" v-model="form.society_id">
                      <option value="">Choose an Option</option>
                      <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                    </select>
                    <span class="error" v-if="elementHasError('society_id')">
                      {{ error.errors.soceity_id[0] }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="role">Choose Role</label>
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
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Save" class="btn btn-primary">
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
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility"
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'

const selectedPermission = []

export default {
  name: 'AssignDelegate',
  components: {
    HeaderNav,
    FooterBar,
    RefreshAndBackBtn
  },
  data(){
    return {
     routesPaths: {},
      permissions: [],
      societies: [],
      roles: [],
      userName: '',
      pageTitle: '',
      previousPage: 'Dashboard',
      form: {
        role_id: '',
        society_id: '',
        permissions: {},
        member_id: parseFloat(this.$route.params.user_id)
      },
      successMsg: '',
      link: '/users/',
    }
  },
  methods: {
    ...mapActions("app/role_permission", ["fetchRolePermissionRoutesPaths", "saveSocietyDelegateRolePermission", "getPermissionRole"]),
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/member", ["getOneMember"]),
    ...mapActions("app/role", ["getRoles"]),
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

    saveRolePermissionEventHandler(){
      this.setError(null)

      let validation = new Validator(this.$data.form, {
        society_id: 'required|numeric',
        role_id: 'required|numeric',
        member_id: 'required|numeric'
      })

      if (validation.fails()){
        const error = new Error("You have error in your data, make neccessary change(s) and submit again.")
        error.errors = validation.errors.errors;
        this.setError(error)
      } else {
        this.saveSocietyDelegateRolePermission(this.$data.form)
        .then(data => {
          if (data){
            this.$data.successMsg = 'Society delegate set successfully'
            this.$toast.success('Society delegate set successfully')
          }
        })
      }
    },

    reloadIndexData(){
      
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
    ...mapGetters("app/user", {userError:"error", userIsLoading:"isLoading"}),
    ...mapGetters("app/role_permission", {rolePermissionError:"error", rolePermissionIsLoading:"isLoading"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/role", {roleError:"error", roleIsLoading:"isLoading"})
    
  },
  
  created(){
    this.fetchRolePermissionRoutesPaths()
    .then(data => {
      if (data) {
        this.$data.routesPaths = data.routesPaths
      }
    }),

    this.getSocieties({query:{limit:500}})
    .then(response => {
      if (response){
        this.$data.societies = response.societies
      }
    }),

    this.getOneMember(this.$route.params.user_id)
    .then(member=> {
      if (member) {
        this.$data.pageTitle = `Delegate role for ${member.name}`
      }
    }),

    this.getRoles()
    .then(roles => {
      if (roles){
        this.$data.roles = roles.roles
      }
    })
  }
}
</script>
