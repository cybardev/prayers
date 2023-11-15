// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

// prayer times API endpoint
const API_ENDPOINT = "/api";

/**
 * Generate a table row with given prayer information
 *
 * @param {String} name prayer name
 * @param {String} time time of azan
 * @returns HTML table row
 */
function prayerEntry(name, time) {
    return `<tr><td>${name}</td><td>${time}</td></tr>`;
}

/**
 * Populate metadata slots in page
 *
 * @param { {
 *      date: { year: Number, month: Number, day: Number },
 *      position: { latitude: Number, longitude: Number }
 * } } data info about the request
 */
function populateMetadata(data) {
    $$("#date").innerText = Object.values(data.date).join("-");
    $$("#latitude").innerText = data.position.latitude;
    $$("#longitude").innerText = data.position.longitude;
}

/**
 * Populate prayer entries into table
 *
 * @param { {
 *      prayers: {
 *          fajr: String,
 *          zuhr: String,
 *          asr: String,
 *          maghrib: String,
 *          isha: String
 *      },
 *      extras: {
 *          imsak: String, sunrise: String, sunset: String, midnight: String
 *      }
 * } } data prayer time data
 */
function populatePrayerEntries(data) {
    const prayers = $$("#prayers");
    for (const [prayer, time] of Object.entries(data.prayers)) {
        prayers.insertAdjacentHTML("beforeend", prayerEntry(prayer, time));
    }
}

/**
 * Get timezone offset from given date
 *
 * @param {Date} date date to get timezone offset from
 * @returns timezone offset in hours
 */
function getTZOffset(date) {
    return -date.getTimezoneOffset() / 60;
}

/**
 * Get daylight saving time indicator from given date
 *
 * @param {Date} date date to check for daylight saving time
 * @returns 1 if DST is active, 0 otherwise
 */
function isDaylightSavingTime(date) {
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    // check DST by comparing max standard offset with current offset
    return Math.max(january, july) !== date.getTimezoneOffset() ? 1 : 0;
}

/**
 * Prepare query params for API endpoint
 *
 * Adds timezone and DST indicator if they are not present in the query params.
 * If they are present, they are not changed.
 *
 * Note: This function assumes that the current query params are valid.
 * If they are not, the API endpoint may return unexpected results.
 *
 * @param {String} currentParams current query params
 * @returns query params with timezone and DST indicator added
 */
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

/**
 * Get prayer times from API
 */
function getPrayerTimes() {
    fetch(`${API_ENDPOINT}/${prepareQueryParams(window.location.search)}`)
        .then((response) => response.json())
        .then((body) => {
            populateMetadata(body.meta);
            populatePrayerEntries(body.data);
        })
        .catch((err) => console.error(err));
}
