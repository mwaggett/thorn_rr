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
    createPost(postContent, postID, currentUserId);
    $("#"+postID+" > .heart").click(function() {
      toggleHeart(this);
      heartPost(postID, currentUserId);
    });
    $("#"+postID+" > .poop").click(function() {
      togglePoop(this);
      poopPost(postID, currentUserId);
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

function createPost(content, id, currentUserId) {
  $("#posts").prepend("<div class='post' id='"+id+"'>" +
                        "<img src='/images/heart.png' class='heart alignLeft' width='20px'>" +
                        "<img src='/images/poop.png' class='poop alignLeftBottom' width='20px'>" +
                        "<p class='content alignText'>"+content+"</p>" +
                        "<br>" +
                        "<input type='text' class='newComment' placeholder='Add comment'>" +
                        "<button class='submitComment'>Submit</button>" +
                        "<div class='comments'></div>" +
                     "</div>");
  commentsRef.orderByChild("post_id").equalTo(id).on("child_added", function(snapshot, prevChildKey) {
    var commentID = snapshot.key();
    var commentContent = snapshot.val().text;
    var authorID = snapshot.val().author_id;
    usersRef.child(authorID).on("value", function(userSnapshot) {
      $("#"+id+" > .comments").append("<div class='comment' id='"+commentID+"'>" +
                                        "<img src='/images/heart.png' class='heart alignLeft' width='15px'>" +
                                        "<img src='/images/poop.png' class='poop alignLeftBottom' width='15px'>" +
                                        "<p class='author'>"+userSnapshot.val().name+"</p>" +
                                        "<p class='commentContent alignText'>"+commentContent+"</p>" +
                                      "</div>");
      $("#"+commentID+" > .heart").click(function() {
        toggleHeart(this);
        heartPost(commentID, currentUserId);
      });
      $("#"+commentID+" > .poop").click(function() {
        togglePoop(this);
        poopPost(commentID, currentUserId);
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

function heartPost(postID, userID) {
  var heartRef = usersRef.child(userID).child("hearts").child(postID);
  heartRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      heartRef.set(false);
    } else {
      heartRef.set(true);
    }
  });
}

function poopPost(postID, userID) {
  var poopRef = usersRef.child(userID).child("poops").child(postID);
  poopRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      poopRef.set(false);
    } else {
      poopRef.set(true);
    }
  });
}
