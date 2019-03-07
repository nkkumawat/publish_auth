$(document).ready(function () {
	if(window.localStorage.getItem("auth_token")){
	  window.location.href = '/dashboard';
	}else {
	  $('select').formSelect();
	  M.updateTextFields();
	  console.log("Not Loggedin")
	  $('#submit-signin').click(function () {
			console.log("clicked");
			user_email = $('#user-email').val();
			user_password = $('#user-password').val();
			$.post('/signin', {
				email: user_email, 
				password: user_password }, function (response) {
				user_token = response.user_token;
				// console.log(response)
				// console.log(user_token)
				window.localStorage.setItem("auth_token", user_token);
				window.location.href = '/dashboard';
			})
		})
		$('#submit-signup').click(function() {
			window.location.href = '/signup'
		})
	}
})