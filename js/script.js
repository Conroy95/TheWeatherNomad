const locations = [
    {name:'Den+Haag', card:'denhaag-card', condition:'denhaag-condition', graphical:'denhaag-graphical'},
    {name:'Pijnacker', card:'pijnacker-card', condition:'pijnacker-condition', graphical:'pijnacker-graphical'},
    {name:'Delft', card:'delft-card', condition:'delft-condition', graphical:'delft-graphical'},
    {name:'Rijswijk', card:'rijswijk-card', condition:'rijswijk-condition', graphical:'rijswijk-graphical'},
    {name:'Schiphol', card:'schiphol-card', condition:'schiphol-condition', graphical:'schiphol-graphical'},
    {name:'Rotterdam', card:'rotterdam-card', condition:'rotterdam-condition', graphical:'rotterdam-graphical'}
];

// Update date/time header
function updateDateTime(){
    const dtEl = document.getElementById('datetime');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const seconds = now.getSeconds().toString().padStart(2,'0');
    const day = now.toLocaleDateString('nl-NL', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
    const dayNight = (now.getHours() >= 6 && now.getHours() < 18) ? "🌞 Dag" : "🌙 Nacht";
    dtEl.innerText = `${day} | ${hours}:${minutes}:${seconds} | ${dayNight}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Mapping wind direction to degrees
const windIconMap = {
    "N":"0","NNE":"22.5","NE":"45","ENE":"67.5","E":"90","ESE":"112.5","SE":"135","SSE":"157.5",
    "S":"180","SSW":"202.5","SW":"225","WSW":"247.5","W":"270","WNW":"292.5","NW":"315","NNW":"337.5"
};

// Build HTML for a single location
function buildCardHTML(data) {
    const {temp, feels, precip, wind, humidity, sun, condText, windDir} = data;
    const windDeg = windIconMap[windDir] || 0;

    return `
    <div class="icon-block">
        <img src="assets/icons/temperature.png"/>
        <span>${temp}</span>
        <div class="icon-label">Temperatuur</div>
        <div class="meter"><div style="width:${parseInt(temp)||0*4}%"></div></div>
    </div>
    <div class="icon-block">
        <img src="assets/icons/thermometer.png"/>
        <span>${feels}</span>
        <div class="icon-label">Voelt als</div>
        <div class="meter"><div style="width:${parseInt(feels)||0*4}%"></div></div>
    </div>
    <div class="icon-block">
        <img src="assets/icons/rain.png"/>
        <span>${precip}</span>
        <div class="icon-label">Neerslag</div>
        <div class="meter"><div style="width:${parseFloat(precip)||0*5}%"></div></div>
    </div>
    <div class="icon-block">
        <img src="assets/icons/wind.png" style="transform:rotate(${windDeg}deg)"/>
        <span>${wind} ${windDir}</span>
        <div class="icon-label">Wind</div>
        <div class="meter"><div style="width:${parseInt(wind)||0}%"></div></div>
    </div>
    <div class="icon-block">
        <img src="assets/icons/humidity.png"/>
        <span>${humidity}</span>
        <div class="icon-label">Luchtvochtigheid</div>
        <div class="meter"><div style="width:${parseInt(humidity)||0}%"></div></div>
    </div>
    <div class="icon-block">
        <img src="assets/icons/sun.png"/>
        <span>${sun}</span>
        <div class="icon-label">Zon op/onder</div>
    </div>
    `;
}

// Render cached data instantly
function renderCachedData() {
    const cached = localStorage.getItem("weatherData");
    if(!cached) return;
    const allData = JSON.parse(cached);
    allData.forEach((data, idx) => {
        const loc = locations[idx];
        document.getElementById(loc.condition).innerText = data.condText;
        document.getElementById(loc.graphical).innerHTML = buildCardHTML(data);

        // Achtergrond kleur
        const cardEl = document.getElementById(loc.card);
        const condText = data.condText.toLowerCase();
        if(condText.includes("rain")) cardEl.style.background = "#00a4e450";
        else if(condText.includes("cloud")) cardEl.style.background = "#fbb03420";
        else if(condText.includes("sun") || condText.includes("clear")) cardEl.style.background = "#fbb03440";
        else cardEl.style.background = "#f0f4f820";
    });

    // Update last updated time
    const updatedEl = document.getElementById('last-updated');
    updatedEl.innerText = `Laatst bijgewerkt: ${localStorage.getItem("weatherTimestamp") || '--'}`;
}

// Fetch new data and update DOM + cache
async function fetchWeatherData() {
    try {
        const locationNames = locations.map(l => l.name).join("+");
        const format = "%t;%f;%p;%w;%h;%S+%s;%C;%D";
        const response = await fetch(`https://wttr.in/${locationNames}?format=${format}`);
        const text = await response.text();
        const allDataRaw = text.split("\n");

        const allData = allDataRaw.map(line => {
            const [temp, feels, precip, wind, humidity, sun, condText, windDir] = line.split(";");
            return {temp, feels, precip, wind, humidity, sun, condText, windDir};
        });

        // Update DOM
        allData.forEach((data, idx) => {
            const loc = locations[idx];
            document.getElementById(loc.condition).innerText = data.condText;
            document.getElementById(loc.graphical).innerHTML = buildCardHTML(data);

            const cardEl = document.getElementById(loc.card);
            const condText = data.condText.toLowerCase();
            if(condText.includes("rain")) cardEl.style.background = "#00a4e450";
            else if(condText.includes("cloud")) cardEl.style.background = "#fbb03420";
            else if(condText.includes("sun") || condText.includes("clear")) cardEl.style.background = "#fbb03440";
            else cardEl.style.background = "#f0f4f820";
        });

        // Cache data
        localStorage.setItem("weatherData", JSON.stringify(allData));
        const now = new Date();
        const timeString = now.toLocaleTimeString('nl-NL');
        localStorage.setItem("weatherTimestamp", timeString);
        document.getElementById('last-updated').innerText = `Laatst bijgewerkt: ${timeString}`;

    } catch(err) {
        console.error("Weather fetch error:", err);
    }
}

// Initial load
renderCachedData();
fetchWeatherData();

// Refresh every 10 minuten
setInterval(fetchWeatherData, 10*60*1000);
