// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

function prayerEntry(name, time) {
    return `<tr><td>${name}</td><td>${time}</td></tr>`;
}

function populatePrayerEntries(entries) {
    // metadata
    $$("#date").innerText = Object.values(entries.meta.date).join("-");
    $$("#latitude").innerText = entries.meta.position.latitude;
    $$("#longitude").innerText = entries.meta.position.longitude;
    // prayer times
    const prayers = $$("#prayers");
    for (const [prayer, time] of Object.entries(entries.data.prayers)) {
        prayers.insertAdjacentHTML("beforeend", prayerEntry(prayer, time));
    }
}

function getPrayerTimes() {
    fetch(`/api/${window.location.search}`)
        .then((response) => response.json())
        .then(populatePrayerEntries)
        .catch(console.error);
}
