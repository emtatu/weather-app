// const axios = require("axios").default;
const apiKey = "b99b221a13e030f76e6fae84e141eecf";

let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let today = days[now.getDay()];
let hour = now.getHours();
let min = now.getMinutes();
let localTime = document.querySelector(`#local-time`);
localTime.innerHTML = `${today}, ${hour}:${min} CET`;
let data;
let typeUnit = "metric";
let country;
let apiFlagUrl = `https://www.countryflags.io/${country}/shiny/32.png`;
const source = document.createElement("source");

function initVideoByWeather(weather) {
  var video = document.getElementById("video");
  video.pause();
  if (weather.includes("rain") || weather.includes("thunder")) {
    source.setAttribute("src", "videos/rain.mp4");
  } else if (weather.includes("sun")) {
    source.setAttribute("src", "videos/sun.mp4");
  } else if (weather.includes("cloud")) {
    source.setAttribute("src", "videos/cloud.mp4");
  } else {
    source.setAttribute("src", "videos/snow.mp4");
  }

  video.muted = "muted";
  video.loop = true;
  video.appendChild(source);
  video.play();
}

function playVideoByWeather(weather) {
  var video = document.getElementById("video");

  video.pause();

  if (weather.includes("rain") || weather.includes("thunder")) {
    source.setAttribute("src", "videos/rain.mp4");
  } else if (weather.includes("sun") || weather.includes("clear")) {
    source.setAttribute("src", "videos/sun.mp4");
  } else if (weather.includes("cloud")) {
    source.setAttribute("src", "videos/cloud.mp4");
  } else {
    source.setAttribute("src", "videos/snow.mp4");
  }
  video.load();
  video.play();
}
function changeHTML(response) {
  console.log("RESPONSE API", response);
  let temperature = Math.round(response.data.main.temp);
  let newTemp = document.querySelector("#degrees");
  newTemp.innerHTML = ` ${temperature}`;
  let feelsLikeDescr = response.data.main.feels_like.toFixed(1);
  let feelsLike = document.querySelector(`#feels-like`);
  feelsLike.innerHTML = `Feels like ${feelsLikeDescr} °C`;
  if (typeUnit !== "metric") {
    feelsLike.innerHTML = `Feels like ${feelsLikeDescr} °F`;
  }
  changeApiDescription(response.data.weather[0].main);
  weatherDetails(response.data);
}
function changeApiDescription(description) {
  let weatherDescription = document.querySelector(`#weather-description`);
  weatherDescription.innerHTML = `${description} `;
}

function onSearchCity(event) {
  event.preventDefault();
  let input = document.querySelector(".location");

  if (input.value.trim() === "") {
    return;
  }
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=${typeUnit}`
    )
    .then((response) => {
      data = response.data;
      country = response.data.sys.country;
      localTime.innerHTML = `${today}, ${hour}:${min} CET in ${input.value}`;
      input.value = "";
      changeHTML(response);
      playVideoByWeather(response.data.weather[0].main.toLowerCase());
    });
}
let search = document.querySelector(`.search`);
search.addEventListener("click", onSearchCity);

function changeMetrics(type) {
  typeUnit = type;
  if (data && type) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${data.name}&appid=${apiKey}&units=${typeUnit}`
      )
      .then(function (response) {
        data = response.data;
        country = response.data.sys.country;
        changeHTML(response);
        localTime.innerHTML = `${today}, ${hour}:${min} CET in ${response.data.name}`;
      });
  }
}

function currentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${pos.lat}&lon=${pos.lng}&appid=${apiKey}&units=${typeUnit}`
        )
        .then(function (response) {
          country = response.data.sys.country;
          localTime.innerHTML = `${today}, ${hour}:${min} CET in ${response.data.name}`;
          changeHTML(response);
          const weather = response.data.weather[0].main.toLowerCase();
          if (!data) {
            initVideoByWeather(weather);
          } else {
            data = response.data;
            playVideoByWeather(weather);
          }
        });
    });
  } else {
    // Browser doesn't support Geolocation
    alert("Browser not support");
  }
}

let button = document.querySelector("#current-location");
button.addEventListener("click", currentLocation);

function weatherDetails(data) {
  let windIntensty = document.querySelector(`#w-lol`);
  let windData = data.wind.speed;
  windIntensty.innerHTML = `Wind intensity is ${windData} km/h`;
  let pressure = document.querySelector(`#p-lol`);
  let pressureData = data.main.pressure;
  pressure.innerHTML = `Athm pressure @ ${pressureData} IN `;
  let humidity = document.querySelector(`#h-lol`);
  let humidityData = data.main.humidity;
  humidity.innerHTML = `Humidity is ${humidityData}%`;
}

currentLocation();
