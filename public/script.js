// alias for retrieving DOM elements
const $$ = (el) => document.querySelector(el);

window.onload = function () {
    document.body.addEventListener("htmx:configRequest", (e) => {
        e.detail.parameters = prepareQueryParams(window.location.search);
    });
};

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
    return params;
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
