
// Constant time increment string array for the table
const GRAPH_LABELS = ["0", "5", "10", "15", "20"];

// Integer user energy level array
let energy_data_array = new Array(5);

// Realtime database initialization
let db = firebase.database();

// Side navbar user informatics/metrics
let user_greeting = document.getElementById("user-greeting");
let user_profile_pic = document.getElementById("user-profile-pic");
let user_info = document.getElementById("user-info");

// This function appends data to the chart
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

// This function remvoes data from the chart
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

// Event Listener for DOM intro text append
firebase.auth().onAuthStateChanged(function(user) {

  // If the current user is verified, continue with webpage updates
  if (user !== null) {

    /* Draw side nav bar info */

    // Get the user's email from firebase
    let email = user.email;
    // The user's username is their email's part before the '@' symbol... (with a '@' symbol at the front because it looks cooler)
    let username = email.substring(0, email.indexOf("@"));
    // Append sample message for greeting. TODO: check time and append differeing texts (e.g., Good evening, Good morning .etc)
    let user_greeting_tn = document.createTextNode("Welcome back, " + username);
    let user_info_tn = document.createTextNode("@" + username + "   " + String.fromCodePoint(0x1F971));

    // Create html elements to append the text nodes
    let user_greeting_el = document.createElement("h1");
    let user_info_el = document.createElement("h2");

    // Create the image for the user profile picture
    let user_profile_pic_img = document.createElement("img");
    user_profile_pic_img.setAttribute("src", "../../assets/blank_profile.png");
    user_profile_pic_img.style.width = "40vh";
    user_profile_pic_img.style.height = "50vh";

    // Append the text nodes to html elements and attach under associated profile section
    user_greeting.appendChild(user_greeting_el.appendChild(user_greeting_tn));
    user_profile_pic.appendChild(user_profile_pic_img);
    user_info.appendChild(user_info_el.appendChild(user_info_tn));


    /* Fetch data from the realtime database and pipe/feed it into the widgets */

    // Fetch a realtime database reference object
    let db_ref_object = db.ref().child("users").child(username);

    // Retrieve the periodic 'value' updates and add a listener
    db_ref_object.on("value", function(snapshot) {

      // Retrieve the current non-sql data tree (as json)
      let snap_val = snapshot.val();
      let snap_val_json_string = JSON.stringify(snap_val, null);
      // Get the entire array parsed with ("energy":)
      let snap_val_array = snap_val_json_string.split("\"energy\":");

      // Iterate over the last 5 values in the snapshot values string array
      for (let i=snap_val_array.length-1; i>(snap_val_array.length-6); i--) {

          // Get the first and second characters of the integer (note that index 0 is skipped because it is the head of the tree)
          let fc = snap_val_array[i].charAt(0);
          let sc = snap_val_array[i].charAt(1);

          // If the second character is a 0, it is 10 (the only 2 character number accepted)
          if (sc === "0") {
            energy_data_array[(snap_val_array.length-1) - i] = parseInt(fc + sc);
          } else {
            energy_data_array[(snap_val_array.length-1) - i] = parseInt(fc);
          }

      }

    });

    /* Build and draw the energy level graph */
    removeData(chart);

  }

});

// Draw graph using Chart.js
var ctx = document.getElementById('sleep-graph').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: GRAPH_LABELS,
        datasets: [{
            label: 'Energy',
            backgroundColor: '#70ff92',
            borderColor: '#30ff4c',
            data: energy_data_array
        }]
    },

    // Configuration options go here
    options: {}
});

// Every 5 seconds, call a periodic function that updates the sleep graph/chart
setInterval(function() {
  // Remove and re-apply data
  addData(chart, GRAPH_LABELS, energy_data_array);
  removeData(chart);
}, 5000);
