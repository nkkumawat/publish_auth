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
        $('#all-contract-link').click(function() {
            updateContractsTab();
        });
        $("#requests-by-me-approved").click(function() {
          getRequestsForMeApproved();
        });
        $("#requests-by-me").click(function() {
          getRequestsForMe();
        })

        function getRequestsForMeApproved() {    
          $.post('/publish/request/get/approved', {
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
                          </tr>
                      </thead>
                      <tbody id="request-table"></tbody>
                  </table>`);
                response.result.forEach(request => {
                  //   console.log(request)
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
                          console.log(request.authorInfo)
                          // getAuthor(request.user.email);
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
                          <th>Time</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody id="request-table"></tbody>
                </table>`);
              response.result.forEach(request => {
                //   console.log(request)
                  var publication_info = JSON.parse(request.contract.contract_info);
                  console.log(publication_info)
                  $('#request-table').append(`
                    <tr>
                      <td>
                        <img width="30" height="30" src="images/wall3.jpg"/> 
                      </td>
                      <td>${publication_info.publication_title}
                        <a id="contract-`+request.id+`" style="cursor: pointer;">
                        <i class="material-icons">open_in_new</i>
                      </a>
                      </td>                        
                      <td>${request.createdAt}</td>
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
                    $('#request-delete-'+request.id).click(function() {
                        // getPublicationInfo(request.contract.contract_address);
                        deleteRequest(request);
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
                            <img height="200" src="`+publication_info.thumbnail.substr(7)+`">
                             
                            </div>
                            <div class="card-content">
                            <span class="card-title">` +publication_info.publication_title+`</span>
                              <p>By : `+contract.authorInfo.name+`</p>
                            </div>
                            <div class="card-action ">
                              <a id="contract-`+contract.id+`dwn" style="cursor: pointer;">
                                <i class="material-icons">file_download</i>
                              </a>
                              <a id="contract-`+contract.id+`" style="cursor: pointer;">
                                <i class="material-icons">open_in_new</i>
                              </a>
                              <a id="contract-`+contract.id+`req" style="cursor: pointer;">
                                <i class="material-icons">publish</i>
                              </a>
                            </div>
                          </div>
                        </div>
                      `);
                      $('#contract-'+contract.id).click(function() {
                          getPublicationInfo(contract.contract_address);
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
        
        function getRequestsCount() {
          // console.log("count")
          $.post('/publish/request/count', {
            user_token: window.localStorage.getItem("auth_token")}, function (response) {
            // console.log(response);
            if(response.success) {
              // console.log(response.result)
              $('.request-numbers').html(response.result);
            }else {
              // console.log("asdsdas")
            }
          });
        }
        function getUserInfo() {
			$.post('/dashboard/get/user/profile', {
				user_token: window.localStorage.getItem("auth_token")}, function (response) {
				console.log(response)
				if(response.success) {
					$('.loader').addClass('hide');
					$('.email').html(response.result.email);
					$('.name').html(response.result.name);
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
                    $('.load-data-tab').append('Server side error ');
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
						} else {
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