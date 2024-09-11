<template>
  <div>
    <HeaderNav/>
			<div id="content-page" class="content-page">
        <div v-if="smError">
          <div class="error-div text-center">
            <span>{{ smError.message }}</span>
          </div>
        </div>
        <div v-if="memberError">
          <div class="error-div text-center">
            <span>{{ memberError.message }}</span>
          </div>
        </div>
        <div v-if="selfError">
          <div class="error-div text-center">
            <span>{{ selfError.message }}</span>
          </div>
        </div>
        <div v-if="roleError">
          <div class="error-div text-center">
            <span>{{ roleError.message }}</span>
          </div>
        </div>
        <div v-if="memberIsLoading || societyIsLoading || smIsLoading || selfIsLoading || roleIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
				<div class="row padding" v-if="member">
					<div class="col-md-4 col-sm-12 text-center"> 
            <img :src="member.passport" class="avatar" :alt="member.name">
            <h4 class="mt-20">Role: {{ roleType }}</h4>
          </div><!--/.row-->
          <div class="col-md-8 col-sm-12"> 
            <div class="table-responsive">
              <table class="styled-table" id="profile-table">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{{ member.name }}</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>{{ member.gender }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Email Address</th>
                    <td>{{ member.email }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Phone Number</th>
                    <td>{{ member.phone }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Residential Address</th>
                    <td>{{ member.address }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Can Make Payment</th>
                    <td>{{ member.can_pay ? 'Yes' : 'No' }}</td>
                  </tr>
                  <tr>
                    <th>My Society(s)</th>
                    <td>{{ societyName }}</td>
                  </tr>
                  
                </tbody>
              </table>
            </div>
          </div><!--/.row-->
        </div>	
			</div>
      <FooterBar/>
		</div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav'; 
import FooterBar from '@/components/includes/Footer'
import { closeNavbar, toggleAvatarDropDown } from "../../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'profile-index-component',
  components: {
    HeaderNav,
    FooterBar
  },

  data:()=>({
    fetchManySocietyError:null, 
    societyName:'', 
    societies: [], 
    totalAsset:0.0,
    member:[],
    roleType:null,
    pageTitle: 'My Profile',
    previousPage: 'My Dashboard'
  }),

  methods: {
    ...mapActions("app/society_member", ["fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/auth", ["getSelf"]),
    ...mapActions("app/society", ['fetchManySociety']),
    ...mapActions("app/member", ["getOneMember"]),
    ...mapActions("app/role", ["getOneRole"]),
  },

  created(){
    //fetch member society
    this.fetchAllSocietyToWhichIBelongs()
    .then(data=>{
      if(data){
        if(data.societyMembers.length < 1){
          this.$data.societyName = "No Society Yet"
        }else{
          this.fetchManySociety(data.societyMembers.map(sm=>sm.society_id))
          .then(data=>{
            if(data){
              this.$data.societyName = data.societies.reduce((prevVal, s)=>{
                prevVal.push(s.name);
                return prevVal;
              }, []).join(", ")

              this.$data.societies = data.societies.map(s=>({name:s.name, id:s.id}))
            }
          })
          .catch(e=>this.$data.fetchManySocietyError=e)
        }//end else
      }//end if
    })//end then

  
    if (this.self){
      this.getOneMember(this.self.member_id)
      .then(self => {
        if (self){
          this.$data.member = self
        }
      })
    }
    

    if(this.rolePermission){
      this.getOneRole(this.rolePermission.role_id)
      .then(role=>{
        this.$data.roleType = role.name
      })
    }
    
  },

  computed: {
    ...mapGetters("app/society_member", {smIsLoading:"isLoading", smError:"error"}),
    ...mapGetters("app/auth", {selfIsLoading:"isLoading", selfError:"error", self:"self", rolePermission:"rolePermission"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/role", {roleError:"error", roleIsLoading:"isLoading"}),  
    
  }
}
</script>
