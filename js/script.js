const locations = [
    "Den+Haag",
    "Pijnacker",
    "Delft",
    "Rijswijk",
    "Schiphol",
    "Rotterdam"
];

async function loadWeather(city) {
    const card = document.getElementById(city);
    const conditionEl = card.querySelector(".condition");
    const dataEl = card.querySelector(".weather-graphical");

    try {
        const res = await fetch(
            `https://wttr.in/${city}?format=%t;%f;%p;%w;%h;%C`
        );
        const [temp, feels, precip, wind, humidity, cond] = (await res.text()).split(";");

        conditionEl.textContent = cond;

        dataEl.innerHTML = `
            ${block("temperature", temp, "Temperatuur")}
            ${block("thermometer", feels, "Voelt als")}
            ${block("rain", precip, "Neerslag")}
            ${block("wind", wind, "Wind")}
            ${block("humidity", humidity, "Luchtvochtigheid")}
        `;
    } catch (e) {
        conditionEl.textContent = "Geen data";
    }
}

function block(icon, value, label) {
    return `
        <div class="icon-block">
            <img src="https://img.icons8.com/fluency/48/000000/${icon}.png">
            <div class="icon-value">${value}</div>
            <div class="icon-label">${label}</div>
        </div>
    `;
}

function loadAll() {
    locations.forEach(loadWeather);
    document.getElementById("updated").textContent =
        "Laatst bijgewerkt: " + new Date().toLocaleTimeString("nl-NL");
}

/* INIT */
loadAll();

/* AUTO REFRESH – 10 minuten */
setInterval(loadAll, 600000);

/* FULLSCREEN KIOSK */
document.documentElement.requestFullscreen?.();
