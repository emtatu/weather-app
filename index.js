// Global variable
const apiKey = "b99b221a13e030f76e6fae84e141eecf";
const now = new Date();
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const today = days[now.getDay()];
const hour = now.getHours();
const min = now.getMinutes();
const source = document.createElement("source");
const localTime = document.querySelector(`#local-time`);
let data = null;
let typeUnit = "metric";

// All the EventListener
const search = document.querySelector(`.search`);
search.addEventListener("click", onSearchCity);
const button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentLocation);
const celsius = document.querySelector(`#celsius-link`);
celsius.addEventListener("click", function () {
  onChangeMetrics("metric");
});
const far = document.querySelector("#farenheit-link");
far.addEventListener("click", function () {
  onChangeMetrics("imperial");
});

// Event function
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
      localTime.innerHTML = `${input.value}, ${today}, ${hour}:${min} CET`;
      input.value = "";
      changeHTML(response);
      playVideoByWeather(response.data.weather[0].main.toLowerCase());
    });
}
function onChangeMetrics(type) {
  debugger;
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
function getCurrentLocation() {
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
          const weather = response.data.weather[0].main.toLowerCase();
          if (!data) {
            initVideoByWeather(weather);
          } else {
            playVideoByWeather(weather);
          }
          data = response.data;
          country = response.data.sys.country;
          localTime.innerHTML = ` ${response.data.name}, ${today}, ${hour}:${min} CET `;
          changeHTML(response);
        });
    });
  } else {
    // Browser doesn't support Geolocation
    alert("Browser not support");
  }
}
function getNextSevenDaysByCoordonate(coordonate) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
        exclude=${part}&appid=${apiKey}`
    )
    .then(function (response) {
      console.log(response);
    });
}

// Change html from data
function changeHTML(response) {
  console.log("RESPONSE API", response);
  changeTemperature(Math.round(response.data.main.temp));
  changeFeelsLike(response.data.main.feels_like.toFixed(1));
  changeFlag(response.data.sys.country);
  changeApiDescription(response.data.weather[0].main);
  changeWeatherDetails(response.data);
}
function changeTemperature(temperature) {
  const newTemp = document.querySelector("#degrees");
  newTemp.innerHTML = ` ${temperature}`;
}
function changeFeelsLike(feelsLike) {
  const feelsLikeElement = document.querySelector(`#feels-like`);
  feelsLikeElement.innerHTML = `Feels like ${feelsLike} °C`;
  if (typeUnit !== "metric") {
    feelsLikeElement.innerHTML = `Feels like ${feelsLike} °F`;
  }
}
function changeApiDescription(description) {
  const weatherDescription = document.querySelector(`#weather-description`);
  weatherDescription.innerHTML = `${description} `;
  animate(weatherDescription);
}
function changeFlag(country) {
  const flag = document.querySelector("#flag");
  flag.setAttribute(
    "src",
    `https://www.countryflags.io/${country}/shiny/32.png`
  );
}
function changeWeatherDetails(data) {
  const iconElement = document.querySelector(`#icon`);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
  const windIntensty = document.querySelector(`#w-lol`);
  const windData = data.wind.speed;
  windIntensty.innerHTML = `Wind intensity is ${windData} km/h`;
  const pressure = document.querySelector(`#p-lol`);
  const pressureData = data.main.pressure;
  pressure.innerHTML = `Athm pressure is ${pressureData}/hPa `;
  const humidity = document.querySelector(`#h-lol`);
  const humidityData = data.main.humidity;
  humidity.innerHTML = `Humidity is ${humidityData}%`;
  const minTemp = document.querySelector("#min-lol");
  const minTemData = data.main.temp_min.toFixed(1);
  minTemp.innerHTML = `Min temp is ${minTemData}°C`;
  const sunSet = document.querySelector("#sun-set");
  const sunSetData = new Date(data.sys.sunset);
  sunSet.innerHTML = `Sunset is at ${formatAMPM(sunSetData)}`;
  const maxTemp = document.querySelector("#max-lol");
  const maxTempData = data.main.temp_max.toFixed(1);
  maxTemp.innerHTML = `Max temp is ${maxTempData}°C`;
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  // var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " ";
  return strTime;
}

// bonus video & animation
function animate(el) {
  el.classList.add("animate__fadeIn");
  setTimeout(() => {
    el.classList.remove("animate__fadeIn");
  }, 1000);
}
function initVideoByWeather(weather) {
  const video = document.getElementById("video");
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
  video.autoplay = true;
  video.appendChild(source);
  video.play();
}

function playVideoByWeather(weather) {
  const video = document.getElementById("video");
  setTimeout(() => {
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
  }, 100);
}

// init call
getCurrentLocation();
