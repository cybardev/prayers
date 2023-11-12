// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function prayerEntry(name, time) {
    return `<tr><td>${name}</td><td>${time}</td></tr>`;
}

function getPrayerTimes() {
    fetch(`/api/${window.location.search}`)
        .then((response) => response.json())
        .then((body) => {
            // metadata
            $$("#date").innerText = Object.values(body.meta.date).join("-");
            $$("#latitude").innerText = body.meta.position.latitude;
            $$("#longitude").innerText = body.meta.position.longitude;
            // prayer times
            const prayers = $$("#prayers");
            for (const [prayer, time] of Object.entries(body.data.prayers)) {
                prayers.insertAdjacentHTML(
                    "beforeend",
                    prayerEntry(prayer, time)
                );
            }
        })
        .catch((err) => console.error(err));
}
