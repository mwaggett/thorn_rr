var firebaseRef = new Firebase("https://incandescent-torch-9625.firebaseio.com/");

$(document).ready(function() {

  $("fb:login-button").click(function() {
    console.log("hey");
  });

  firebaseRef.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      var userName = authData.facebook.displayName;
      var welcomeBanner = document.getElementById('welcome-name');
      welcomeBanner.innerText = "Welcome, " + userName + "!";
      // firebaseRef.createUser({
      //   name : authData.facebook.displayName
      // }, function(error, userData) {
      //   if (error) {
      //     console.log("Error creating user:", error);
      //   } else {
      //     console.log("Successfully created user account with uid:", userData.uid);
      //   }
      // });
    }
  }, {scope: "public_profile, email"});
});
