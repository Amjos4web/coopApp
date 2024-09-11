<template>
  <div>
    <nav class="navbar navbar-default top-navbar" role="navigation">
      <ToggleNavigation/>
			<UnionName :unionName="unionName" :error="error"/>
			<!-- </ul> -->
			<AvatarMeta :loginUserName="loginUserName" :isLoading="isLoading"/>
			<!-- Dropdown Structure -->
    </nav>
    <SideMenu/>
    <!-- /. NAV SIDE  -->
  </div>
</template>

<script>
import ToggleNavigation from '@/components/includes/header/NavBarHeader'
import UnionName from '@/components/includes/header/UnionName'
import AvatarMeta from '@/components/includes/header/AvatarMeta'
//import NotificationDropDownContent from '@/components/includes/header/NotificationDropDownContent'
import SideMenu from '@/components/includes/sidebar/SideMenu'
import {mapGetters, mapActions} from 'vuex'
import event, {EVENT_TYPE} from "../../utility/event"

export default {
	components:{
		ToggleNavigation,
		UnionName,
		AvatarMeta,
		// NotificationDropDownContent,
		SideMenu
	},
	data(){
		return{
			loginUserName:'',
			unionName: ''
		}	
	},
	methods:{
		...mapActions("app/member", ['getOneMember']),
		...mapActions("app/setting", ["getSetting"]),
	},
	computed: {
		...mapGetters("app/auth", ['self', 'isLoading']),
		...mapGetters("app/setting", ["isLoading", "error"])
	},
	mounted(){
		console.log(this.self)
	},
	created(){
		this.getOneMember(this.self.member_id)
		.then((member)=>{
			if(member){
				this.$data.loginUserName = member.name
			}
		});

		this.getSetting()
		.then((data) => {
			
			event.emit(EVENT_TYPE.DONE_FETCHING_SETTING)

			if(data){
				console.log(data.setting.union_name);
				this.$data.unionName = data.setting.union_name
			}
		})
	}
}
</script>