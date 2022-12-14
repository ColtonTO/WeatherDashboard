var searchBtn = document.querySelector(".btn-primary")
const apiKey = "84041f365739eac82d6fc73abf633228"
var searchInputEl = document.querySelector('#search-input');
var cityDisplayEl = document.querySelector('.cityBox')
var forecastEl = document.querySelector('.forecast')
var submitBtn = document.querySelector('.submitBtn')
var cityDate = document.querySelector('.city-title')
var cityHistory = document.querySelector('.history')
var dailycontainer = $(".details");

let weather = {
fetchWeather: function (city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" 
    + city + 
    "&appid=" 
    + apiKey
  )
  .then((response) => response.json())
  .then((data) => console.log(data))
}
}

searchBtn.addEventListener('click', function() {
    console.log("click")
});

weather.fetchWeather("Denver");



