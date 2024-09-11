<template>
	<div>
		<!-- <NotLoggedInHeader/> -->
		<div class="login-form">
			<h2>
				<p class="text-upper">Ogbomoso Oluwalose C.I.C.S <br/>Management System</p>
			</h2>
			<img src="/img/app-logo.png" alt="unionName" class="image-fluid app-logo">
			<form @submit.prevent="authenticate()">
				<span class="error" v-if="error">{{error.message}}</span>
				<div v-if="isLoading">
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

					<div class="input-group">
						<input 
							type="password" 
							name="password" 
							id="password" 
							class="data-input"
							v-model="form.password" 
							placeholder="Password"
						>
					</div>
					<!-- <div class="input-group">
						<input type="checkbox" id="loginPass" @click="showPass()"> Show Password 
					</div> -->
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

export default {
		name: 'Login',
		data() {
			return {
				form: {
					userid: '',
					password: ''
				},
			};	
		},

		methods: {
			showPass(){
				// if (password.type == 'text') {
				// 	password.type = 'password'
				// }
				// else {
				// 	password.type = 'text'
				// }
			},
			...mapActions("app/auth/", ["login"]),
			...mapMutations("app/auth/", ['setError']),

			authenticate(){
				this.setError(null);
				let validation = new Validator(this.form, {
					userid: 'required',
					password: 'required'
				});

				if(validation.passes()){
					this.login(this.$data.form)
					.then(result=>{
						if(result){
							this.$router.replace("/");
						}
					});
				}else{
					const error = new Error("Invalid Login Detail.");
					this.setError(error);
				}
			}
		},
		computed: {
			...mapGetters("app/auth", ["isLoading", "error"])
		},
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
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		border-bottom: 1.6px solid #aaa;
		transition: all ease-in 300ms;
	
	}
	input[type="checkbox"]{
		background-color: #41bf4b;
	}
	input[type="text"]:focus, input[type="password"]:focus {
		padding: 10px 5px;
	}
	.btn-login {
		width: 100%;
		background-color: #41bf4b;
		border: 0;
		border-radius: 20px;
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
</style>
