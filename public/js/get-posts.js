var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var postsRef = ref.child('posts');

var currentUserId;

$(document).ready(function() {
  var authData = ref.getAuth();
  if (authData) {
    currentUserId = authData.uid;
  } else {
    currentUserId = "AUTH-FAIL"; //obvi this is just temporary
  }
  
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
