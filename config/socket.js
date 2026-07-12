function attachSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('subscribe:route', (routeId) => {
      if (typeof routeId === 'string') socket.join(`route:${routeId}`);
    });

    socket.on('unsubscribe:route', (routeId) => {
      if (typeof routeId === 'string') socket.leave(`route:${routeId}`);
    });

    socket.on('disconnect', () => {
      // no-op for now; room membership is cleaned up automatically
    });
  });
}

module.exports = attachSocketHandlers;
