console.log("target div id is:", targetDivId);

const weatherCodes= {
0:	"Clear sky",
1:	"Mainly clear, partly cloudy, and overcast",
2:	"Mainly clear, partly cloudy, and overcast",
3:	"Mainly clear, partly cloudy, and overcast",
45: "Fog and depositing rime fog",
48:	"Fog and depositing rime fog",
// 51, 53, 55	"Drizzle: Light, moderate, and dense intensity"
// 56, 57	"Freezing Drizzle: Light and dense intensity"
// 61, 63, 65	"Rain: Slight, moderate and heavy intensity"
// 66, 67	"Freezing Rain: Light and heavy intensity"
// 71, 73, 75	"Snow fall: Slight, moderate, and heavy intensity"
// 77	"Snow grains"
// 80, 81, 82	"Rain showers: Slight, moderate, and violent"
// 85, 86	"Snow showers slight and heavy"
// 95 *	"Thunderstorm: Slight or moderate"
// 96, 99 *	"Thunderstorm with slight and heavy hail"
}

function addWidget(divId) {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "./weatherWidget.css"
    document.head.appendChild(styleLink)
    const target = document.querySelector(`#${divId}`);
    target.classList.add("weather-widget")
    addLocationWidget(target, latLng => {
        console.log("you selected", latLng);
        const [lat, lng] = latLng.split(",");
        getWeatherData(lat, lng).then(data => {
            console.log(data)
            displayWeatherData(data, target);
        });
    })


}

function addLocationWidget(target, onSelect) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    input.value = "32.1117303,34.8272936"
    const button = document.createElement("button");
    button.innerText = "select";
    container.appendChild(input);
    container.appendChild(button);
    target.appendChild(container);
    button.addEventListener("click", () => {
        onSelect(input.value);
    })
}

function getWeatherData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?forecast_days=14&timezone=auto&latitude=${encodeURIComponent(
        latitude
    )}&longitude=${encodeURIComponent(
        longitude
    )}&daily=apparent_temperature_max&daily=weather_code`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            throw error;
        });
}

function displayWeatherData(weatherData, target) {
    const container = document.createElement("div");
    weatherData.daily.time.forEach((time, idx) => {
        const dayData = createDayItem(weatherData.daily.time[idx],weatherData.daily.apparent_temperature_max[idx], weatherData.daily.weather_code[idx])
        container.appendChild(dayData);
    });
    target.appendChild(container);

}

function createDayItem(date, temperature, code){
    const dayData = document.createElement("div");
    dayData.classList.add("day")
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date")
    dateDiv.innerText = date;
    dayData.appendChild(dateDiv);
    const tempDiv = document.createElement("div");
    tempDiv.innerText = temperature;
    dayData.appendChild(tempDiv);
    const codeDiv = document.createElement("div");
    codeDiv.innerText = weatherCodes[code];
    dayData.appendChild(codeDiv);
    return dayData;

}

addWidget(targetDivId);