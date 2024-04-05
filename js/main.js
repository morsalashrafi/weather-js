let current = false;
let citySpan = document.querySelector("#citySpan");
let rain = document.querySelector("#rain");
let temp_c = document.querySelector("#temp_c");
let isDay = true;
let hero = document.querySelector("#hero");
let feels = document.querySelector("#feels");
let wind = document.querySelector("#wind");
let humidity = document.querySelector("#humadity");
let uv = document.querySelector("#uv");
let hoursDiv = document.querySelector("#hoursDiv");
let aside = document.querySelector("#aside");
let searchInput = document.getElementById("searchInput");
let menu = document.querySelector("#menu");
let nav = document.querySelector("nav .inner");
let layer = document.querySelector("#layer");
let time = document.querySelector("#time");

// create async function
async function city() {
  let data = await fetch(
    "https://api.geoapify.com/v1/ipinfo?apiKey=3c992b5be33640f3b979f5e13eec1eb3"
  );

  let finalData = await data.json();
  if (finalData.city.name !== null || finalData.city.name !== undefined) {
    currentCity = finalData.city.name;
  } else currentCity = finalData.country.name;

  if (current === false) {
    getData(currentCity);
  }

  searchInput.addEventListener("input", function (e) {
    current = e.target.value;
    if (current !== null) {
      getData(current);
    }
  });
}

async function getData(currentCity) {
  if (currentCity === undefined) {
    currentCity = "cairo";
  }
  let data = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=fc2c9b6df5dc49e4b99162312240501&q=${currentCity}&days=7&aqi=no&alerts=no`
  );
  if (data.ok && 200 === data.status) {
    let finalData = await data.json();

    // get the next 7 days
    let days = finalData.forecast.forecastday;

    citySpan.innerHTML = `${finalData.location.name}, ${finalData.location.country}`;
    rain.innerHTML = `chance of rain: ${finalData.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    temp_c.innerHTML = `    ${finalData.current.temp_c}<span>&#8451;</span>`;

    isDay = finalData.current.is_day;
    if (isDay) {
      hero.attributes.src.value = "images/sun.png";
    } else {
      hero.attributes.src.value = "images/crescent-moon.png";
    }

    feels.innerHTML = `${finalData.current.feelslike_c.toFixed()}<span>&#8451;</span>`;
    humidity.innerHTML = `${finalData.current.humidity}%`;
    wind.innerHTML = `${finalData.current.wind_kph} Kp/h`;
    uv.innerHTML = `${finalData.current.uv}`;

    let hours = finalData.forecast.forecastday[0].hour;
    let hoursResult = "";
    for (let i = 0; i < hours.length; i += 4) {
      hoursResult += `
        <div class="box">
        <p>${tConvert(hours[i].time.slice(11))}</p>
        <img src="${hours[i].condition.icon}" alt="icon">
        <h5>${hours[i].temp_c.toFixed()}<span>&#8451;</span></h5>
        </div>
        `;
    }
    hoursDiv.innerHTML = hoursResult;

    let daysResult = "";
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let today = new Date(finalData.location.localtime).getDay();

    days.forEach((element) => {
      let date = new Date(element.date).getDay();
      let day = date === today ? "Today" : weekday[date];

      daysResult += `<div class="week-box">
        <h2>${day}</h2>
        <div class="week-box_img">
           <h4>${element.day.condition.text}</h4>
           <img src="${element.day.condition.icon}"  alt="icon">
        </div>
        <h4>${element.day.maxtemp_c.toFixed()}<span>&#8451;</span> <span>/${element.day.mintemp_c.toFixed()}<span>&#8451;</span></span></h4>
    </div>`;
    });
    aside.innerHTML = daysResult;
  }
}

city();

function tConvert(time) {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? "AM" : "PM";
    time[0] = +time[0] % 12 || 12;
  }
  return time.join("");
}

menu.addEventListener("click", (e) => {
  if (!e.srcElement.checked) {
    nav.classList.remove("active-nav");
    layer.classList.remove("active-layer");
  } else {
    nav.classList.add("active-nav");
    layer.classList.add("active-layer");
  }
});

function updateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const formattedDate = now.toLocaleDateString("en-US", options);
  time.innerHTML = formattedDate;
}

setInterval(updateTime, 1000);
updateTime();
