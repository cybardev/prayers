import successResponse from "../../src/prayers.mjs";

/**
 * Event handler for GET requests
 *
 * @param {EventContext} context Cloudflare Pages custom context object
 * @returns {Response} response sent on successful request
 */
export function onRequestGet(context) {
    return successResponse(context.request.url);
}
