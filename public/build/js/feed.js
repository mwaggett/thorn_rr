var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var usersRef = ref.child('users');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');
var homeRef = "/";
var authData = ref.getAuth();
var currentUserId;

$(document).ready(function() {
  if (!authData) {
    console.log("User not logged in. Redirecting to login page...");
    window.location.href = homeRef;
  } else {
    currentUserId = authData.uid;
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
    addCommentsToPost(postID, currentUserId);
    $("#"+postID+" > .heart").click(function() {
      heartPost(postID, currentUserId);
    });
    $("#"+postID+" > .poop").click(function() {
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

  //COLOR HEARTS AND POOPS
  usersRef.child(currentUserId).child("hearts").on("value", function(snapshot) {
    snapshot.forEach(function(post) {
      colorHeart(post.key(), post.val());
    });
  });
  usersRef.child(currentUserId).child("poops").on("value", function(snapshot) {
    snapshot.forEach(function(post) {
      colorPoop(post.key(), post.val());
    });
  });

  // LOG OUT
  $("#logOut").click(function() {
    console.log("Logging out..");
    ref.unauth();
  });

});

function createPost(content, postID) {
  $("#posts").prepend("<div class='post' id='"+postID+"'>" +
                        "<img src='/images/heart.png' class='heart alignLeft' width='20px'>" +
                        "<img src='/images/poop.png' class='poop alignLeftBottom' width='20px'>" +
                        "<p class='content alignText'>"+content+"</p>" +
                        "<br>" +
                        "<input type='text' class='newComment' placeholder='Add comment'>" +
                        "<button class='submitComment'>Submit</button>" +
                        "<div class='comments'></div>" +
                     "</div>");
}

function addCommentsToPost(postID, currentUserId) {
  commentsRef.orderByChild("post_id").equalTo(postID).on("child_added", function(snapshot, prevChildKey) {
    var commentID = snapshot.key();
    var commentContent = snapshot.val().text;
    var authorID = snapshot.val().author_id;
    usersRef.child(authorID).on("value", function(userSnapshot) {
      $("#"+postID+" > .comments").append("<div class='comment' id='"+commentID+"'>" +
                                        "<img src='/images/heart.png' class='heart alignLeft' width='15px'>" +
                                        "<img src='/images/poop.png' class='poop alignLeftBottom' width='15px'>" +
                                        "<p class='author'>"+userSnapshot.val().name+"</p>" +
                                        "<p class='commentContent alignText'>"+commentContent+"</p>" +
                                      "</div>");
      $("#"+commentID+" > .heart").click(function() {
        heartComment(commentID, currentUserId);
      });
      $("#"+commentID+" > .poop").click(function() {
        poopComment(commentID, currentUserId);
      });
    });
  });
}

function colorHeart(postID, heartBool) {
  if (heartBool) {
    $("#"+postID+" > .heart").attr("src", "/images/heartfull.png");
  } else {
    $("#"+postID+" > .heart").attr("src", "/images/heart.png");
  }
}

function colorPoop(postID, poopBool) {
  if (poopBool) {
    $("#"+postID+" > .poop").attr("src", "/images/poopfull.png");
  } else {
    $("#"+postID+" > .poop").attr("src", "/images/poop.png");
  }
}

function heartPost(postID, userID) {
  var userHeartRef = usersRef.child(userID).child("hearts").child(postID);
  userHeartRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      userHeartRef.set(false);
    } else {
      userHeartRef.set(true);
    }
  });
  var postHeartRef = postsRef.child(postID).child("hearts").child(userID);
  postHeartRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      postHeartRef.set(false);
    } else {
      postHeartRef.set(true);
    }
  });
}

function poopPost(postID, userID) {
  var userPoopRef = usersRef.child(userID).child("poops").child(postID);
  userPoopRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      userPoopRef.set(false);
    } else {
      userPoopRef.set(true);
    }
  });
  var postPoopRef = postsRef.child(postID).child("poops").child(userID);
  postPoopRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      postPoopRef.set(false);
    } else {
      postPoopRef.set(true);
    }
  });
}

function heartComment(commentID, userID) {
  var userHeartRef = usersRef.child(userID).child("hearts").child(commentID);
  userHeartRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      userHeartRef.set(false);
    } else {
      userHeartRef.set(true);
    }
  });
  var commentHeartRef = commentsRef.child(commentID).child("hearts").child(userID);
  commentHeartRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      commentHeartRef.set(false);
    } else {
      commentHeartRef.set(true);
    }
  });
}

function poopComment(commentID, userID) {
  var userPoopRef = usersRef.child(userID).child("poops").child(commentID);
  userPoopRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      userPoopRef.set(false);
    } else {
      userPoopRef.set(true);
    }
  });
  var commentPoopRef = commentsRef.child(commentID).child("poops").child(userID);
  commentPoopRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      commentPoopRef.set(false);
    } else {
      commentPoopRef.set(true);
    }
  });
}
