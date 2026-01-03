const locations = [
    "Den Haag",
    "Pijnacker",
    "Delft",
    "Rijswijk",
    "Schiphol",
    "Rotterdam"
];

const container = document.getElementById("weatherContainer");
const lastUpdateEl = document.getElementById("lastUpdate");

async function loadWeather() {
    container.innerHTML = "";

    for (const city of locations) {
        const res = await fetch(
            `https://wttr.in/${city}?format=%t;%f;%p;%w;%h;%C;%d`
        );
        const text = await res.text();
        const [temp, feels, precip, wind, humidity, condition, windDir] = text.split(";");

        container.innerHTML += `
        <div class="weather-card">
            <h2>${city}</h2>
            <div class="condition">${condition}</div>

            <div class="info-grid">
                <div class="info">
                    <img src="https://img.icons8.com/fluency/48/temperature.png">
                    <div>Temperatuur</div>
                    <strong>${temp}</strong>
                </div>
                <div class="info">
                    <img src="https://img.icons8.com/fluency/48/thermometer.png">
                    <div>Voelt als</div>
                    <strong>${feels}</strong>
                </div>
                <div class="info">
                    <img src="https://img.icons8.com/fluency/48/rain.png">
                    <div>Neerslag</div>
                    <strong>${precip}</strong>
                </div>
                <div class="info">
                    <img src="https://img.icons8.com/fluency/48/wind.png">
                    <div>Wind</div>
                    <strong>${wind}</strong>
                </div>
                <div class="info">
                    <img src="https://img.icons8.com/fluency/48/humidity.png">
                    <div>Luchtvochtigheid</div>
                    <strong>${humidity}</strong>
                </div>
                <div class="info">
                    <img src="https://img.icons8.com/fluency/48/compass.png">
                    <div>Windrichting</div>
                    <strong>${windDir}</strong>
                </div>
            </div>
        </div>`;
    }

    lastUpdateEl.innerText = new Date().toLocaleTimeString("nl-NL");
}

function updateDateTime() {
    const now = new Date();
    document.getElementById("dateTime").innerText =
        now.toLocaleDateString("nl-NL") + " " + now.toLocaleTimeString("nl-NL");

    document.getElementById("dayNight").innerText =
        now.getHours() >= 6 && now.getHours() < 18 ? "🌞" : "🌙";
}

// Initial load
loadWeather();
updateDateTime();

// Auto refresh elke 10 minuten
setInterval(loadWeather, 600000);
setInterval(updateDateTime, 1000);
