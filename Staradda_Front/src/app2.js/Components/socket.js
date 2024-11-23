const { io } = require("socket.io-client");
const EndPoint = process.env.REACT_APP_API_URL;
const socket = io(EndPoint, { transports: ["websocket"] });

socket.on("connect_error", () => {
  // revert to classic upgrade
  socket.io.opts.transports = ["polling", "websocket"];
});
export default socket;
