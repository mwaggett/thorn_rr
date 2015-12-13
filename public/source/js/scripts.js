var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var postsRef = ref.child('posts');

var homeRef = "/#!";
var feedRef = "/#!/feed";

function loadScripts() {
  var loginButton = document.getElementById("login");
  var submitPostButton = document.getElementById("submitPost");

  if (loginButton != null) {
    console.log("On login page.");
    loadLoginPage(loginButton);
  }
  if (submitPostButton != null) {
    console.log("On feed page.");
    loadFeedPage(submitPostButton);
  }
}

function loadLoginPage(loginButton) {
  var authData = ref.getAuth();
  if (authData) {
    console.log("Authenticated user id: " + authData.uid + ", name: " + getName(authData));
    window.location.href = feedRef;
  }

  loginButton.addEventListener("click", function() {
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
}

function loadFeedPage(submitPostButton) {
  var authData = ref.getAuth();
  if (!authData) {
    console.log("User not logged in. Redirecting to login page...");
    window.location.href = homeRef;
  } else {
    console.log("User logged in.");
    var currentUserId = authData.uid;
  }

  // SUBMIT POSTS
  submitPostButton.addEventListener("click", function() {
    var newPostInputField = document.getElementById("newPost");
    var newPostText = newPostInputField.value;
    console.log(newPostText)
    if (newPostText) {
      var currentTime = new Date().getTime();
      postsRef.push().set({
        author_id: currentUserId,
        text: newPostText,
        created_at: currentTime
      });
      newPostInputField.value = "";
    } else {
      alert("You may not submit a blank post!");
    }
  });
  // GET POSTS
  var postsDiv = document.getElementById("posts");
  postsRef.on("value", function(snapshot) { //currently ordered with oldest at top
    postsDiv.innerHTML = "";
    snapshot.forEach(function(post) {
      var postContent = post.val().text;
      console.log(postContent)
      var lineBreak = document.createElement("HR");
      var postDiv = document.createElement("DIV");
      postDiv.className = "post";
      var postParagraph = document.createElement("P");
      postParagraph.className = "content";
      var postTextNode = document.createTextNode(postContent);
      postParagraph.appendChild(postTextNode);
      postDiv.appendChild(postParagraph);
      postsDiv.appendChild(lineBreak);
      postsDiv.appendChild(postDiv);
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

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
