import { io } from "socket.io-client";

const socket = io('http://127.0.0.1:3000', {
  path: '/events',
});
socket.on('connect', function() {
  console.log('Connected');

  socket.emit('events', { type: 'message', data: "test" });
  /*
  socket.emit('identity', 0, response =>
    console.log('Identity:', response),
  );
  */
});
socket.on('events', function(data) {
  console.log('event');
  console.log(data)
});
socket.on('exception', function(data) {
  console.log('event', data);
});
socket.on('disconnect', function() {
  console.log('Disconnected');
});
function AppV2() {
  return <>app v2</>
}

export default AppV2;
