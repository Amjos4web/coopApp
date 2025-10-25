<template>
  <div>
    <HeaderNav/>
    <div v-if="userIsLoading || rolePermissionIsLoading || roleIsLoading">
      <div class="text-center mb-20" style="width:100%">
        <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
      </div>
    </div>

    <div id="content-page" class="content-page" v-else>
      <!-- Error messages -->
      <div v-if="roleError" class="text-center error-div">{{ roleError.message }}</div>
      <div v-if="rolePermissionError" class="text-center error-div">{{ rolePermissionError.message }}</div>
      <div v-if="userError" class="text-center error-div">{{ userError.message }}</div>
      <div v-if="successMsg" class="text-center success-div">{{ successMsg }}</div>

      <form @submit.prevent="saveRolePermissionEventHandler()">
        <div class="container">
          <RefreshAndBackBtn :reloadIndexData="reloadIndexData" :link="link"/>

          <!-- Select Role -->
          <div class="row mt-3">
            <div class="col-md-8 m-auto">
              <div class="form-group">
                <label for="role">Choose role</label>
                <select class="form-control" v-model="form.role_id">
                  <option value="">Choose an Option</option>
                  <option v-for="r in roles" :value="r.id" :key="r.id">
                    {{ r.name }}
                  </option>
                </select>
                <span class="error" v-if="elementHasError('role_id')">
                  {{ error.errors.role_id[0] }}
                </span>
              </div>
            </div>
          </div>

          <!-- Dynamic Permissions -->
          <div class="card" v-for="r in routesPaths" :key="r.route.key">
            <div class="card-body">
              <h3 class="card-title" style="font-weight:100;font-size:14px">
                {{ r.route.name }}
              </h3>
              <div
                class="row mb-2"
                v-for="p in r.permissions"
                :key="p.key"
              >
                <div class="col-md-8">
                  <i class="fa fa-check-circle"></i>&nbsp;{{ p.name }}
                </div>
                <div class="col-md-4 text-end">
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="form.permissions[r.route.key] && form.permissions[r.route.key].includes(p.key)"
                      @change="togglePermission(r.route.key, p.key)"
                    >
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Static Pages -->
          <div class="card">
            <div class="card-body">
              <h3 class="card-title" style="font-weight:100;font-size:14px">Pages</h3>

              <div class="row mb-2" v-for="page in allPages" :key="page">
                <div class="col-md-8">
                  <i class="fa fa-check-circle"></i>&nbsp; {{ page }}
                </div>
                <div class="col-md-4 text-end">
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="form.pages.includes(page)"
                      @change="togglePagesPermission(page)"
                    >

                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="text-center mt-20">
            <input type="submit" value="Save" class="btn btn-success">
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


export default {
  name: 'users-permission-component',
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
      allPages: [
        "Society Status",
        "Member Status",
        "Members",
        "View Edit Societies",
        "Create New Society",
        "Assign Members",
        "Move Members",
        "Assign Delegates",
        "Society Monthly Due",
        "Request Loan",
        "Society Min Amount",
        "Meeting",
        "Revenue",
        "Members Loan Req",
        "Edit Member Payment",
        "Records",
        "Members Due",
        "Users",
        "Meeting Calendar",
        "Roles",
        "Config",
        "Payment Types",
        "Society Joint Account"
      ]
      
    }
  },
  methods: {
    ...mapActions("app/role_permission", ["fetchRolePermissionRoutesPaths", "saveStaffOrUnionExecutiveRolePermission", "getPermissionsRole"]),
    ...mapActions("app/role", ["getRoles"]),
    ...mapActions("app/member", ["getOneMember"]),
    ...mapMutations("app/role_permission", ["setError"]),

    togglePermission(routeKey, permKey) {
      if (!this.form.permissions[routeKey]) {
        this.$set(this.form.permissions, routeKey, [])
      }
      const idx = this.form.permissions[routeKey].indexOf(permKey)
      if (idx > -1) {
        this.form.permissions[routeKey].splice(idx, 1)
      } else {
        this.form.permissions[routeKey].push(permKey)
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

    togglePagesPermission(page) {
      const idx = this.form.pages.indexOf(page)
      if (idx > -1) {
        this.form.pages.splice(idx, 1)
      } else {
        this.form.pages.push(page)
      }
    },

    saveRolePermissionEventHandler() {
      this.setError(null)

      let validation = new Validator(this.$data.form, {
        role_id: 'required|numeric',
        member_id: 'required|numeric'
      })

      if (validation.fails()) {
        const error = new Error(
          "You have error in your data, make neccessary change(s) and submit again."
        )
        error.errors = validation.errors.errors
        this.setError(error)
      } else {
        // 🔹 Ensure only valid pages from allPages are sent
        const normalizedPages = (this.$data.form.pages || [])
          .map(p => (p || '').replace(/\s+/g, ' ').trim())
          .filter(p => this.allPages.includes(p))  // ✅ restrict to allowed values

        const payload = {
          ...this.$data.form,
          permissions: this.$data.form.permissions,
          pages: normalizedPages
        }

        this.saveStaffOrUnionExecutiveRolePermission(payload).then(data => {
          if (data) {
            this.$toasted.show(`Role permission set successfully`, {
              type: "success",
              icon: "check-circle"
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

    this.getPermissionsRole({ member_id: this.$route.params.member_id })
      .then(data3 => {
        if (data3 && data3.rolePermission) {
          const rolePerm = data3.rolePermission;

          // 🔹 Role
          this.form.role_id = rolePerm.role_id;

          // 🔹 Permissions
          try {
            this.form.permissions = rolePerm.permissions
              ? JSON.parse(rolePerm.permissions)
              : {};
          } catch (e) {
            this.form.permissions = {};
          }

          // 🔹 Pages
          try {
            this.form.pages = rolePerm.pages
              ? JSON.parse(rolePerm.pages)
              : [];
          } catch (e) {
            this.form.pages = [];
          }
        }
      })


  }
}
</script>
