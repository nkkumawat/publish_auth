
$(document).ready(function () {
    if(window.localStorage.getItem("authToken")){
        $('select').formSelect();
        M.updateTextFields();
        console.log("nk");
        $.post('/varifyUser', {auth_token : window.localStorage.getItem("authToken")}, function (response) {
            if(response.status == 200) {
                $("#user_email").html(response.data.user_email);
                $("#user_type").html(response.data.user_type);
                $("#blc_token").html(response.data.user_blockchain_account_token);
            }
        })
        $('#create-contract').click(function () {
            $('#msg').text("creating...");
            let blc_token = $("#blc_token").html();
            $.post('/createContract', {user_blockchain_account_token : blc_token}, function (response) {
                $('#msg').text(response);
                console.log(response);
            })
        });
    }else {
        window.location.href = '/';
    }
  })
  