var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var postsRef = ref.child('posts');

var feedRef = "/#!/feed";

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

//$(document).ready(function() {
  //SIGN IN
  var authData = ref.getAuth();
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

  // SUBMIT POSTS
  $("#submitPost").click(function() {
    var newPostText = $("#newPost").val();
    if (newPostText) {
      var currentTime = new Date().getTime();
      postsRef.push().set({
        author_id: currentUserId,
        text: newPostText,
        created_at: currentTime
      });
      test_author_id++;
      $("#newPost").val("");
    } else {
      alert("You may not submit a blank post!");
    }
  });
  // GET POSTS
  postsRef.on("value", function(snapshot) { //currently ordered with oldest at top
    $("#posts").empty();
    snapshot.forEach(function(post) {
      var postContent = post.val().text;
      $("#posts").append("<hr>"+
                          "<div class='post'>" +
                            "<p class='content'>"+postContent+"</p>" +
                          "</div>");
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
//});
