const locations = [
    "Den+Haag",
    "Pijnacker",
    "Delft",
    "Rijswijk",
    "Schiphol",
    "Rotterdam"
];

const container = document.getElementById("weatherContainer");
const lastUpdateEl = document.getElementById("lastUpdate");
const datetimeEl = document.getElementById("datetime");

/* DAG / NACHT + DATUM TIJD */
function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const isNight = hours < 6 || hours >= 20;
    datetimeEl.innerHTML = `${now.toLocaleDateString('nl-NL')} ${now.toLocaleTimeString('nl-NL')} ${isNight ? "🌙 Nacht" : "☀️ Dag"}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* WEER LADEN */
async function loadWeather() {
    container.innerHTML = "";

    for (const loc of locations) {
        const res = await fetch(`https://wttr.in/${loc}?format=%t;%f;%p;%w;%h;%C;%d`);
        const text = await res.text();
        const [temp, feels, precip, wind, humidity, condition, windDir] = text.split(";");

        const windDeg = parseInt(windDir) || 0;

        const card = document.createElement("div");
        card.className = "weather-card";
        card.innerHTML = `
            <h2>${loc.replace("+"," ")}</h2>
            <div class="condition">${condition}</div>
            <div class="weather-grid">
                <div class="block">
                    <img src="https://img.icons8.com/fluency/48/temperature.png">
                    <div class="value">${temp}</div>
                    <div class="label">Temperatuur</div>
                </div>
                <div class="block">
                    <img src="https://img.icons8.com/fluency/48/thermometer.png">
                    <div class="value">${feels}</div>
                    <div class="label">Voelt als</div>
                </div>
                <div class="block">
                    <img src="https://img.icons8.com/fluency/48/rain.png">
                    <div class="value">${precip}</div>
                    <div class="label">Neerslag</div>
                </div>
                <div class="block">
                    <img src="https://img.icons8.com/fluency/48/wind.png">
                    <div class="value">${wind}</div>
                    <div class="label">Wind</div>
                    <img class="wind-arrow" src="https://img.icons8.com/ios-filled/50/navigation.png"
                         style="transform: rotate(${windDeg}deg);">
                </div>
                <div class="block">
                    <img src="https://img.icons8.com/fluency/48/humidity.png">
                    <div class="value">${humidity}</div>
                    <div class="label">Luchtvochtigheid</div>
                </div>
                <div class="block">
                    <img src="https://img.icons8.com/fluency/48/sun.png">
                    <div class="value">—</div>
                    <div class="label">Zon</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    lastUpdateEl.innerText = `Laatst bijgewerkt: ${new Date().toLocaleTimeString('nl-NL')}`;
}

/* INIT + AUTO REFRESH (10 MIN) */
loadWeather();
setInterval(loadWeather, 600000);
