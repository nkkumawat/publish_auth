$(document).ready(function () {
	if(window.localStorage.getItem("auth_token")){
	  window.location.href = '/dashboard';
	}else {
	  $('select').formSelect();
	  M.updateTextFields();
	  console.log("Not Loggedin")
	  $('#submit-signup').click(function () {
			console.log("clicked");
			const user_type = $('#user-type').val();
			const user_email = $('#user-email').val();
			const user_password = $('#user-password').val();
			const user_name = $('#user-name').val();
			$.post('/signup', {
				role : user_type ,
				email: user_email,
				password: user_password, 
				name: user_name}, function (response) {
				user_token = response.user_token;
				// console.log(response)
				// console.log(user_token)
				window.localStorage.setItem("auth_token", user_token);
				console.log(user_token)
				window.location.href = '/dashboard';
			})
		})
		$('#submit-signin').click(function() {
			window.location.href = '/signin'
		})
	}
})