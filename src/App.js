import ReactDOM from 'react-dom';
import React, {useState, useEffect} from 'react';

const api = {
  key:"577e46d7e41033a7884a4e465ae29b69",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState(''); // Search bar
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});
  const [data, setData] = useState(false);
  const search = evt => {
    if (evt.key === "Enter"){
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)  // Returns a promise, containing the response object
      .then(res => res.json())  // Extracting the JSON
      .then(result => {
          setQuery('');
          setWeather(result);
          console.log("Weather Data: ");
          console.log(result);
         try{
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&exclude=hourly,minutely&units=metric&appid=${api.key}`)
            .then(res => res.json())
            .then(result=>{
              console.log("Forecast Data: ");
              console.log(result)
              setForecast(result);
            }).catch((error) => {console.log("Error: " + error)});
            setData(true);
        }
        catch(error){
          setData(false);
          console.log("City not found");
          return <><div>City not found</div></>
        }
        }
      );

    }
  }
  useEffect(()=>{
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&APPID=577e46d7e41033a7884a4e465ae29b69`)  // Returns a promise, containing the response object
      .then(res => res.json())  // Extracting the JSON
      .then(result => {
          setQuery('');
          setWeather(result);
          console.log("Weather Data: ");
          console.log(result);
         try{
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&exclude=hourly,minutely&units=metric&appid=${api.key}`)
            .then(res => res.json())
            .then(result=>{
              console.log("Forecast Data: ");
              console.log(result)
              setForecast(result);
            }).catch((error) => {console.log("Error: " + error)});
            setData(true);
        }
        catch(error){
          setData(false);
          console.log("City not found");
          return <><div>City not found</div></>
        }
        }
      );
  },[]);

  const FutureForecast = () => {
    let date = new Date();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var i = -1 ;
function calcTime(city, offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return nd.getDay();
}

  let raw =  forecast.timezone_offset/ 60;	// Provide the offset in terms of seconds
  let off = (raw / 60);
  i = (calcTime(forecast.timezone, off) - 1)%7;
    try {
        return <>
        <div className="forecast">
          {forecast.daily.map((day) => {
            const {id, weather} = day;
            /*if (i === 6 - calcTime(forecast.timezone, off)){
              i = -calcTime(forecast.timezone, off);
            }
            i += 1;*/
            i += 1
            return <>
              <div key={id} className="day">
              <div className="boxes"><img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png` }></img></div>
              <div className="boxes">{days[i%7]}</div>
              <div className="boxes">Day: {day.temp.day}°C</div>
              <div className="boxes">Night: {day.temp.night}°C</div>
              </div>
            </>
          })}
        </div>
        </>
    }
    catch(err){
      console.log("Error");
   
      return <> </>
    }
  }



  const dateBuilder = (d) => {
    function calcTime(city, offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return [nd.getDay(), nd.getMonth(), nd.getFullYear(), nd.getDate()];
    } 
    let raw =  forecast.timezone_offset/ 60;	// Provide the offset in terms of seconds
    let off = (raw / 60);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    console.log("Local Date: " + new Date());
    let day = days[calcTime(forecast.timezone, off)[0]]; // Return the index
    let date = calcTime(forecast.timezone, off)[3];
    let month = months[calcTime(forecast.timezone, off)[1]]; // Return the index
    let year = calcTime(forecast.timezone, off)[2];
    return  `${day} ${date} ${month} ${year}`
  }
  return (
    <div className={(typeof weather.main != "undefined" && typeof forecast.current != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'default'}>  
      <main>
        <div className="search-box">
          <input type="text" className="search-bar" placeholder="Search..." onChange ={e => setQuery(e.target.value)} value={query} onKeyPress={search}></input>
        </div>
        {(typeof weather.main != "undefined" && typeof forecast.current != "undefined") ? (
        <div className="location-box" >
          <div className="location">{weather.name}, {weather.sys.country}</div>
          <div className="date">{dateBuilder(new Date())}</div>
          <div className="weather-box">
            <div className="temp">{Math.round(weather.main.temp)}°C</div>
            <div className="icon"><img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} className="pic"></img></div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
          <div className="extra_details">
            <div className="humidity">Humidity: {weather.main.humidity}%</div>
            <div className="wind">Wind {Math.round(weather.wind.speed * 3.6)} km/hr</div>
            <div className=""></div>
          </div>
        </div>
        ) : ('') }
        {data === true ? <FutureForecast /> : <div className="notfound">City Not Found</div>}
      </main>
    </div>
  );
} 

export default App;
