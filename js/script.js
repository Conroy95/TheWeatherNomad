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

// Create weather cards
async function refreshWeather(){
    try {
        // Combine all location names into één fetch
        const locationNames = locations.map(l => l.name).join("+");
        const format = "%t;%f;%p;%w;%h;%S+%s;%C;%D"; // temp;feels;precip;wind;humidity;sun;cond;windDir
        const data = await fetch(`https://wttr.in/${locationNames}?format=${format}`).then(r=>r.text());

        // wttr.in returnt meerdere locaties gescheiden door newlines
        const allData = data.split("\n");
        allData.forEach((line, idx) => {
            const loc = locations[idx];
            const [temp, feels, precip, wind, humidity, sun, condText, windDir] = line.split(";");

            const cardEl = document.getElementById(loc.card);
            document.getElementById(loc.condition).innerText = condText;

            const windDeg = windIconMap[windDir] || 0;

            const html = `
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

            document.getElementById(loc.graphical).innerHTML = html;

            // Achtergrond kleur
            if(condText.toLowerCase().includes("rain")){
                cardEl.style.background = "#00a4e450";
            } else if(condText.toLowerCase().includes("cloud")){
                cardEl.style.background = "#fbb03420";
            } else if(condText.toLowerCase().includes("sun") || condText.toLowerCase().includes("clear")){
                cardEl.style.background = "#fbb03440";
            } else {
                cardEl.style.background = "#f0f4f820";
            }
        });

        // Update "Laatst bijgewerkt"
        const updatedEl = document.getElementById('last-updated');
        const now = new Date();
        updatedEl.innerText = `Laatst bijgewerkt: ${now.toLocaleTimeString('nl-NL')}`;

    } catch(err) {
        console.error("Weather fetch error:", err);
    }
}

// Initial load & refresh every 10 minuten
refreshWeather();
setInterval(refreshWeather, 10*60*1000);
