const { io } = require("socket.io-client");
const EndPoint = process.env.REACT_APP_BACKEND_LOCAL_API;
const socket = io(EndPoint, { transports: ["websocket"] });

socket.on("connect_error", () => {
  socket.io.opts.transports = ["polling", "websocket"];
});
export default socket;
