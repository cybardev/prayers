import prayTimes from "./PrayTimes.mjs";

/**
 * Generate JSON object from URL query params
 *
 * @param {String} url request URL
 * @returns object containing query param info
 */
function parseURL(url) {
    const args = new URL(url).searchParams;
    return {
        latitude: parseFloat(args.get("latitude")),
        longitude: parseFloat(args.get("longitude")),
        year: parseInt(args.get("year")),
        month: parseInt(args.get("month")),
        date: parseInt(args.get("date")),
        tz_offset: parseInt(args.get("tz")),
        dst: parseInt(args.get("dst")),
    };
}

/**
 * Get valid latitude and longitude from query params
 *
 * @param {Number} latitude latitude in degrees
 * @param {Number} longitude longitude in degrees
 * @returns processed latitude and longitude
 */
function processPos(latitude, longitude) {
    // default coordinates: Halifax, NS, Canada
    const defaultPos = { latitude: 44.65, longitude: -63.57 };
    return isNaN(latitude) || isNaN(longitude)
        ? defaultPos
        : { latitude: latitude, longitude: longitude };
}

/**
 * Get valid date info from query params
 *
 * @param {Number} year year for prayer times
 * @param {Number} month month for prayer times (1-12)
 * @param {Number} date date for prayer times (1-31)
 * @returns year, month, and date for prayer times
 */
function processDate(year, month, date) {
    // default date: today
    const today = new Date();
    return {
        year: isNaN(year) ? today.getFullYear() : year,
        month: isNaN(month) ? today.getMonth() + 1 : month,
        date: isNaN(date) ? today.getDate() : date,
    };
}

/**
 * Return DST status of given Date object
 *
 * source: https://stackoverflow.com/a/30280636
 *
 * @param {Date} d date to check DST status of
 * @returns true if DST is in effect, false otherwise.
 */
function isDST(d) {
    const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
}

/**
 * Process timezone offset and daylight saving time indicator from query params
 *
 * @param {Number} tz_offset timezone offset in hours
 * @param {0 | 1} dst daylight saving time indicator
 * @returns timezone offset, daylight saving time indicator, and time format
 */
function processTime(tz_offset, dst) {
    // default timezone: Atlantic Standard Time (AST) or Atlantic Daylight Time (ADT)
    const ast = { tz_offset: -4, dst: isDST(new Date()) ? 1 : 0 };
    return {
        tz_offset:
            isNaN(tz_offset) || tz_offset < -12 || tz_offset > 12
                ? ast.tz_offset
                : tz_offset,
        dst: [0, 1].includes(dst) ? dst : ast.dst,
        timefmt: "12h",
    };
}

/**
 * Generate prayer times and relevant info from query params
 *
 * @param {String} params query params
 * @returns prayer times and relevant info
 */
function getPrayerTimes(params) {
    const pos = processPos(params.latitude, params.longitude);
    const date = processDate(params.year, params.month, params.date);
    const timeinfo = processTime(params.tz_offset, params.dst);
    prayTimes.setMethod("ISNA");
    const times = prayTimes.getTimes(
        [date.year, date.month, date.date],
        [pos.latitude, pos.longitude],
        timeinfo.tz_offset,
        timeinfo.dst,
        timeinfo.timefmt
    );
    return {
        meta: {
            date: date,
            position: pos,
            timezone_offset: timeinfo.tz_offset,
            daylight_saving_time: timeinfo.dst,
        },
        data: {
            prayers: {
                fajr: times.fajr,
                zuhr: times.dhuhr,
                asr: times.asr,
                maghrib: times.maghrib,
                isha: times.isha,
            },
            extras: {
                imsak: times.imsak,
                sunrise: times.sunrise,
                sunset: times.sunset,
                midnight: times.midnight,
            },
        },
    };
}

/**
 * Generate response for succsessful request
 *
 * @param {String} url request URL
 * @returns response with prayer times and additional info
 */
function successResponse(url) {
    return new Response(
        JSON.stringify(getPrayerTimes(parseURL(url)), undefined, 2),
        {
            status: 200,
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Origin": "https://prayers.cybar.dev",
            },
        }
    );
}

export default successResponse;
