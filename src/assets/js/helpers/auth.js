import axios from 'vue-axios';

export function login(credentials){
	return new Promise((res, rej) => {
		axios.post('', credentials)
		.then((response) => {
				res(response.data)
		})
		.catch((err) => {
				rej('Invalid Username or Password')
		})
	})
}