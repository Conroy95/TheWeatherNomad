const locations = [
    {name:'Den+Haag', card:'denhaag-card', condition:'denhaag-condition', graphical:'denhaag-graphical'},
    {name:'Pijnacker', card:'pijnacker-card', condition:'pijnacker-condition', graphical:'pijnacker-graphical'},
    {name:'Delft', card:'delft-card', condition:'delft-condition', graphical:'delft-graphical'},
    {name:'Rijswijk', card:'rijswijk-card', condition:'rijswijk-condition', graphical:'rijswijk-graphical'},
    {name:'Schiphol', card:'schiphol-card', condition:'schiphol-condition', graphical:'schiphol-graphical'},
    {name:'Rotterdam', card:'rotterdam-card', condition:'rotterdam-condition', graphical:'rotterdam-graphical'}
];

// Mapping wind direction to degrees
const windIconMap = {
    "N":"0","NNE":"22.5","NE":"45","ENE":"67.5","E":"90","ESE":"112.5","SE":"135","SSE":"157.5",
    "S":"180","SSW":"202.5","SW":"225","WSW":"247.5","W":"270","WNW":"292.5","NW":"315","NNW":"337.5"
};

// Fade-in animatie
function fadeInCard(cardId){
    const card = document.getElementById(cardId);
    card.style.opacity = 0;
    card.style.transition = "opacity 0.5s ease-in-out";
    requestAnimationFrame(()=>card.style.opacity = 1);
}

// ---------------- Instant Load ----------------
function renderEmptyCards(){
    locations.forEach(loc=>{
        document.getElementById(loc.condition).innerText = "--";
        document.getElementById(loc.graphical).innerHTML = '';
    });
}
renderEmptyCards();

// ---------------- Date/Time Header ----------------
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

// ---------------- Fetch weather per locatie ----------------
async function fetchWeather(location){
    const {name, card, condition, graphical} = location;
    try {
        const format = "%t;%f;%p;%w;%h;%C;%D;%S+%s";
        const res = await fetch(`https://wttr.in/${name}?format=${format}`).then(r=>r.text());
        if(!res) throw new Error("Geen data ontvangen");

        const [temp, feels, precip, wind, humidity, condText, windDir, sun] = res.split(";");

        // Update conditie
        document.getElementById(condition).innerText = condText || "--";

        // Wind rotatie
        const windDeg = windIconMap[windDir] || 0;

        // Update grafische weergave
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

        document.getElementById(graphical).innerHTML = html;

        // Achtergrond kleur
        const cardEl = document.getElementById(card);
        if(condText.toLowerCase().includes("rain")){
            cardEl.style.background = "#00a4e450";
        } else if(condText.toLowerCase().includes("cloud")){
            cardEl.style.background = "#fbb03420";
        } else if(condText.toLowerCase().includes("sun") || condText.toLowerCase().includes("clear")){
            cardEl.style.background = "#fbb03440";
        } else {
            cardEl.style.background = "#f0f4f820";
        }

        // Fade-in
        fadeInCard(card);

    } catch(err){
        console.error(`Error fetching weather for ${name}:`, err);
        document.getElementById(condition).innerText = "--";
        document.getElementById(graphical).innerHTML = `<div style="color:#999">Data niet beschikbaar</div>`;
    }
}

// ---------------- Refresh alle locaties async ----------------
function refreshAllWeather(){
    locations.forEach(loc => fetchWeather(loc));
    // Update laatste update time
    const updatedEl = document.getElementById('last-updated');
    updatedEl.innerText = `Laatst bijgewerkt: ${new Date().toLocaleTimeString('nl-NL')}`;
}

// Initial load + elke 10 minuten
refreshAllWeather();
setInterval(refreshAllWeather, 10*60*1000);
