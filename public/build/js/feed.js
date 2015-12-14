var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var postsRef = ref.child('posts');
var homeRef = "/";
var authData = ref.getAuth();

$(document).ready(function() {
  if (!authData) {
    console.log("User not logged in. Redirecting to login page...");
    window.location.href = homeRef;
  } else {
    var currentUserId = authData.uid;
    console.log("User " + currentUserId + " logged in.");
  }

  //SUBMIT POSTS
  $("#submitPost").click(function() {
    var newPostInputField = document.getElementById("newPost");
    var newPostText = newPostInputField.value;
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
  postsRef.on("value", function(snapshot) { //currently ordered with oldest at top
    $("#posts").empty();
    snapshot.forEach(function(post) {
      var postContent = post.val().text;
      $("#posts").append("<div class='post'>" +
                          "<p class='content'>"+postContent+"</p>" +
                         "</div>");
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
