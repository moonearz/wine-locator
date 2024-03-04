const net = require('net');

const server = net.createServer((socket) => {
    socket.on("data", (buffer) => {
        const requestString = buffer.toString('utf-8');

        const request = parseRequest()
        console.log(requestString);
    })
})

const parseRequest = (requestString) => {
    const[method, path, protocol] = requestString.split(" ");

    return {
        method,
        path,
        protocol
    }
}
server.listen(9999, () => console.log("listening"))