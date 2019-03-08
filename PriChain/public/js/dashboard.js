$(document).ready(function () {
	if(!window.localStorage.getItem("auth_token")){
	  window.location.href = '/signin';
	}else {
        $('.sidenav').sidenav();
        var instance = M.Sidenav.getInstance($('.sidenav'));
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
                // $('#blockchain_privatekey').html("<b>Blockchain Private Key : </b>" + response.result.blockchain_privatekey)
                console.log(response.result.email)
            }else {
                window.location.href = "/logout"
            }
        })	

        $('#create-contract-link').click(function() {
            console.log("cantract")
            instance.close();
            $('.create-contract-tab').removeClass('hide');
        });
        $('#create-contract').click(function() {
            $('.progress').removeClass('hide');
            $.post('/contract/publish/create', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                $('.progress').addClass('hide');
                console.log(response);
                M.toast({html: "<i class='material-icons medium'>apps</i>Contract Creted"})
            })
        });

        $('#publication-form').submit(function(e){
            e.preventDefault();
            console.log("pdf ")
            $('.progress').removeClass('hide');
            $(this).ajaxSubmit({
              data: {},
              contentType: 'application/json',
              success: function(result){
                console.log('pdf uploaded and form submitted');   
                if(result.success) {
                  console.log(result.filepath)
                  $('.progress').addClass('hide');
                  $('.file-path').val(result.filepath);
                  $('.file-upload').addClass('hide');
                }else {
                    console.log(result.message)
                }
               },
              error: function (err) {
                  console.log(err);
              }
            });
        });
    }
});