// ensure page has loaded before running code
window.onload = function () {
    // set default date to today
    const today = new Date();
    document.querySelector("#date").value = [
        today.getFullYear(),
        (today.getMonth() + 1).toString().padStart(2, "0"),
        today.getDate().toString().padStart(2, "0"),
    ].join("-");

    // process params to send with request
    document.body.addEventListener("htmx:configRequest", (e) => {
        // add dst status to request params
        e.detail.parameters["dst"] = isDST(new Date(e.detail.parameters["date"]))
            ? "1"
            : "0";
        console.log(e.detail.parameters["dst"]);

        // add timezone offset to request params
        e.detail.parameters["tz"] =
            -today.getTimezoneOffset() / 60 - parseInt(e.detail.parameters["dst"]);
        console.log(e.detail.parameters["tz"]);

        // parse date input
        [
            e.detail.parameters["year"],
            e.detail.parameters["month"],
            e.detail.parameters["date"],
        ] = e.detail.parameters["date"].split("-");
    });
};

function isDST(d) {
    const year = d.getFullYear();
    const jan = new Date(year, 0, 1).getTimezoneOffset();
    const jul = new Date(year, 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
}
