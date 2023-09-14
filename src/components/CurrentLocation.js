import React, { useState, useEffect } from 'react';
import { key, base } from './ApiKeys';
import Forecast from './Forecast';
import loader from '../images/WeatherIcons.gif';
import Clock from 'react-live-clock';


const CurrentLocation = () => {

    const [state, setState] = useState({
        lat: undefined, lon: undefined,
        errorMessage: undefined, temperatureC: undefined,
        temperatureF: undefined, city: undefined,
        country: undefined, humidity: undefined,
        description: undefined, icon: "CLEAR_DAY",
        sunrise: undefined, sunset: undefined,
        errorMsg: undefined,
    });
    useEffect(() => {
        if (navigator.geolocation) {
            getPosition()
                .then((position) => {
                    getWeather(position.coords.latitude, position.coords.longitude);
                })
                .catch((err) => {
                    getWeather(28.67, 77.22);
                    alert(
                        "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
                    );
                });
        } else {
            alert('location access denined!');
        }
    }, []);


   // const defaults = {
   //     color: "white",
   //     size: 112,
   //     animate: true,
   // };

    async function getWeather(lat, lon) {

        const api_call = await fetch(
            `${base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${key}`
        );
        const data = await api_call.json();
        setState({
            lat: lat,
            lon: lon,
            city: data.name,
            temperatureC: Math.round(data.main.temp),
            temperatureF: Math.round(data.main.temp * 1.8 + 32),
            humidity: data.main.humidity,
            main: data.weather[0].main,
            country: data.sys.country,
        });


    };

    function dateBuilder(d) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();
        return `${day}, ${date} ${month} ${year}`
    };
    function getPosition(options) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    if (state.temperatureC) {
        return (
            <>
                <div className="city">
                    <div className="title">
                        <h2>{state.city}</h2>
                        <h3>{state.country}</h3>
                    </div>
                    <div className="mb-icon">
                        {" "}
                        {/* <ReactAnimatedWeather */}
                            {/* icon={state.icon} */}
                            {/* color={defaults.color} */}
                            {/* size={defaults.size} */}
                            {/* animate={defaults.animate} */}
                        {/* /> */}
                        <p>{state.main}</p>
                    </div>
                    <div className="date-time">
                        <div className="dmy">
                            <div id="txt"></div>
                            <div className="current-time">
                                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                            </div>
                            <div className="current-date">{dateBuilder(new Date())}</div>
                        </div>
                        <div className="temperature">
                            <p>
                                {state.temperatureC}°<span>C</span>
                            </p>
                        </div>
                    </div>
                </div>
                <Forecast icon={state.icon} weather={state.main} />
            </>
        );
    } else {
        return (
            <>
                <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="" />
                <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
                    Detecting your location
                </h3>
                <h3 style={{ color: "white", marginTop: "10px" }}>
                    Your current location wil be displayed on the App <br></br> & used
                    for calculating Real time weather.
                </h3>
            </>
        );
    }
}


export default CurrentLocation;
