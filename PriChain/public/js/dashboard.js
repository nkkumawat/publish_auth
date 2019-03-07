$(document).ready(function () {
	if(!window.localStorage.getItem("auth_token")){
	  window.location.href = '/signin';
	}else {
        $('.sidenav').sidenav();
        // $('.sidenav').open();
        var instance = M.Sidenav.getInstance($('.sidenav'));
        // instance.open();
        console.log(window.localStorage.getItem("auth_token"))
        $.post('/dashboard/get/user/profile', {
            user_token: window.localStorage.getItem("auth_token")}, function (response) {
            console.log(response)
            if(response.success) {
                $('.loader').addClass('hide');
                $('.main-page').removeClass('hide');
                $('.email').html(response.result.email);
                $('.name').html(response.result.name);
                $('#blockchain_address').html("<b>Blockchain Address : </b>" + response.result.blockchain_address)
                $('#blockchain_privatekey').html("<b>Blockchain Private Key : </b>" + response.result.blockchain_privatekey)
                console.log(response.result.email)
            }else {
                window.location.href = "/logout"
            }
        })	

        $('#create-contract-link').click(function() {
            console.log("cantract")
            $('.create-contract-tab').removeClass('hide');
        });
        $('#create-contract').click(function() {
            $.post('/contract/create', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                console.log(response)
                // if(response.success) {
                //     // $('.loader').addClass('hide');
                //     // $('.main-page').removeClass('hide');
                //     // $('.email').html(response.result.email);
                //     // $('.name').html(response.result.name);
                //     // $('#blockchain_address').html("<b>Blockchain Address : </b>" + response.result.blockchain_address)
                //     // $('#blockchain_privatekey').html("<b>Blockchain Private Key : </b>" + response.result.blockchain_privatekey)
                //     // console.log(response.result.email)
                // }
            })
        })
	}
})