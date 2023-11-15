import res from "../../src/prayertimes.mjs";

export function onRequestGet(ctx) {
    return res.validResponse(ctx.request.url);
}
