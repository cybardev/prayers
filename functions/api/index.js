import successResponse from "../../src/prayers.mjs";

export function onRequestGet(context) {
    return successResponse(context.request.url);
}
