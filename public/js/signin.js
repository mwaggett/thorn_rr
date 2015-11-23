var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");

function getName(authData) {
  switch(authData.provider) {
    case 'facebook':
    return authData.facebook.displayName;
  }
}

function getEmail(authData) {
  switch(authData.provider) {
    case 'facebook':
    return authData.facebook.email;
  }
}

$(document).ready(function() {
  $("#login").click(function() {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else if (authData) {
        console.log("Authenticated successfully with payload:", authData);
        ref.child("users").child(authData.uid).set({
          name: getName(authData),
          email: getEmail(authData)
        });
      }
    }, {scope: "public_profile, email"});
  });
});
