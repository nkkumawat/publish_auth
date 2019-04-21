$(document).ready(function () {
	if(window.localStorage.getItem("auth_token")){
		window.location.href = '/dashboard';
	}else {
		$('select').formSelect();
		M.updateTextFields();
		$('#submit-signup').click(function () {
			const user_type = $('#user-type').val();
			const user_email = $('#user-email').val();
			const user_password = $('#user-password').val();
			const user_name = $('#user-name').val();
			const user_mobile = $('#user-mobile').val();
			$.post('/signup', {
				role : user_type ,
				email: user_email,
				password: user_password, 
				mobile: user_mobile,
				name: user_name}, function (response) {
				if(response.success){
					user_token = response.user_token;
					window.localStorage.setItem("auth_token", user_token);
					window.location.href = '/dashboard';
				}else {
					$('.msg').html(response.message)
				}
			})
		})
		$('#submit-signin').click(function() {
			window.location.href = '/signin'
		})
	}
})