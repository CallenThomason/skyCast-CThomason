//------Elements---------
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const urlKey = "ef5eaf62b0397fca9023ac515f882f56";

const city = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const high = document.getElementById("high");
const low = document.getElementById("low");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const description = document.getElementById("description");
const dateEl = document.getElementById("date");
const country = document.getElementById("country"); 

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("city-submit");
const searchForm = document.getElementById("search-form");
const weatherIcon = document.getElementById("weather-icon")

const fiveDayEl = document.getElementById("five-day");

const status = document.getElementById("status"); 



//------Functions------

async function getWeather(cityName) {


    const response = await fetch(`${baseUrl}weather?q=${cityName}&units=imperial&appid=${urlKey}`);
    // console.log(`${baseUrl}weather?q=${cityName}&appid=${urlKey}`);
    const data = await response.json();
    city.textContent = data.name;
    high.textContent = `High: ${Math.round(data.main.temp_max)}°`;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    low.textContent = `Low: ${Math.round(data.main.temp_min)}°`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}`;
    wind.textContent = `Wind: ${Math.round(data.wind.speed)}`;
    //console.log(data.weather[0].description); 
    description.textContent = `${data.weather[0].description}`;

    sunrise.textContent = `Sunrise: ${getCityTime(data.sys.sunrise, data.timezone)}`;
    sunset.textContent = `Sunrise: ${getCityTime(data.sys.sunset, data.timezone)}`;
    dateEl.textContent = `${getCityDate(data.dt, data.timezone)}`; 
    country.textContent = `${data.sys.country}`; 
    // https://openweathermap.org/img/wn/01d@2x.png

    const weatherImage = document.createElement("img");

    weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherImage.width = 120;
    weatherImage.height = 100;
    weatherImage.alt = data.weather[0].desciption;
    weatherIcon.replaceChildren();
    weatherIcon.appendChild(weatherImage);

    fiveDayForecast(data);

}

function getCityTime(time, timezone) {
    const response = new Date((time + timezone) * 1000);
    return response.toLocaleTimeString("en-US", { timeZone: "UTC", hour: "numeric", minute: "2-digit" });
}

function getCityDate(time, timezone) {
    const response = new Date((time + timezone) * 1000);
    return response.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
}

async function fiveDayForecast(data) {


    const lon = data.coord.lon;
    const lat = data.coord.lat;
    const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${urlKey}`;
    const response = await fetch(fiveDayURL);

    const fiveDayData = await response.json();
    console.log(fiveDayData.list);

   const sixDays = groupByDay(fiveDayData.list, data.timezone);
   const fiveDays = sixDays.slice(1,6); 

    for (const day of fiveDays) {
        const card = document.createElement("div");
        card.className = "bg-white border-2 border-slate-200 rounded-lg p-6 flex-row";

       const title = document.createElement("h3");
       title.className = "text-center font-semibold text-2xl";
       title.textContent = day.day; 
       if(fiveDays.indexOf(day) === 0){
        title.textContent = "Tommorow"; 
       }
       
        const dateEl = document.createElement("p");
        dateEl.className = "flex text-slate-500";
        dateEl.textContent = day.date; 

        const weatherImg = document.createElement("img"); 
        weatherImg.src =  `https://openweathermap.org/img/wn/${day.icon}@2x.png`
        weatherImg.alt = day.description; 
        weatherImg.className = "w-10 h-10 mx-auto"; 

        const description = document.createElement("p"); 
        description.className = ""; 
        description.textContent = day.description; 

        const high = document.createElement("p"); 
        high.className = "";
        high.textContent = `High: ${Math.round(day.high)}°`;

         const low = document.createElement("p"); 
        low.className = "";
        low.textContent = `Low: ${Math.round(day.low)}°`;

        card.append(title, dateEl, weatherImg, description, high, low); 
        fiveDayEl.append(card); 
    }//end of for loop
}

function getDay(time, timezone){
 const response = new Date((time + timezone) * 1000);
    return response.toLocaleDateString("en-US", { weekday: "long" })
}

function groupByDay(list, timezone) {
    const days = {};
    let id = 0; 
    for (const item of list) {
        const date = getCityDate(item.dt, timezone);
        const day = getDay(item.dt, timezone); 
        
        if (!days[date]) {
            days[date] = {
           
                date: date,
                high: item.main.temp_max,
                low: item.main.temp_min,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                day: day

            };

        }//end if
        //console.log(days); 
        if(item.main.temp_max > days[date].high){
            days[date].high = item.main.temp_max;
        }
        if(item.main.temp_min < days[date].low){
            days[date].low = item.main.temp_min; 
        }
        
    }//end for
    const dayList = []; 
    for(const day in days){
        dayList.push(days[day]);
    }
    console.log(dayList); 
    return dayList;

}

//------Listeners------
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(cityInput.value);
    if (cityInput.value === "") {
        status.textContent = "Please enter a valid input"; 
        
    }else{
         getWeather(cityInput.value);
    }
   
});

//------Run on load------
getWeather("Stockton");
