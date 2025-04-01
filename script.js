const API_KEY = "7f60f5991cc9927d88fe78b2325a6145";  // Replace with your OpenWeather API Key

async function fetchWeatherByCity() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found! Please check the name.");
            return;
        }

        updateWeatherUI(data);
        await fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather. Please check your internet connection and try again.");
    }
}

async function fetchWeatherByLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod !== 200) {
                alert("Unable to retrieve weather data for your location.");
                return;
            }

            updateWeatherUI(data);
            await fetchForecast(latitude, longitude);
        } catch (error) {
            console.error("Error fetching weather:", error);
            alert("Failed to fetch weather. Please check your internet connection and try again.");
        }
    }, (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please ensure location services are enabled and try again.");
    });
}

function updateWeatherUI(data) {
    document.getElementById("weatherInfo").classList.remove("hidden");
    document.getElementById("cityName").innerHTML = `<strong>${data.name}</strong> (${new Date().toLocaleDateString()})`;
    document.getElementById("temperature").innerHTML = `🌡️ Temperature: ${data.main.temp}°C`;
    document.getElementById("windSpeed").innerHTML = `💨 Wind: ${data.wind.speed} m/s`;
    document.getElementById("humidity").innerHTML = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("weatherDescription").innerHTML = `☁️ ${data.weather[0].description}`;
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (!data.list) {
            alert("Failed to fetch forecast data.");
            return;
        }

        const forecastElement = document.getElementById("forecast");
        forecastElement.innerHTML = "";  // Clear previous data

        for (let i = 0; i < data.list.length; i += 8) { // Fetching daily data (every 24 hours)
            const day = data.list[i];
            const date = new Date(day.dt * 1000).toLocaleDateString();
            forecastElement.innerHTML += `
                <div>
                    <p class="font-bold">${date}</p>
                    <p>🌡️ Temp: ${day.main.temp}°C</p>
                    <p>💨 Wind: ${day.wind.speed} m/s</p>
                    <p>💧 Humidity: ${day.main.humidity}%</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
        alert("Failed to fetch forecast. Please check your internet connection and try again.");
    }
}
