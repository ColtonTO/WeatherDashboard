var searchBtn = document.querySelector(".searchBtn")
var cityDisplayEl = document.querySelector(".cityBox")
var cityNameEl = document.querySelector("#cityname")
const apiKey = "84041f365739eac82d6fc73abf633228"
var forecastEl = document.querySelector('.forecast')
var cityDate = document.querySelector('.city-title')
var cityHistory = $('.history')
var dailycontainer = $(".details");

var localCities = function () {
  var searchStorage = JSON.parse(localStorage.getItem("searchStorage"));
  if (searchStorage == null) {
    searchStorage = ["Seattle", "Los Angeles", "New York", "Denver"];
    localStorage.setItem("searchStorage", JSON.stringify(searchStorage));
  }
  var histContainer = $(".history");
  histContainer.html("");
  for (i in searchStorage) {
    var buttonEl = $("<button>")
    .addClass("list-group-item col-9 bg-secondary m-2")
    .attr ("id", "citySearchList")
    .attr("type", "button")
    .text(searchStorage[i]);
    histContainer.append(buttonEl);
  }
};

var updateHistory = function(city) {
  var searchStorage = JSON.parse(localStorage.getItem("searchStorage"));
  searchStorage.unshift(city);
  searchStorage.pop();
  localStorage.setItem("searchStorage", JSON.stringify(searchStorage));

  var listItems = $(".list-group-item");

  for (l in listItems) {

  listItems[l].textContent = searchStorage[l];
  }
}

var weather = function(city) { 
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" 
    + city + 
    "&appid=" 
    + apiKey
  )
  .then(function(resp) { return resp.json() }) 
  .then(function(data) {
  cityDate.textContent = city + " (" + dayjs().format("M/D/YYYY") + " )"

  var iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  $('#wicon').attr('src', iconurl);

  var temp = document.createElement("p")
  temp.textContent = "Temperature: " + (Math.round((data.main.temp-273.15)*9/5+32)) + String.fromCharCode(176) + "F";
  dailycontainer.append(temp);
  
  var wind = document.createElement("p")
  wind.textContent = "Wind Speed: " + data.wind.speed + " MPH"
  dailycontainer.append(wind);

  var humidity = document.createElement("p")
  humidity.textContent = "Humidity: " +data.main.humidity + "%" ;
  dailycontainer.append(humidity);
})
}


let getIndex = function(response) {
  var idx = 0 
  for (i=1;i<response.list.length;i++) {
    var currentTime = new Date(response.list[i].dt*1000);
    var lastTime = new Date(response.list[i-1].dt*1000);
    if (currentTime.getDay() !=lastTime.getDay()) {
      if (i == 8) {
        idx = 0;
        return idx;
      } else {
        idx = i;
        return idx;
      };
    };
  };
};

  var forecast = function(city) {
    var forecastContainerEl = $(".day-forecast")
    forecastContainerEl.html("");
    var city = cityNameEl.value.trim();
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
      response.json().then(function(response) {
        var idx=getIndex(response);

        for (i=0;i<5;i++) {
          var actualIdx = i * 8 + idx + 4;
          if (actualIdx>39) {actualIdx = 39};

          var timeCodeUnix = response.list[actualIdx].dt;
          var time = new Date(timeCodeUnix*1000).toLocaleDateString("en-US");
          var icon = response.list[actualIdx].weather[0].icon;
          var temp = response.list[actualIdx].main.temp
          var wind = response.list[actualIdx].wind.speed;
          var humidity = response.list[actualIdx].main.humidity

          var cardEl = $("<div>").addClass("col-2 card bg-secondary pt-2");
          var cardTitleEl = $("<h5>").addClass("card-title").text(time);
          var divEl = $("<div>").addClass("weather-icon");
          var cardIconEl = $("<img>").addClass("p-2").attr("src","https://openweathermap.org/img/w/" + icon + ".png");
          var cardTempEl = $("<p>").addClass("card-text").text("Temp: " + temp + " " + String.fromCharCode(176) + "F");
          var cardWindEl = $("<p>").addClass("card-text").text("Wind Speed: " + wind + " MPH");
          var cardHumidityEl = $("<p>").addClass("card-text").text("Humidity: " + humidity + "%");

          cardEl.append(cardTitleEl);
          divEl.append(cardIconEl);
          cardEl.append(cardTempEl);
          cardEl.append(cardWindEl);
          cardEl.append(cardHumidityEl);
          forecastContainerEl.append(cardEl);
        }
      })
    }).catch(function(error) {
      alert("OpenWeather connection not successful")
    })
  };
  var submitHandler = function(event) {
dailycontainer.html("");

target = $(event.target);
targetId = target.attr("id");

if (targetId === "citySearchList") {
    var city = target.text();

} else if (targetId === "search-submit") {
    var city = $("#cityname").val();
};

if (city) {
    weather(city);
    forecast(city);
    updateHistory(city);
} else {
    alert("Please enter a city")
}
}
localCities()

$("button").click(submitHandler);







