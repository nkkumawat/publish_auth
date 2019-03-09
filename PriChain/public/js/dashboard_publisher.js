$(document).ready(function () {
	if(!window.localStorage.getItem("auth_token")){
	  window.location.href = '/signin';
	}else {
        $('.sidenav').sidenav();
        M.updateTextFields();

        updateContractsTab();		
        getUserInfo();

        $('#all-contract-link').click(function() {
            updateContractsTab();
        });
        
        
        function updateContractsTab() {
            $('.progress').removeClass('hide');
            $('.load-data-tab').html('');
            $.post('/publish/getall', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    response.result.forEach(contract => {
                        var publication_info = JSON.parse(contract.contract_info);
                        $('.load-data-tab').append(`  
                        <div class="col s4 m4">
                          <div class="card">
                            <div class="card-image">
                              <img height="200" src="../images/wall2.jpg">
                              <span class="card-title">` +publication_info.publication_title+`</span>
                            </div>
                            <div class="card-content">
                              <p>Created By : `+contract.user.name+`</p>
                            </div>
                            <div class="card-action ">
                              <a id="contract-`+contract.id+`dwn" style="cursor: pointer;">
                                <i class="material-icons">file_download</i>
                              </a>
                              <a id="contract-`+contract.id+`" style="cursor: pointer;">
                                <i class="material-icons">open_in_new</i>
                              </a>
                            </div>
                          </div>
                        </div>
                      `);
                      $('#contract-'+contract.id).click(function() {
                          getPublicationInfo(contract.contract_address);
                      })
                    });
                    if(!response.result.length){
                        $('.load-data-tab').append('No Publication By YOu');
                    }

                }else {
                    $('.load-data-tab').append('Some Error occured ! Try Again!!!!');
                }
                $('.progress').addClass('hide');
            })	
        } 
            
        

        function getUserInfo() {
            $.post('/dashboard/get/user/profile', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                console.log(response)
                if(response.success) {
                    $('.loader').addClass('hide');
                    $('.email').html(response.result.email);
                    $('.name').html(response.result.name);
                    console.log(response.result.email)
                }else {
                    window.location.href = "/logout"
                }
            });
        }

        function getPublicationInfo(contract_address) {
            console.log(contract_address);
            $('.progress').removeClass('hide');
            $.post('/publish/blockchain/get', {
                user_token: window.localStorage.getItem("auth_token"),
                contract_address: contract_address}, function (response) {
                if(response.success) {
                    $('.load-data-tab').html(`<h4 class="center">`+response.result['3']+`<h4>`);
                    $('.load-data-tab').append(`<iframe src="`+response.result['2'].substring(6)+`"
                            style="width:900px; height:500px;" frameborder="0">
                        </iframe>`);
                    
                }else {
                    $('.load-data-tab').append('Error');
                }
                $('.progress').addClass('hide');
            })
        }
        
        
    }
});