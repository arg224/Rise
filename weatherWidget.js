const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear, partly cloudy, and overcast",
    2: "Mainly clear, partly cloudy, and overcast",
    3: "Mainly clear, partly cloudy, and overcast",
    45: "Fog and depositing rime fog",
    48: "Fog and depositing rime fog",
    51: "Drizzle: Light, moderate, and dense intensity",
    53: "Drizzle: Light, moderate, and dense intensity",
    55: "Drizzle: Light, moderate, and dense intensity",
    56: "Freezing Drizzle: Light and dense intensity",
    57: "Freezing Drizzle: Light and dense intensity",
    61: "Freezing Drizzle: Light and dense intensity",
    63: "Rain: Slight, moderate and heavy intensity",
    65: "Rain: Slight, moderate and heavy intensity",
    66: "Freezing Rain: Light and heavy intensity",
    67: "Freezing Rain: Light and heavy intensity",
    71: "Snow fall: Slight, moderate, and heavy intensity",
    73: "Snow fall: Slight, moderate, and heavy intensity",
    75: "Snow fall: Slight, moderate, and heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight, moderate, and violent",
    81: "Rain showers: Slight, moderate, and violent",
    82: "Rain showers: Slight, moderate, and violent",
    85: "Snow showers slight and heavy",
    86: "Snow showers slight and heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight and heavy hail",
    99: "Thunderstorm with slight and heavy hail",
}

const isLatLngRE = /\d+,\d+/;

function addWidget(divId = "defaultWidgetContainer") {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "https://arg224.github.io/Rise/weatherWidget.css"
    // styleLink.href = "weatherWidget.css"

    document.head.appendChild(styleLink)
    if (!document.querySelector(`#${divId}`)) {
        const newDiv = document.createElement("div");
        newDiv.id = divId;
        document.body.append(newDiv);
    }
    const target = document.querySelector(`#${divId}`);
    target.classList.add("weather-widget")

    addLocationWidget(target, city => {
        clearError(target);
        if (isLatLngRE.test(city)) {
            const [lat, lng] = city.split(",");
            console.log(lat)
            console.log(lng)
            getWeatherData(lat, lng).then(data => {
                console.log(data)
                displayWeatherData(data, target);
            });
        }
        else {
            fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, {
                headers: { 'X-Api-Key': 'XFrJltKJN4eoygM62TMdQJncVTP9vffcSqRyvykQ' },
            }).then(v => v.json()).then(result => {
                console.log("printing new ajax call", result)
                if (result && result.length > 0) {
                    const firstResult = result[0];
                    const storedLat = firstResult.latitude;
                    const storedLng = firstResult.longitude;
                    getWeatherData(storedLat, storedLng).then(data => {
                        console.log(data)
                        displayWeatherData(data, target);
                    });
                }
                else {
                    showError(target, "No Results Found");
                }
            });
        }
    })
}

function showError(target, message) {
    target.querySelector(".error-message").innerText = message

}

function clearError(target) {
    target.querySelector(".error-message").innerText = " "
}
function addLocationWidget(target, onSelect) {
    const container = document.createElement("div");
    container.classList.add("input-section")
    const input = document.createElement("input");
    input.classList.add("input-box")
    input.placeholder = "Input lat/lng or city";
    const button = document.createElement("button");
    input.classList.add("button-box")
    button.innerText = "select";
    container.appendChild(input);
    container.appendChild(button);
    target.appendChild(container);
    button.addEventListener("click", () => {
        onSelect(input.value);
        input.value = '';
    })
    const errorMesssage = document.createElement("div");
    errorMesssage.classList.add("error-message");
    container.appendChild(errorMesssage);

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

function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function displayWeatherData(weatherData, target) {
    //check to see if there is an exisiting container and remove if there is
    const existingWeatherContainer = document.getElementById('weatherContainer');
    removeElement(existingWeatherContainer);

    const container = document.createElement("div");
    container.id = 'weatherContainer';
    container.classList.add("day-list")
    const dateStringArray = weatherData.daily.time;
    const dateArray = dateStringArray.map(dateString => new Date(dateString));
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysArray = dateArray.map(date => daysOfWeek[date.getDay()]);
    const dayTemperatures = {
        'Sunday': [],
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': [],
    };
    weatherData.daily.time.forEach((time, idx) => {
        const dayName = daysArray[idx];
        const temperature = weatherData.daily.apparent_temperature_max[idx];
        dayTemperatures[dayName].push(temperature);
    });

    for (let i = 0; i < 7; i++) {
        const dayName = daysOfWeek[i];
        const temperatures = dayTemperatures[dayName];
        // console.log("temperatures", temperatures);
        const averageTemperature = calculateAverage(temperatures);
        // console.log("averageTemperature", temperatures, "+", averageTemperature);
        const dayData = createDayItem(daysArray[i], Math.round(averageTemperature), weatherData.daily.weather_code[i])
        container.appendChild(dayData);
    }
    target.appendChild(container);

}

function createDayItem(date, temperature, code) {
    const dayData = document.createElement("div");
    dayData.classList.add("day")
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date")
    dateDiv.innerText = date;
    dayData.appendChild(dateDiv);

    const codeDiv = document.createElement("div");
    codeDiv.innerText = weatherCodes[code];
    dayData.appendChild(codeDiv);

    const elem = document.createElement("img");
    // Cloudy 
    if (code === 3 || code === 2 || code === 1) {
        elem.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMxEoLnQX4QUVbsVLCAQfay5jLC6Mk2cghwC195CBjQ&s");
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "200");
        dayData.appendChild(codeDiv).appendChild(elem);
    }
    // Clear Skies
    if (code === 0) {
        elem.setAttribute("src", "https://t3.ftcdn.net/jpg/01/10/28/86/240_F_110288668_nnL2qMylNBDGdFqP6wrnTE1WiAK0VtT9.jpg");
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "200");
        dayData.appendChild(codeDiv).appendChild(elem);
    }
    // Snow
    if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
        elem.setAttribute("src", "https://t3.ftcdn.net/jpg/01/83/28/86/360_F_183288609_fXtejjyDNOg3uKLfgWDKteEEHYDtW3C2.jpg");
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "200");
        dayData.appendChild(codeDiv).appendChild(elem);
    }
    // Rain
    if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57 || code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
        elem.setAttribute("src", "https://img.freepik.com/free-vector/rainy-cloud-sticker-white-background_1308-59851.jpg");
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "200");
        dayData.appendChild(codeDiv).appendChild(elem);
    }
    // Thunderstorm
    if (code === 95 || code === 96 || code === 99) {
        elem.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUedAUyBMHlx5oYRFLzAQsQm7GqZrLJTSX0ikpEQubsg&s");
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "200");
        dayData.appendChild(codeDiv).appendChild(elem);
    }
    // Fog
    if (code === 45 || code === 48) {
        elem.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPQxi66M8KSd5LUnlXq1fecmc2-u7NAWhNiIVwNy8T84u5w3YnpvkfcQlOAQ&s");
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "200");
        dayData.appendChild(codeDiv).appendChild(elem);
    }
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("temp")
    tempDiv.innerText = temperature + "°C";
    dayData.appendChild(tempDiv);
    return dayData;

}
const target = document.currentScript.getAttribute("targetDivId");
addWidget(target);