import io from "socket.io-client";

const socket = io("http://localhost:3003", {
  autoConnect: false, // Pour contrôler manuellement quand connecter et déconnecter
});

export const connectSocket = () => {
  console.log("Attempting to connect to socket...");
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const sendMessage = (message) => {
  socket.emit("send_message", message);
};

export const onMessageReceived = (callback) => {
  socket.on("receive_message", callback);
};

export const onConnectionStatusChange = (callback) => {
  socket.on("connect", () => {
    console.log("Connected to server");
    callback(true);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
    callback(false);
  });
};

export const onUsersCountReceived = (callback) => {
  socket.on("usersCount", (data) => {
    console.log("Nombre d'utilisateurs connectés reçu:", data.count); // Log ici
    callback(data);
  });
};


export default socket;
