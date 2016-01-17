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

  $("#newPost").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#submitPost").click();
    }
  });

  // GET POSTS + SUBMIT COMMENTS
  postsRef.on("child_added", function(snapshot, prevChildKey) {
    var postContent = snapshot.val().text;
    var postID = snapshot.key();
    createPost(postContent, postID);
    $("#"+postID+" > .heart").click(function() {
      toggleHeart(this);
    });
    $("#"+postID+" > .poop").click(function() {
      togglePoop(this);
    });
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
    $("#"+postID+" > .newComment").keyup(function(event) {
      if (event.keyCode == 13) {
        $("#"+postID+" > .submitComment").click();
      }
    });
  });

  // LOG OUT
  $("#logOut").click(function() {
    console.log("Logging out..");
    ref.unauth();
  });

});

function createPost(content, id) {
  $("#posts").prepend("<div class='post' id='"+id+"'>" +
                        "<img src='/images/heart.png' class='heart alignLeft' width='20px'>" +
                        "<img src='/images/poop.png' class='poop alignLeftBottom' width='20px'>" +
                        "<p class='content alignText'>"+content+"</p>" +
                        "<br>" +
                        "<input type='text' class='newComment' placeholder='Add comment'>" +
                        "<button class='submitComment'>Submit</button>" +
                        "<div class='comments'></div>" +
                     "</div>");
  commentsRef.orderByChild("post_id").equalTo(id).on("value", function(snapshot) {
    $("#"+id+" > .comments").empty();
    snapshot.forEach(function(comment) {
      var commentID = comment.key();
      var commentContent = comment.val().text;
      var authorID = comment.val().author_id;
      usersRef.child(authorID).on("value", function(userSnapshot) {
        $("#"+id+" > .comments").append("<div class='comment' id='"+commentID+"'>" +
                                          "<img src='/images/heart.png' class='heart alignLeft' width='15px'>" +
                                          "<img src='/images/poop.png' class='poop alignLeftBottom' width='15px'>" +
                                          "<p class='author'>"+userSnapshot.val().name+"</p>" +
                                          "<p class='commentContent alignText'>"+commentContent+"</p>" +
                                        "</div>");
      });
    });
  });
}

function toggleHeart(heart) {
  if ($(heart).attr("src") == "/images/heart.png") {
    $(heart).attr("src", "/images/heartfull.png");
  } else {
    $(heart).attr("src", "/images/heart.png");
  }
}

function togglePoop(poop) {
  if ($(poop).attr("src") == "/images/poop.png") {
    $(poop).attr("src", "/images/poopfull.png");
  } else {
    $(poop).attr("src", "/images/poop.png");
  }
}
