function getLocation(email, password) {
	showIndicator();
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			hideLoader();
			createNewUser(email, password, position.coords.latitude, position.coords.longitude);
		}, function(error){
			hideLoader();
			createNewUser(email, password, null, null);
		});
	}
	else {
		hideLoader();
		createNewUser(email, password, null, null);
	}
}

function createNewUser(email, password, latitude, longitude) {
	var newUser = {
		email: email,
		password: password,
		latitude: latitude,
		longitude: longitude
	};

	$.ajax({
		type: "POST",
		url: "/api/new-user",
		data: newUser
	}).then(function(error){
		if(error){
			console.log(error);
			if("errors" in error) {
				if(error.errors[0].path === "email")
					$("form p").text("The email you entered is not valid.");
				else if(error.errors[0].path === "password")
					$("form p").text("The password you entered is not valid.");
			}
			else if ("original" in error && "code" in error.original && error.original.code === "ER_DUP_ENTRY")
				$("form p").text("That email already exists");
			else
				$("form p").text("Please allow us to access your location.");
		}
		else {
			window.location.replace("/profile");
		}
	});
}

$(document).ready(function(){
	$(".signUp").on("click", function(event){
		event.preventDefault();
		var newEmail = $("input[name=email]").val();
		var newPassword = $("input[name=password]").val();

		$("input[name=email]").val("");
		$("input[name=password]").val("");

		getLocation(newEmail, newPassword);
	});

	$(".signIn").on("click", function(event){
		event.preventDefault();
		var email = $("input[name=email]").val();
		var password = $("input[name=password]").val();

		var credentials = {
			email: email,
			password: password
		};

		$("input[name=email]").val("");
		$("input[name=password]").val("");

		$.ajax({
			type: "POST",
			url: "/api/login-user",
			data: credentials
		}).then(function(data){
			if(data === "error")
				$("form p").text("Sorry. There was a login error");
			else if(data === "user")
				$("form p").text("We could not find that username");
			else if(data === "password")
				$("form p").text("That password is incorrect");
			else {
				window.location.replace("/judgement");
			}
		});
	});
});


function showIndicator(){
    $("#loader").addClass("loader");
}

function hideLoader(){
    $("#loader").removeClass("loader");
}

//pic looping starts//
$(document).ready(function() {
  var counter = 0;
  setInterval(myFunc, 9000);
  function myFunc() {
    var newImage = counter;
    $("#changingPic img").eq(newImage).addClass("opaque");
    counter++;
  }
});
// pic looping ends//
