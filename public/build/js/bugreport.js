var ref = new Firebase("https://incandescent-torch-9625.firebaseio.com");
var feedbackRef = ref.child("feedback");
var feedRef = "/feed.html";

$(document).ready(function() {
  $("#bugSend").click(function() {
    var feedback = $("#bugReport").val();
    feedbackRef.push().set(feedback);
    $("#bugReport").val("");
    window.location.href = feedRef;
  });
});
