$(document).ready(function() {
  var firebaseRef = new Firebase("https://incandescent-torch-9625.firebaseio.com/");
  var testChild = firebaseRef.child('test');

  var testInput = document.getElementById('testInput');
  var testButton = document.getElementById('submit');
  var testMessage = document.getElementById('testMessage');

  testButton.addEventListener('click', function() {
    testChild.set(testInput.value);
    testInput.value = "";
  });

  testChild.on('value', function(snapshot) {
    testMessage.innerText = snapshot.val();
  });
});
