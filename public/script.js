// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

// prayer times API endpoint
const API_ENDPOINT = "/api";

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

function getTZOffset(date) {
    return -date.getTimezoneOffset() / 60;
}

function isDaylightSavingTime(date) {
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    // check DST by comparing max standard offset with current offset
    return Math.max(january, july) !== date.getTimezoneOffset() ? 1 : 0;
}

function prepareQueryParams(currentParams) {
    const params = new URLSearchParams(currentParams);
    if (!params.has("tz")) {
        params.set("tz", getTZOffset(new Date()));
    }
    if (!params.has("dst")) {
        params.set("dst", isDaylightSavingTime(new Date()));
    }
    return `?${params.toString()}`;
}

function getPrayerTimes() {
    fetch(`${API_ENDPOINT}/${prepareQueryParams(window.location.search)}`)
        .then((response) => response.json())
        .then((body) => populatePrayerEntries(body.meta, body.data))
        .catch((err) => console.error(err));
}
