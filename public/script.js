// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function prayerEntry(name, time) {
    return `<tr><td>${name}</td><td>${time}</td></tr>`;
}

function populatePrayerEntries(meta, data) {
    // metadata
    $$("#date").innerText = Object.values(meta.date).join("-");
    $$("#latitude").innerText = meta.position.latitude;
    $$("#longitude").innerText = meta.position.longitude;
    // prayer times
    const prayers = $$("#prayers");
    for (const [prayer, time] of Object.entries(data.prayers)) {
        prayers.insertAdjacentHTML("beforeend", prayerEntry(prayer, time));
    }
}

function getPrayerTimes() {
    fetch(`/api/${window.location.search}`)
        .then((response) => response.json())
        .then((body) => populatePrayerEntries(body.meta, body.data))
        .catch((err) => console.error(err));
}
