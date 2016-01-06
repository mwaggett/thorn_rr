var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var usersRef = ref.child('users');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');
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
    var newPostText = $("#newPost").val();
    if (newPostText) {
      var currentTime = new Date().getTime();
      postsRef.push().set({
        author_id: currentUserId,
        text: newPostText,
        created_at: currentTime
      });
      $("#newPost").val("");
    } else {
      alert("You may not submit a blank post!");
    }
  });

  // GET POSTS + SUBMIT COMMENTS
  postsRef.on("value", function(snapshot) { //currently ordered with oldest at top
    $("#posts").empty();
    snapshot.forEach(function(post) {
      var postContent = post.val().text;
      var postID = post.key();
      createPost(postContent, postID);
      $("#"+postID+" > .submitComment").click(function() {
        var newCommentText = $("#"+postID+" > .newComment").val();
        if (newCommentText) {
          var currentTime = new Date().getTime();
          commentsRef.push().set({
            author_id: currentUserId,
            text: newCommentText,
            post_id: postID,
            created_at: currentTime
          });
          $(".newComment").val("");
        } else {
          alert("You may not submit at blank comment!");
        }
      });
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $("#logOut").click(function() {
    console.log("Logging out..");
    ref.unauth();
  });

});

function createPost(content, id) {
  $("#posts").prepend("<div class='post' id='"+id+"'>" +
                        "<img src='/images/heart.png' class='alignLeft' width='20px'>" +
                        "<img src='/images/poop.png' class='alignLeftBottom' width='20px'>" +
                        "<p class='content alignText'>"+content+"</p>" +
                        "<br>" +
                        "<input type='text' class='newComment' placeholder='Add comment'>" +
                        "<button class='submitComment'>Submit</button>" +
                        "<div class='comments'></div>" +
                     "</div>");
  commentsRef.orderByChild("post_id").equalTo(id).on("value", function(snapshot) {
    $("#"+id+" > .comments").empty();
    snapshot.forEach(function(comment) {
      var commentContent = comment.val().text;
      var authorId = comment.val().author_id;
      usersRef.child(authorId).on("value", function(userSnapshot) {
        $("#"+id+" > .comments").prepend("<div class='comment'>" +
                                          "<p class='author'>"+userSnapshot.val().name+"</p>" +
                                          "<p class='content'>"+commentContent+"</p>" +
                                        "</div>");
      });
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}
