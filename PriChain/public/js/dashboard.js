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
        $('#create-contract-link').click(function() {
            $('.load-data-tab').html(`  <div class="row">
            <div class="col s2 m2"></div>
            <div class="col s10 m10">
                <div class="row ">
                    <div class="row">
                      <div class="col s4">
                        <p id="blockchain_address"></p>
                        <p id="blockchain_privatekey"></p>
                      </div>
                    </div>
                    <div class="row">
                        <div class="col s2 m2"></div>
                        <div class="col 84 m8">
                          <form method="post"  action="/uploader/upload" enctype="multipart/form-data" id="publication-form">
                          <div class="row">
                            <div class="col s8">
                              <div class="file-field input-field">
                                <div class="btn">
                                  <span>File</span>
                                  <input id="publication-file" name="publication-file" type="file" class="validate file-upload">
                                </div>
                                <div class="file-path-wrapper">
                                  <input class="file-path validate"  type="text">
                                </div>
                              </div>
                            </div>
                            <div class="input-field col s4">
                                <button id="submit-file" class="btn right file-upload">Upload File</button>
                              </div>
                          </div>
                          </form>
                        </div>
                        <div class="col s2 m2"></div> 
                    </div>
                        <div class="row">
                          <div class="col s2 m2"></div> 
                          <div class="col s8 m8">
                              <div class="row">
                                  <div class="input-field col s12">
                                    <input disabled id="disabled" id="publication-hash" type="text" class="validate file-path publication-hash">
                                    <!-- <label for="disabled">Image Hash</label> -->
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="input-field col s12">
                                    <input id="publication-title" type="text" class="validate publication-title">
                                    <label for="publication-title">Titile of book</label>
                                  </div>
                                </div>
                            <button id="create-contract" class="btn right">Create Contract</button>
                          </div>
                          <div class="col s2 m2"></div> 
                        </div>
                    </div>
            </div>
          </div>`);
          $('#publication-form').submit(function(e){
                e.preventDefault();
                $('.progress').removeClass('hide');
                $(this).ajaxSubmit({
                    data: {},
                    contentType: 'application/json',
                    success: function(result){  
                        if(result.success) {
                        $('.progress').addClass('hide');
                        $('.file-path').val(result.filepath);
                    
                        }else {
                            $('.progress').addClass('hide');
                            $('.file-path').val("Error Upload Again");
                        }
                    },
                    error: function (err) {
                        $('.progress').addClass('hide');
                        $('.file-path').val("Error Upload Again");
                    }
                });
            });
            $('#create-contract').click(function() {
                $('.progress').removeClass('hide');
                var publiaction_title = $('.publication-title').val();
                var publication_hash = $('.publication-hash').val();
                $.post('/contract/publish/create', {
                    user_token: window.localStorage.getItem("auth_token"),
                    publiaction_title: publiaction_title,
                    publication_hash: publication_hash}, function (response) {
                    $('.progress').addClass('hide');
                    // console.log(response);
                    M.toast({html: "<i class='material-icons medium'>apps</i>Contract Creted"})
                    updateContractsTab();
                   
                })
            });
        });
        

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
        
        function updateContractsTab() {
            $('.progress').removeClass('hide');
            $('.load-data-tab').html('');
            $.post('/contract/publish/getall', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    // $('.load-data-tab').html(`<br><br><br>`);
                    response.result.forEach(contract => {
                        var publication_info = JSON.parse(contract.contract_info);
                        $('.load-data-tab').append(`
                            <input id="user_address`+contract.id+`" class="hide" value="`+contract.user.blockchain_address+`">
                            <input id="contract_address`+contract.id+`" class="hide" value="`+contract.contract_address+`">
                            <div class="col s3 m3>
                            <div class="card">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img class="activator" height="100" src="images/wall1.png">
                            </div>
                            <div class="card-content">
                                <span class="card-title activator grey-text text-darken-4">`+publication_info.publication_title+`</span>
                                <p>By: `+contract.user.name+`</p>
                                <p>`+contract.createdAt+`</p>
                            </div>
                            </div>
                            </div>
                            <div class="col s1 m1></div>
                        `)
                    });

                }else {
                    $('.load-data-tab').append('No Publications');
                }
                $('.progress').addClass('hide');
            })	
        } 
    }
});