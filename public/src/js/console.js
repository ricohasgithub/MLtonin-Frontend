
// Firestore initialization
let db = firebase.firestore(app);

// Side navbar user informatics/metrics
let user_greeting = document.getElementById("user-greeting");
let user_profile_pic = document.getElementById("user-profile-pic");
let user_info = document.getElementById("user-info");

// Event Listener for DOM intro text append
firebase.auth().onAuthStateChanged(function(user) {

  // If the current user is verified, continue with webpage updates
  if (user !== null) {

    // Get the user's email from firebase
    let email = user.email;
    // The user's username is their email's part before the '@' symbol... (with a '@' symbol at the front because it looks cooler)
    let username = email.substring(0, email.indexOf("@"));
    // Append sample message for greeting. TODO: check time and append differeing texts (e.g., Good evening, Good morning .etc)
    let user_greeting_tn = document.createTextNode("Welcome back " + username);
    let user_info_tn = document.createTextNode(username);

    // Create html elements to append the text nodes
    let user_greeting_el = document.createElement("h1");
    let user_info_el = document.createElement("h2");

    // Append the text nodes to html elements and attach under associated profile section
    user_greeting.appendChild(user_greeting_el.appendChild(user_greeting_tn));
    user_info.appendChild(user_info_el.appendChild(user_info_tn));

  }

});
