const server = require('http').createServer();

const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']
});

const COUNTRIES_DATA = [
    {
        country: "AE",
        latitude: 23.424076,
        longitude: 53.847818,
        name: "United Arab Emirates"
    },
    {
        country: "AO",
        latitude: -11.202692,
        longitude: 17.873887,
        name: "Angola"
    },
    {
        country: "AR",
        latitude: -38.416097,
        longitude: -63.616672,
        name: "Argentina"
    },
    {
        country: "AT",
        latitude: 47.516231,
        longitude: 14.550072,
        name: "Austria"
    },
    {
        country: "AU",
        latitude: -25.274398,
        longitude: 133.775136,
        name: "Australia"
    },
    {
        country: "BD",
        latitude: 23.684994,
        longitude: 90.356331,
        name: "Bangladesh"
    }, {
        country: "BD",
        latitude: 23.684994,
        longitude: 90.356331,
        name: "Bangladesh"
    },
    {
        country: "BE",
        latitude: 50.503887,
        longitude: 4.469936,
        name: "Belgium"
    },
    {
        country: "BG",
        latitude: 42.733883,
        longitude: 25.48583,
        name: "Bulgaria"
    },
    {
        country: "BR",
        latitude: -14.235004,
        longitude: -51.92528,
        name: "Brazil"
    },
    {
        country: "CA",
        latitude: 56.130366,
        longitude: -106.346771,
        name: "Canada"
    },
    {
        country: "CH",
        latitude: 46.818188,
        longitude: 8.227512,
        name: "Switzerland"
    },
    {
        country: "CL",
        latitude: -35.675147,
        longitude: -71.542969,
        name: "Chile"
    },
    {
        country: "CN",
        latitude: 35.86166,
        longitude: 104.195397,
        name: "China"
    }];
const generateRandomPoint = (radius) => {
    var x0 = 18.068581;
    var y0 = 59.329323;
    // Convert Radius from meters to degrees.
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var xp = x / Math.cos(y0);

    // Resulting point.
    return { latitude: y + y0, longitude: xp + x0 };
}
// 1. listen for socket connections
let idCount = 0;
let country_i = 0;
io.on('connection', client => {
    console.log('Connected to Server');
    setInterval(() => {
        let country = COUNTRIES_DATA[country_i++]

        // 2. every second, emit a 'cpu' event to user
        let idCounttemp = idCount++;
        let locationTemp = generateRandomPoint(50000);
        let unlocksData = {
            country: "CA",
            latitude: country.latitude,
            longitude: country.longitude,
            name: "Canada"
        }
        // let unlocksData = {
        //     id: idCounttemp,
        //     actor_type: "string",
        //     actor_id: 0,
        //     actor_name: "string",
        //     action: "unlock",
        //     object_type: "Lock",
        //     object_id: 0,
        //     object_name: "string",
        //     success: true,
        //     error_code: null,
        //     error_message: null,
        //     created_at: new Date(),
        //     location: { latitude: 18.068581, longitude: 59.329323 },
        //     references: [
        //         {
        //             id: 0,
        //             type: "Lock"
        //         },
        //         {
        //             id: 0,
        //             type: "Organization"
        //         },
        //         {
        //             id: 0,
        //             type: "Place"
        //         },
        //         {
        //             id: 0,
        //             type: "RoleAssignment"
        //         }
        //     ]
        // }
        client.emit('unlock', unlocksData);
    }, 8000);
});

server.listen(4000);
