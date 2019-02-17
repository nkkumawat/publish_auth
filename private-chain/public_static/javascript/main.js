
$(document).ready(function () {
  if(window.localStorage.getItem("authToken")){
    window.location.href = '/user';
  }else {
    $('select').formSelect();
    M.updateTextFields();
    console.log("Not Loggedin")
    $('#submit').click(function () {
      console.log("clicked");
      user_type = $('#user-type').val();
      user_email = $('#user-email').val();
      user_password = $('#user-password').val();
      $.post('user/createNew', {user_type : user_type , user_email: user_email , user_password: user_password}, function (response) {
        user_token = response;
        console.log(response);
        window.localStorage.setItem("authToken", response);
        window.location.href = '/user';
      })
    })
  }
  // $('#send').click(function () {
  //   $('#status').text("Sending...");
  //   let amount = $('#amount').val();
  //   let receiver = $('#receiver').val();
  //   $.post('/sendCoin', {amount : amount, sender : selectedAccount, receiver : receiver}, function (response) {
  //     $('#balance').text(response);
  //     $('#status').text("Sent!!");
  //   })
  // });
})
