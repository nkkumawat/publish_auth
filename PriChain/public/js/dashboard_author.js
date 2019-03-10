$(document).ready(function () {
	if(!window.localStorage.getItem("auth_token")){
	  window.location.href = '/signin';
	}else {
        $('.sidenav').sidenav();
        M.updateTextFields();

        updateContractsTab();		
        getUserInfo();
        getRequestsCount();

        function getRequestsCount() {
            $.post('/publish/request/count', {
              user_token: window.localStorage.getItem("auth_token")}, function (response) {
                  console.log(response)
              if(response.success) {
                $('.request-numbers').html(response.result);
              }else {
                // console.log("asdsdas")
              }
            });
          }

        $('#all-contract-link').click(function() {
            updateContractsTab();
        });
        $('#create-contract-link').click(function() {
            $('.load-data-tab').html(`  
            <div class="row">
            <div class="col s2 m2"></div>
            <div class="col s8 m8">
                <div class="card-panel">
                <h4 class="center">Upload New Book for publish</h4><br><br>
                <div class="row ">
                    <div class="col s2 m2"></div>
                    <div class="col s8 m8">
                    <div class="row">
                    <div class="col s12 m12">
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
                    </div>
                    <div class="row"> 
                    <div class="col s12 m12">
                        <div class="row">
                            <div class="input-field col s12">
                                <input disabled id="disabled" id="publication-hash" type="text" class="validate file-path publication-hash">
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
                    </div>
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
                $.post('/publish/create', {
                    user_token: window.localStorage.getItem("auth_token"),
                    publiaction_title: publiaction_title,
                    publication_hash: publication_hash}, function (response) {
                    $('.progress').addClass('hide');
                    if(response.success){
                    // console.log(response);
                        updateContractsTab();
                        M.toast({html: "<i class='material-icons medium'>apps</i>Contract Creted"})
                    }else {
                        M.toast({html: "<i class='material-icons medium'>apps</i>" + response.result})
                    }
                    
                   
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
        
        function updateContractsTab() {
            $('.progress').removeClass('hide');
            $('.load-data-tab').html('');
            $.post('/publish/getall/byme', {
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
                            <div class="card-action">
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
    }
});