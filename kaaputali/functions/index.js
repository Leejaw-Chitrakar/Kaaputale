const { onCall } = require("firebase-functions/v2/https");

exports.yourV2CallableFunction = onCall(
    {
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },
    (request) => {
        // request.app contains data from App Check, including the app ID.
        // Your function logic follows.
        return { data: "This is a secured response" };
    }
);
