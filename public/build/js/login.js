var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var feedRef = "/feed.html";
var authData = ref.getAuth();

$(document).ready(function() {
  if (authData) {
    console.log("Authenticated user id: " + authData.uid + ", name: " + getName(authData));
    window.location.href = feedRef;
  }

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
        window.location.href = feedRef;
      }
    }, {scope: "public_profile, email"});
  });

  // var loginButton = document.getElementById("login");
  // loginButton.addEventListener("click", function() {
  //   ref.authWithOAuthPopup("facebook", function(error, authData) {
  //     if (error) {
  //       console.log("Login Failed!", error);
  //     } else if (authData) {
  //       console.log("Authenticated successfully with payload:", authData);
  //       ref.child("users").child(authData.uid).set({
  //         name: getName(authData),
  //         email: getEmail(authData)
  //       });
  //       window.location.href = feedRef;
  //     }
  //   }, {scope: "public_profile, email"});
  // });
});

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
