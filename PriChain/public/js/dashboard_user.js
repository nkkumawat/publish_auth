$(document).ready(function () {
	if(!window.localStorage.getItem("auth_token")){
	  window.location.href = '/signin';
	}else {
        $('.sidenav').sidenav();
        M.updateTextFields();

        updateContractsTab();		
        getUserInfo();
        var usr = "";
        $('#all-contract-link').click(function() {
            updateContractsTab();
        });

        $('#check-auth-link').click(function() {
            $('.load-data-tab').html(`  
            <div class="row">
            <div class="col s2 m2"></div>
            <div class="col s8 m8">
                <div class="card-panel">
                <h4 class="center">Upload for Check Authenticity </h4><br><br>
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
                        <input hidden disabled id="disabled" id="publication-hash" type="text" class="validate file-path publication-hash">
                        <div class="col s12 m12">
                            <button id="create-contract" class="btn right">Check</button>
                        </div>
                    </div>
                    </div>
                    <div class="col s2 m2 " ></div>
                </div>
                <div class row>
                    <div class="col s12 m12 " id="user-info-book"></div>
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
                var publication_hash = $('.publication-hash').val();
                $.post('/publish/checkauth', {
                    user_token: window.localStorage.getItem("auth_token"),
                    publication_hash: publication_hash}, function (response) {
                    $('.progress').addClass('hide');
                    console.log(response);
                    if(response.success){
                        M.toast({html: "<i class='material-icons medium'>apps</i>" + response.message});
                        if(response.message[0] == 'a'){
                            $("#user-info-book").html(` <br><br><br><div class="col s12 m12">
                                <div class="card ">
                                <div class="row profile-card">
                                    <div class="col s4 m4">
                                        <img id="avatar-profile-tab" class=" circle" width="200" height="200" src="`+response.result.picture_url.substring(7)+`">
                                    </div>
                                    <div class="col profile-name-card ">
                                    <div id="name"><b>Name: </b>`+response.result.name+`</div>
                                    <div id="email"><b>Email: </b>`+response.result.email+`</div>
                                    <div id="mobile"><b>Mobile: </b>`+response.result.mobile+`</div>
                                </div>
                                </div>
                                </div>
                            </div>`);
                        }else {
                            $("#user-info-book").html(``);   
                        }                
                    }else {
                        $("#user-info-book").html(``);
                        M.toast({html: "<i class='material-icons medium'>apps</i>" + response.result})
                    }
                })
            });
        });

        function updateContractsTab() {
            $('.progress').removeClass('hide');
            $('.load-data-tab').html('');
            $.post('/publish/getall', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    response.result.forEach(contract => {
                        var publication_info = JSON.parse(contract.contract_info);
                        // console.log(contract)
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
                      $('#contract-'+contract.id+"dwn").click(function() {
                        $('.progress').removeClass('hide');
                        $.post('/publish/blockchain/get', {
                            user_token: window.localStorage.getItem("auth_token"),
                            contract_address: contract.contract_address}, function (response) {
                            if(response.success) {
                                window.open( response.result['2'].substring(7), "_blank");
                                console.log(response.result['2'].substring(7), "narendra");
                            } else {
                                $('.load-data-tab').append('Error');
                            }
                            $('.progress').addClass('hide');
                        });
                      })
                      $('#contract-'+contract.id+'req').click(function() {
                        $.post('/publish/request', {
                          user_token: window.localStorage.getItem("auth_token"),
                          author_address: contract.user_address,
                          author_contract_address: contract.user_contract_address,
                          requested_contract_address: contract.contract_address,
                          ipfs_hash: publication_info.publication_hash,
                          author_id: contract.user_id,
                          contract_id: contract.id }, function (response) {
                          // console.log(response);
                          if(response.success) {
                            M.toast({html: "<i class='material-icons medium'>apps</i>" +" Publication Requested!!"})
                            getRequestsCount();
                          }else {
                            M.toast({html: "<i class='material-icons medium'>apps</i>" + response.result})
                          }
                          });
                        });
                    });
                    if(!response.result.length){
                        $('.load-data-tab').append('No Publication YET BY ANY PERSON');
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
                    // console.log(response.result.picture_url.substring(6))
                    $('.avatar').attr( "src" , response.result.picture_url.substring(7));
                    console.log(response.result.email)
                }else {
                    window.location.href = "/logout"
                }
                usr =  response;
            });
        }

        function getPublicationInfo(contract_address) {
            // console.log(contract_address);
            $('.progress').removeClass('hide');
            $.post('/publish/blockchain/get', {
                user_token: window.localStorage.getItem("auth_token"),
                contract_address: contract_address}, function (response) {
                if(response.success) {
                    $('.load-data-tab').html(`<h4 class="center">`+response.result['3']+`<h4>`);
                    $('.load-data-tab').append(`<iframe src="`+response.result['2'].substring(7)+`"
                            style="width:900px; height:500px;" frameborder="0">
                        </iframe>`);
                    
                }else {
                    $('.load-data-tab').append('Error');
                }
                $('.progress').addClass('hide');
            })
        }
        $('#profile-tab').click(function() {
            // var usr = getUserInfo(); 
            $('.load-data-tab').html(`<div class="col s12 m12">
                <div class="card ">
                <div class="row profile-card">
                    <div class="col s4 m4">
                    <img id="avatar-profile-tab" class=" circle" width="200" height="200" src="`+usr.result.picture_url.substring(7)+`">
                    <i class="Tiny material-icons" id="edit-picture">edit</i>
                    <form method="post" id="profile-picture-upload-form"  action="/uploader/upload/picture" enctype="multipart/form-data">
                        <input type="file" id="profile-pic-input"  name="profile-picture"  hidden />
                    </form>
                    </div>
                    <div class="col  profile-name-card ">
                    <div id="name"><b>Name: </b>`+usr.result.name+`</div>
                    <div id="email"><b>Email: </b>`+usr.result.email+`</div>
                    <div id="mobile"><b>Mobile: </b>`+usr.result.mobile+`</div>
                    <div id="blockchain-address"><b>BlockChain Address: </b>`+usr.result.blockchain_address+`</div> 
                    </div>
                </div>
                </div>
            </div>`);

            $("#edit-picture").click(function() {
                $("#profile-pic-input").trigger('click'); 
            })
            $('#profile-pic-input').change(function() {
                $('#profile-picture-upload-form').submit();
            });

            $('#profile-picture-upload-form').submit(function(e){
                e.preventDefault();
                $('.progress').removeClass('hide');
                $(this).ajaxSubmit({
                    data: {},
                    contentType: 'application/json',
                    success: function(result){  
                        if(result.success) {
                            
                            console.log(result);
                            updateProfilePicPath(result.filepath);
                            // $('.file-path').val(result.filepath);
                    
                        }else {
                            $('.progress').addClass('hide');
                            // $('.file-path').val("Error Upload Again");
                        }
                    },
                    error: function (err) {
                        $('.progress').addClass('hide');
                        $('.file-path').val("Error Upload Again");
                    }
                });
            });

            function updateProfilePicPath(newPath) {
                $.post('/update', {
                    user_token: window.localStorage.getItem("auth_token"),
                    picture_url : newPath}, function (response) {
                    $('.progress').addClass('hide');
                    if(response.success){
                        console.log(response.user.picture_url);
                        getUserInfo();
                        $('#avatar-profile-tab').attr("src" , response.user.picture_url.substring(7));
                        M.toast({html: "<i class='material-icons medium'>apps</i>Profile Picture Updated"})
                    }else {
                        M.toast({html: "<i class='material-icons medium'>apps</i>" + "Some Error"})
                    }
                })
            }
        })   
    }
});