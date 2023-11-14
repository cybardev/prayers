import res from "../../src/prayertimes.mjs";

export function onRequest(context) {
    return context.request.method === "GET"
        ? res.validResponse(context.request.url)
        : res.invalidResponse();
}
