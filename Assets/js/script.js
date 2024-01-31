const api_key = "510d9b7edf30727293b8784b3262b4df";
let searchHistory = []; // to store search history

// event when the search button is clicked
$("#search-button").on('click', function() {
    const city = document.getElementById('city-input').value;
    getWeather(city);
    searchHistory.push(city);
  
    let historyButton = $("<button>").addClass("btn bg-neutral-200 w-full").text(city);
    $("#search-card").append(historyButton);
  });

// Search action is performed when user hits 'enter'
$("#city-input").on('keypress',function(e) {
    if(e.which == 13) { // 'Enter' key's keycode
        $('#search-button').click();
    }
});

// function to fetch weather data 
function getWeather(city){
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    if(data.cod === '200'){
      var currentDate = new Date();
      var dateStr = currentDate.toLocaleDateString();

      // Weather to emoji mapping
      const weatherEmoji = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
      };

      // Get weather description and corresponding emoji
      var weatherMain = data.list[0].weather[0].main;
      var weatherEmojiStr = weatherEmoji[weatherMain] || '';

      // Display the weather data
      $('#city-name').text(data.city.name + " (" + dateStr + ") " + " " + weatherEmojiStr);
      $('#city-temp').text("Temp: " + data.list[0].main.temp);
      $('#city-humidity').text("Humidity: " + data.list[0].main.humidity);
      $('#city-wind').text("Wind: " + data.list[0].wind.speed);

      // Clear out old data and show forecast container
      $("#forecast-cards").empty();
      $("#forecast-cards-container").removeClass("hidden");
  
      // Loop to fetch the next 5 days weather data
      for (let i = 1; i <= 5; i++) {
        if (data.list[i*8] && data.list[i*8].weather[0]) {
          let forecastCard = $("<div>").addClass("card bg-neutral-200 w-1/4 p-4");
          let date = new Date(data.list[i*8].dt_txt);

          forecastCard.append($("<h3>").addClass("card-title").text(date.toLocaleDateString() + " " + data.list[i*8].weather[0].main));
          forecastCard.append($("<p>").text("Temp: " + data.list[i*8].main.temp));
          forecastCard.append($("<p>").text("Humidity: " + data.list[i*8].main.humidity));
          
          $("#forecast-cards").append(forecastCard);
        }
      }
    }
  });
}

// event when a city in the search history is clicked
$("#search-history").on('click', function(e) {
  if(e.target && e.target.nodeName == "LI") {
    getWeather(e.target.textContent);
  }
});