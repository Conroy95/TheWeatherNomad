const locations = [
    "Den+Haag",
    "Pijnacker",
    "Delft",
    "Rijswijk",
    "Schiphol",
    "Rotterdam"
];

function icon(name) {
    return `https://img.icons8.com/fluency/48/000000/${name}.png`;
}

/* DAG / NACHT */
(function dayNight(){
    const hour = new Date().getHours();
    const el = document.getElementById("dayNight");
    if(hour >= 6 && hour < 18){
        el.textContent = "🌞 Dag";
    } else {
        el.textContent = "🌙 Nacht";
    }
})();

async function loadWeather(city){
    const card = document.getElementById(city);
    const condEl = card.querySelector(".condition");
    const dataEl = card.querySelector(".weather-graphical");

    try {
        const res = await fetch(`https://wttr.in/${city}?format=%t;%f;%p;%w;%h;%C;%W`);
        const [t,f,p,w,h,c,wd] = (await res.text()).split(";");

        condEl.textContent = c;

        dataEl.innerHTML = `
            ${block("temperature", t, "Temperatuur")}
            ${block("thermometer", f, "Voelt als")}
            ${block("rain", p, "Neerslag")}
            ${block("wind", w, "Wind")}
            ${block("compass", wd, "Windrichting")}
            ${block("humidity", h, "Luchtvochtigheid")}
        `;
    }
    catch {
        /* FALLBACK */
        dataEl.innerHTML = `
            <iframe 
                src="https://weatherwidget.io/w/?id=${city}&lang=nl"
                style="width:100%;border:none;height:200px">
            </iframe>`;
        condEl.textContent = "Fallback actief";
    }
}

function block(iconName, value, label){
    return `
        <div class="icon-block">
            <img src="${icon(iconName)}">
            <div class="icon-value">${value}</div>
            <div class="icon-label">${label}</div>
        </div>`;
}

function loadAll(){
    locations.forEach(loadWeather);
    document.getElementById("updated").textContent =
        "Laatst bijgewerkt: " + new Date().toLocaleTimeString("nl-NL");
}

/* INIT */
loadAll();
setInterval(loadAll, 600000);

/* KIOSK FULLSCREEN */
document.documentElement.requestFullscreen?.();
