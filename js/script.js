const locations = [
    "Den+Haag",
    "Pijnacker",
    "Delft",
    "Rijswijk",
    "Schiphol",
    "Rotterdam"
];

function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    document.getElementById("daynight").textContent = (hours >= 6 && hours < 18) ? "🌞" : "🌙";
    document.getElementById("datetime").textContent =
        now.toLocaleDateString("nl-NL", { weekday: 'long', day: 'numeric', month: 'long' }) +
        " • " +
        now.toLocaleTimeString("nl-NL", { hour: '2-digit', minute: '2-digit' });
}

async function loadWeather(city) {
    const card = document.getElementById(city);
    const condition = card.querySelector(".condition");
    const container = card.querySelector(".weather-graphical");

    try {
        const data = await fetch(
            `https://wttr.in/${city}?format=%t;%f;%p;%w;%D;%h;%C`
        ).then(r => r.text());

        const [temp, feels, precip, wind, windDir, humidity, cond] = data.split(";");

        condition.textContent = cond;

        container.innerHTML = `
            <div class="icon-block">
                <img src="https://img.icons8.com/fluency/48/temperature.png">
                <span>${temp}</span><br>Temperatuur
            </div>
            <div class="icon-block">
                <img src="https://img.icons8.com/fluency/48/thermometer.png">
                <span>${feels}</span><br>Voelt als
            </div>
            <div class="icon-block">
                <img src="https://img.icons8.com/fluency/48/rain.png">
                <span>${precip}</span><br>Neerslag
            </div>
            <div class="icon-block">
                <img src="https://img.icons8.com/fluency/48/wind.png">
                <span>${wind}</span><br>Wind
            </div>
            <div class="icon-block">
                <img src="https://img.icons8.com/fluency/48/compass.png">
                <span>${windDir}</span><br>Windrichting
            </div>
            <div class="icon-block">
                <img src="https://img.icons8.com/fluency/48/humidity.png">
                <span>${humidity}</span><br>Luchtvochtigheid
            </div>
        `;
    } catch (e) {
        condition.textContent = "Data niet beschikbaar";
    }
}

function loadAll() {
    updateDateTime();
    locations.forEach(loadWeather);
}

loadAll();

/* ⏱️ elke 10 minuten verversen */
setInterval(loadAll, 600000);

/* ⏰ klok elke minuut bijwerken */
setInterval(updateDateTime, 60000);
