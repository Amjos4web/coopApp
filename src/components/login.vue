<template>
	<div>
		<!-- <NotLoggedInHeader/> -->
		<div class="login-form">
			<div v-if="settingIsLoading">
				<img src="/img/loadinggif.png" alt="Loading" class="loading-img">
			</div>
			<h2>
				<p class="text-upper">Ogbomoso Oluwalose Cooperative Investments and Credit Union</p>
			</h2>
			<img src="/img/app-logo.png" alt="unionName" class="image-fluid app-logo">
			<form @submit.prevent="authenticate()">
				<span class="error" v-if="authError">{{authError.message}}</span>
				<!-- <span class="error" v-if="settingError">{{settingError.message}}</span> -->
				<div v-if="authIsLoading">
					<img src="/img/loadinggif.png" alt="Loading" class="loading-img">
				</div>
					<div class="form-group">
						<input 
							type="text" 
							class="data-input" 
							placeholder="Username"
							v-model="form.userid"
							autofocus
						>
						
					</div>

					<div class="form-group">
						<input 
							type="password" 
							name="password" 
							id="password" 
							class="data-input"
							v-model="form.password" 
							placeholder="Password"
						>
					</div>
				<div class="text-center">
					<input type="submit" value="Login" class="btn-login" name="login">
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import Validator from 'validatorjs'
import { mapActions , mapGetters, mapMutations } from 'vuex'
import event, {EVENT_TYPE} from "../utility/event"

export default {
	name: 'login-component',
	data() {
		return {
			form: {
				userid: '',
				password: ''
			},
			unionName: null
		};	
	},

	methods: {
		...mapActions("app/auth/", ["login"]),
		...mapMutations("app/auth/", ['setError']),
		...mapActions("app/setting", ["getSetting"]),

		authenticate() {
			this.setError(null);

			const validation = new Validator(this.form, {
				userid: 'required',
				password: 'required'
			});

			if (validation.passes()) {
				this.login(this.$data.form)
					.then(result => {
						if (result) {
							// ✅ Check for redirect route (r)
							const redirectTo = this.$route.query.r || "/";
							this.$router.replace(redirectTo);
						}
					});
			} else {
				const error = new Error("Invalid Login Detail.");
				this.setError(error);
			}
		}
	},
	computed: {
		...mapGetters("app/auth", {authIsLoading:"isLoading", authError:"error"}),
		...mapGetters("app/setting", {settingIsLoading:"isLoading", settingError:"error"})
	},

	created(){
		this.getSetting()
		.then((data) => {
			event.emit(EVENT_TYPE.DONE_FETCHING_SETTING)
			if(data){
				this.$data.unionName = data.setting.union_name
			}
		})
	}
}
</script>
<style scoped>
	.login-form {
		width: 35%;
		height: auto;
		margin: 30px auto;
		padding: 30px;
		text-align: center;
		background-color: #f1f1f1;
		border-radius: 5px;
		box-shadow: 
			inset 0 -3em 3em rgba(0,0,0,0.1), 
						0 0  0 2px rgb(255,255,255),
						0.3em 0.3em 1em rgba(0,0,0,0.3);
	}
	
	h2 {
		text-align: center;
		font-size: 18px;
		font-weight: 600;
	}
	.app-logo {
		height: 80px;
		width: 160px;
		margin: 10px 0;
	}

	input[type="text"], input[type="password"]{
		width: 80%;
		background: #fff;
		border: 1px solid #cecece;
		padding: 10px;
		transition: all ease-in 300ms;
	
	}
	input[type="checkbox"]{
		background-color: #41bf4b;
	}
	input[type="text"]:focus, input[type="password"]:focus {
		padding: 10px 5px;
	}
	.btn-login {
		width: 40%;
		background-color: #41bf4b;
		border: 0;
		border-radius: 10px;
		color: #fff;
		padding: 5px 20px;
		text-transform: uppercase;
		transition: all ease-in 300ms;
		-webkit-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
			-moz-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
					box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
	}
	.btn-login:hover {
		padding: 10px 15px;
	}
	@media (max-width: 770px){
		.login-form {
			width: 60%;
		}
	}
	@media (max-width: 500px){
		.login-form {
			width: 80%;
		}
	}
</style>
