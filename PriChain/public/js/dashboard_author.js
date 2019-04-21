$(document).ready(function () {
	if(!window.localStorage.getItem("auth_token")){
	  window.location.href = '/signin';
	}else {
        $('.sidenav').sidenav();
        M.updateTextFields();
        updateContractsTab();		
        getUserInfo();
        getRequestsCount();
        var usr = "";
        function getRequestsCount() {
            $.post('/publish/request/count', {
              user_token: window.localStorage.getItem("auth_token")}, function (response) {
                  console.log(response)
              if(response.success) {
                $('.request-numbers').html(response.result);
              }
            });
        }
        function getRequestsForMe() {
            $.post('/publish/request/get', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    if(response.result.length){
                        $('.load-data-tab').html(`<table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>For</th>
                                    <th>Distributer Name</th>
                                    <th>Time</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="request-table"></tbody>
                        </table>`);
                        response.result.forEach(request => {
                            var publication_info = JSON.parse(request.contract.contract_info);
                            console.log(publication_info)
                            $('#request-table').append(`
                                <tr>
                                    <td><img width="30" height="30" src="images/wall3.jpg"/> </td>
                                    <td>${publication_info.publication_title}
                                    <a id="contract-`+request.id+`" style="cursor: pointer;">
                                        <i class="material-icons">open_in_new</i>
                                    </a>
                                    </td>
                                    <td > <a href="#" id="distributer-`+request.id+`">${request.user.name} </a></td>
                                    <td>${request.createdAt}</td>
                                    <td>
                                        <a id="request-app-`+request.id+`" style="cursor: pointer;">
                                            <i class="material-icons">check</i>
                                        </a>
                                    </td>
                                    <td>
                                        <a id="request-delete-`+request.id+`" style="cursor: pointer;">
                                            <i class="material-icons">close</i>
                                        </a>
                                    </td>
                                </tr>
                            `);
                            $('#contract-'+request.id).click(function() {
                                console.log('#contract-'+request.contract.id);
                                getPublicationInfo(request.contract.contract_address);
                            })
                            $('#request-app-'+request.id).click(function() {
                                console.log('#request-app-'+request.id);
                                requestApprove(request);
                            })
                            $('#distributer-'+request.id).click(function() {
                                console.log(request.user)
                                getDistributer(request.user.email);
                            })
                            $('#request-delete-'+request.id).click(function() {
                                deleteRequest(request);
                            })
                        })
                    } else {
                        $('.load-data-tab').html("No Requests");
                    }
                } else {
                    $('.load-data-tab').html(response.result);
                }
            });
        }
        function getRequestsForMeApproved() {
            $.post('/publish/request/get/approved', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    if(response.result.length){
                        $('.load-data-tab').html(`
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>For</th>
                                        <th>Distributer Name</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody id="request-table"></tbody>
                            </table>
                        `);
                        response.result.forEach(request => {
                            var publication_info = JSON.parse(request.contract.contract_info);
                            console.log(publication_info)
                            $('#request-table').append(`
                                <tr>
                                    <td><img width="30" height="30" src="images/wall3.jpg"/> </td>
                                    <td>${publication_info.publication_title}
                                    <a id="contract-`+request.id+`-approved" style="cursor: pointer;">
                                        <i class="material-icons">open_in_new</i>
                                    </a>
                                    </td>
                                    <td> <a href="#" id="distributer-`+request.id+`-approved">${request.user.name} </a></td>
                                    <td>${request.createdAt}</td> 
                                </tr>
                            `);
                            $('#contract-'+request.id+"-approved").click(function() {
                                getPublicationInfo(request.contract.contract_address);
                            })
                            $('#distributer-'+request.id+"-approved").click(function() {
                                console.log(request.user)
                                getDistributer(request.user.email);
                            })
                        })
                    }else {
                        $('.load-data-tab').html("No Requests");
                    }
                }else {
                    $('.load-data-tab').html(response.result);
                }
            });
        }
        function requestApprove(request) {
            console.log("approve");
            $.post('/publish/request/approve', {
                user_token: window.localStorage.getItem("auth_token"),
                author_address: request.contract.user_address,
                author_contract_address: request.contract.user_contract_address,
                requested_contract_address: request.contract.contract_address,
                author_id: request.contract.user_id,
                contract_id: request.contract.id,
                request_blockchain_id: request.request_blockchain_id,
                request_id: request.id,
                publisher_id: request.publisher_id }, function (response) {
                if(response.success) {
                    M.toast({html: "<i class='material-icons medium'>apps</i>" +" Request Apporved!!"})
                    getRequestsCount();
                    getRequestsForMe();
                }else {
                    M.toast({html: "<i class='material-icons medium'>apps</i>" + response.result})
                }
            });
        }
        $("#requests-for-me").click(function() {
            getRequestsForMe();
        })
        $("#requests-for-me-approved").click(function() {
            getRequestsForMeApproved();
        })
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
                            <div class="col s10">
                                <div class="file-field input-field">
                                <div class="btn blue-grey darken-3">
                                    <span>File</span>
                                    <input id="publication-file" name="publication-file" type="file" class="validate file-upload blue-grey darken-3">
                                </div>
                                <div class="file-path-wrapper">
                                    <input  class="file-path validate"  type="text">
                                </div>
                                </div>
                            </div>
                            <div class="input-field col s2 blue-grey darken-3" style="padding-top:5px; padding-bottom:5px; border-radius: 2px;">
                                <button id="submit-file"    class="btn right file-upload transparent">  <i class="material-icons">file_upload</i> </button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                    <div class="row"> 
                    <div class="col s12 m12">    
                        <input hidden disabled id="disabled" id="publication-hash" type="text" class="validate file-path publication-hash">                        
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="publication-title" type="text" class="validate publication-title">
                                <label for="publication-title">Titile of book</label>
                            </div>
                        </div>
                        <button id="create-contract" class="btn right blue-grey darken-3">Create Contract</button>
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
                        console.log(result);
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
                        updateContractsTab();
                        M.toast({html: "<i class='material-icons medium'>apps</i>Publication Uploaded"})
                    }else {
                        M.toast({html: "<i class='material-icons medium'>apps</i>" + response.result})
                    }
                })
            });
        });

        function getUserInfo() {
            $.post('/dashboard/get/user/profile', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    $('.loader').addClass('hide');
                    $('.email').html(response.result.email);
                    $('.name').html(response.result.name);
                    $('.avatar').attr( "src" , response.result.picture_url.substring(7));
                }else {
                    window.location.href = "/logout"
                }
                usr =  response;
            });
        }

        function getPublicationInfo(contract_address) {
            $('.progress').removeClass('hide');
            $.post('/publish/blockchain/get', {
                user_token: window.localStorage.getItem("auth_token"),
                contract_address: contract_address}, function (response) {
                if(response.success) {
                    console.log(response.result['2'].substring(7));
                    $('.load-data-tab').html(`<h4 class="center">`+response.result['3']+`<h4>`);
                    $('.load-data-tab').append(`<iframe src="`+response.result['2'].substring(7)+`"
                        style="width:900px; height:500px;" frameborder="0"></iframe>`);
                }else {
                    $('.load-data-tab').append('Error');
                }
                $('.progress').addClass('hide');
            })
        }

        function deleteRequest(request) {
            $('.progress').removeClass('hide');
            $.post('/publish/request/delete', {
                user_token: window.localStorage.getItem("auth_token"),
                request_id : request.id}, function (response) {
                $('.progress').addClass('hide');
                if(response.success){
                    getRequestsForMe();
                    getRequestsCount();
                    M.toast({html: "<i class='material-icons medium'>apps</i>Request Deleted"})
                }else {
                    M.toast({html: "<i class='material-icons medium'>apps</i>" + "Some Error"})
                }
            }) 
        } 
        
        function updateContractsTab() {
            $('.progress').removeClass('hide');
            $('.load-data-tab').html('');
            $.post('/publish/getall/byme', {
                user_token: window.localStorage.getItem("auth_token")}, function (response) {
                if(response.success) {
                    response.result.forEach(contract => {
                        console.log(contract)
                        var publication_info = JSON.parse(contract.contract_info);
                        $('.load-data-tab').append(`  
                            <div class="col s4 m4">
                            <div class="card">
                                <div class="card-image">
                                <img height="200" src="`+publication_info.thumbnail.substr(7)+`">                              
                                </div>
                                <div class="card-content">
                                <span class="card-title">` +publication_info.publication_title+`</span>
                                <p>By : `+contract.authorInfo.name+`</p>
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

        function getDistributer(email) {
            $('.progress').removeClass('hide');
            console.log(email);
            $.post('/dashboard/get/distributer/profile', {
                user_token: window.localStorage.getItem("auth_token"),
                email : email}, function (response) {
                if(response.success) {
                    $('.load-data-tab').html(`<div class="col s12 m12">
                        <div class="card ">
                        <div class="row profile-card">
                            <div class="col s4 m4">
                            <img id="avatar-profile-tab" class=" circle" width="200" height="200" src="`+response.result.picture_url.substring(7)+`">
                            </div>
                            <div class="col  profile-name-card ">
                            <div id="name"><b>Name: </b>`+response.result.name+`</div>
                            <div id="email"><b>Email: </b>`+response.result.email+`</div>
                            <div id="mobile"><b>Mobile: </b>`+response.result.mobile+`</div>
                            <div id="blockchain-address"><b>BlockChain Address: </b>`+response.result.blockchain_address+`</div> 
                            </div>
                        </div>
                        </div>
                    </div>`);
                }else {
                    $('.load-data-tab').append(response.message);
                }
                $('.progress').addClass('hide');
            })
        }

        $('#profile-tab').click(function() {
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
                    <div id="blockchain-contract-address"><b>Contract Address: </b>`+usr.result.blockchain_contract_address+`</div> 
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
                        }else {
                            $('.progress').addClass('hide');
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