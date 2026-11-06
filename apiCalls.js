const baseUrl = "https://api.openweathermap.org/data/2.5/";
const urlKey = "ef5eaf62b0397fca9023ac515f882f56";

async function getWeather(cityName) {


    const response = await fetch(`${baseUrl}weather?q=${cityName}&units=imperial&appid=${urlKey}`);
    // console.log(`${baseUrl}weather?q=${cityName}&appid=${urlKey}`);
    const data = await response.json();
  
    return data; 
  
}

async function checkStatus(newData){
    const data = await newData; 
  
    return data.cod; 
}

async function getFiveDay(data) {

    const lon = data.coord.lon;
    const lat = data.coord.lat;
    const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${urlKey}`;
    const response = await fetch(fiveDayURL);

   const value = await response.json();
   return value; 
}

export {getWeather, checkStatus, getFiveDay}; 