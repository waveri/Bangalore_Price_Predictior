function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Reset the price display
  estPrice.innerHTML = "<h2></h2>";

  // --- Replaced alerts with error messages in the UI ---
  if (bhk <= 0) {
    estPrice.innerHTML = "<h2 style='color:red;'>Please select BHK.</h2>";
    return;
  }
  if (bathrooms <= 0) {
    estPrice.innerHTML = "<h2 style='color:red;'>Please select Bathrooms.</h2>";
    return;
  }
  if (!sqft.value || isNaN(parseFloat(sqft.value)) || parseFloat(sqft.value) <= 0) {
    estPrice.innerHTML = "<h2 style='color:red;'>Please enter a valid square foot value.</h2>";
    return;
  }
  if (!location.value) {
    estPrice.innerHTML = "<h2 style='color:red;'>Please select a location.</h2>";
    return;
  }
  // --- End of UI error checking ---


  //var url = "http://127.0.0.1:5000/predict_home_price";
  var url = "https://bangalore-home-prices-api.onrender.com";

  $.post(url, {
    total_sqft: parseFloat(sqft.value),
    bhk: bhk,
    bath: bathrooms,
    location: location.value
  }, function(data, status) {
    if (data.estimated_price) {
      console.log(data.estimated_price);
      estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
    } else if (data.error) {
      console.error(data.error);
      estPrice.innerHTML = "<h2 style='color:red;'>Error predicting price.</h2>";
    }
    console.log(status);
  }).fail(function() {
      // Handle server crash (500 error) or other request failures
      console.error("Request failed");
      estPrice.innerHTML = "<h2 style='color:red;'>Error: Could not connect to server.</h2>";
  });
}

function onPageLoad() {
  console.log("document loaded");
  //var url = "http://127.0.0.1:5000/get_location_names";
  var url = "https://bangalore-home-prices-api.onrender.com";

  // Clear dropdown first to show loading state
  var uiLocations = document.getElementById("uiLocations");
  $(uiLocations).empty();
  $(uiLocations).append(new Option("Loading locations..."));

  $.get(url, function(data, status) {
    console.log("got response for get_location_names request");
    if (data && data.locations) {
      var locations = data.locations;
      $(uiLocations).empty(); // Clear "Loading..."
      $(uiLocations).append(new Option("Choose a Location", "", true, true)); // Add default disabled option
      $('#uiLocations > option[value=""]').prop('disabled', true);


      for (var i in locations) {
        var opt = new Option(locations[i]);
        $(uiLocations).append(opt);
      }
    } else {
      // Handle the case where locations are still null
      $(uiLocations).empty();
      $(uiLocations).append(new Option("Error loading locations", ""));
      console.error("No locations found in response:", data);
    }
  }).fail(function() {
      // Handle error (e.g., server not running, CORS)
      $(uiLocations).empty();
      $(uiLocations).append(new Option("Failed to load locations", ""));
      console.error("get_location_names request failed");
  });
}

window.onload = onPageLoad;
