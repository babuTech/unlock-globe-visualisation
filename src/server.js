const server = require('http').createServer();

const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']
});
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
io.on('connection', client => {
    console.log('Connected to Server');
    setInterval(() => {
        // 2. every second, emit a 'cpu' event to user
        let idCounttemp = idCount++;
        let locationTemp = generateRandomPoint(2000);
        let unlocksData = {
            id: idCounttemp,
            actor_type: "string",
            actor_id: 0,
            actor_name: "string",
            action: "unlock",
            object_type: "Lock",
            object_id: 0,
            object_name: "string",
            success: true,
            error_code: null,
            error_message: null,
            created_at: new Date(),
            location: { latitude: 18.068581, longitude: 59.329323 },
            references: [
                {
                    id: 0,
                    type: "Lock"
                },
                {
                    id: 0,
                    type: "Organization"
                },
                {
                    id: 0,
                    type: "Place"
                },
                {
                    id: 0,
                    type: "RoleAssignment"
                }
            ]
        }
        client.emit('unlock', unlocksData);
    }, 8000);
});

server.listen(4000);
