<template>
  <div>
	<!-- TOP Nav Bar -->
		<div class="iq-top-navbar">
			<div class="iq-navbar-custom">
				<nav class="navbar navbar-expand-lg navbar-light p-0">
					<div class="iq-menu-bt d-flex align-items-center">
						<div class="wrapper-menu">
						<div class="main-circle"><i class="ri-menu-line"></i></div>
						<div class="hover-circle"><i class="ri-close-fill"></i></div>
						</div>
						<div class="iq-navbar-logo d-flex justify-content-between ml-3">
						<a class="header-logo">
							<img src="/img/app-logo.png" class="avatar-2 rounded" :alt="unionName">
							<span>{{ unionName }}</span>
						</a>
						</div>
					</div>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"  aria-label="Toggle navigation">
					<i class="ri-menu-3-line"></i>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav ml-auto navbar-list">
							<li class="nav-item nav-icon">
								<a href="#" class="search-toggle iq-waves-effect bg-primary rounded">
								<i class="ri-notification-line"></i>
								<span class="bg-danger dots"></span>
								</a>
								<div class="iq-sub-dropdown">
									<div class="iq-card shadow-none m-0">
										<div class="iq-card-body p-0 ">
										<div class="bg-primary p-3">
											<h5 class="mb-0 text-white">All Notifications<small class="badge  badge-light float-right pt-1">4</small></h5>
										</div>
										</div>
									</div>
								</div>
							</li>
							<li class="nav-item nav-icon dropdown">
								<a href="#" class="search-toggle iq-waves-effect bg-primary rounded">
								<i class="ri-mail-line"></i>
								<span class="bg-danger count-mail"></span>
								</a>
								<div class="iq-sub-dropdown">
									<div class="iq-card shadow-none m-0">
										<div class="iq-card-body p-0 ">
											<div class="bg-primary p-3">
												<h5 class="mb-0 text-white">All Messages<small class="badge  badge-light float-right pt-1">5</small></h5>
											</div>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<ul class="navbar-list">
						<li class="line-height">
							<AvatarMeta :loginUserName="loginUserName" :authIsLoading="authIsLoading" :member="member" :roleType="roleType"/>
						</li>
					</ul>
				</nav>
			</div>
		</div>
		<!-- TOP Nav Bar END -->
    <SideMenu :pages="pages" :unionName="unionName"/>
    <!-- /. NAV SIDE  -->
  </div>
</template>

<script>
// import UnionName from '@/components/includes/header/UnionName'
import AvatarMeta from '@/components/includes/header/AvatarMeta'
import SideMenu from '@/components/includes/sidebar/SideMenu'
import {mapGetters, mapActions} from 'vuex'
import event, {EVENT_TYPE} from "../../utility/event"


export default {
	components:{
		// UnionName,
		AvatarMeta,
		SideMenu
	},
	data(){
		return{
			loginUserName:'',
			roleType:null,
			unionName: '',
			member: '',
			pages:[]
		}	
	},
	methods:{
		...mapActions("app/member", ['getOneMember']),
		...mapActions("app/setting", ["getSetting"]),
		...mapActions("app/role", ["getOneRole"]),

	},
	computed: {
		...mapGetters("app/auth", {self:'self', authIsLoading:'isLoading', rolePermission:'rolePermission'}),
		...mapGetters("app/setting", {settingIsLoading:"isLoading", settingError:"error"}),
		...mapGetters("app/role", {roleError:"error", roleIsLoading:"isLoading"}),
	},
	
	created(){
		if (this.rolePermission){
			if (this.rolePermission.pages){
				this.$data.pages = JSON.parse(this.rolePermission.pages)
			}
		}
		
		this.getOneMember(this.self.member_id)
		.then((member)=>{
			if(member){
				this.$data.member = member
				this.$data.loginUserName = member.name
			}
		});

		this.getSetting()
		.then((data) => {
			event.emit(EVENT_TYPE.DONE_FETCHING_SETTING)
			if(data){
				this.$data.unionName = data.setting.union_name
			}
		})

		if(this.rolePermission){
      this.getOneRole(this.rolePermission.member_id)
      .then(role=>{
        if (role){
          this.$data.roleType = role.name
        }
      })
      
    }
	}
}
</script>