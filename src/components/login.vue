<template>
	<div id="app">
		<div class="login-form">
			<img src="/img/app-logo.png" alt="Ogbomoso Oluwalose Cooperative Investment and Credit Union" class="image-fluid app-logo">
			<h2>
				{{ appTitle }}
				<p>Management System - Login Page</p>
			</h2>
			<form @submit.prevent="authenticate">
				<div class="input-group">
					<input 
						type="text" 
						name="username" 
						id="username"
						class="data-input" 
						placeholder="Username"
						:v-model="form.username"
						autofocus
					>
					<span class="error-message" id="username-error" ></span>
				</div>
				<div class="input-group">
					<input 
						type="password" 
						name="password" 
						id="password" 
						class="data-input"
						:v-model="form.password" 
						placeholder="Password"
					>
					<span class="error-message" id="password-error"></span>
				</div>
				<div class="text-center">
					<input type="submit" value="Login" class="btn-login" name="login">
				</div>
			</form>
			
		</div>
		
	</div>
</template>
<script>
import {login} from '@/assets/js/helpers/auth'

export default {
		name: 'login',
		data() {
			return {
				form: {
					username: 'admin',
					password: 'admin'
				},
				error: null
			};
		},

		methods: {
			authenticate(){
				this.$store.dispatch('login');
				
				login(this.$data.form)
				.then((res) =>{
					this.$store.commit('loginSuccess', res);
					this.$router.push({path: '/home'});
				})
				.catch((error) => {
					this.$store.commit('loginFailed', {error})
				})
			}
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
		#loginForm {
			margin: 30px 40px;
		}
		/* input[type="text"], input[type="password"]{
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			border-bottom: 1.6px solid #aaa;
			transition: all ease-in 300ms;
		
		}
		input[type="text"]:focus, input[type="password"]:focus {
			padding: 10px 5px;
		} */
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
