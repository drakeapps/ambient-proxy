// Most of this is just pulled from the ambient-weather-api example

const AmbientWeatherApi = require('ambient-weather-api');
const WebSocket = require('ws');

// set of all connections to WS server
let connections = new Set();
// lastData received
let lastData = null;

const verboseLog = (message) => {
    // should be a command line argument, but I don't want to bring in all the parsing
    // this will mostly be a docker thing, so having an extra environment variable for this seems ok
    if (process.env.AMBIENT_VERBOSE) {
        console.log(message);
    }
};

const sendUpdate = (data) => {
    lastData = data;
    connections.forEach((conn) => {
        conn.send(JSON.stringify(data));
    });
}

const apiKey = process.env.AMBIENT_API_KEY;
const applicationKey = process.env.AMBIENT_APPLICATION_KEY;

if (!apiKey || !applicationKey) {
    console.error('Missing Ambient Weather API or Application Key');
    process.exit();
}

const wsPort = parseInt(process.env.AMBIENT_WS_PORT) || 8080
const wss = new WebSocket.Server({ port: wsPort });

wss.on('connection', (ws) => {
    connections.add(ws);
    if (lastData) {
        ws.send(JSON.stringify(lastData));
    }
});

wss.on('close', (ws) => {
    connections.delete(ws);
});

const api = new AmbientWeatherApi({
    apiKey,
    applicationKey: applicationKey
});

api.connect();
api.on('connect', () => verboseLog('Connected to Ambient Weather Realtime API!'));

api.on('subscribed', data => {
    verboseLog(`subscribed: `);
    verboseLog(data);
    sendUpdate(data.devices[0].lastData);
});
api.on('data', data => {
    verboseLog(`received: `);
    verboseLog(data);
    sendUpdate(data);
});
api.subscribe(apiKey);
