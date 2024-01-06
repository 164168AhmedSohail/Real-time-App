import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import UserList from "./UserList";
const socket = io.connect("http://localhost:4000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [selectedUser, setSelectedUser] = useState(""); // Added state for selected user
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("message", ({ username, message }) => {
      console.log(
        "here is my history of messages",
        messages,
        "recieved username",
        message
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        `${username}: ${message}`,
      ]);
    });

    socket.on("notification", (notification) => {
      console.log("notification", notification);
      setMessages((prevMessages) => [...prevMessages, notification]);
    });

    socket.on("messageHistory", (history) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...history.map(formatMessage),
      ]);
    });

    socket.on("privateMessage", ({ from, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `[Private from ${from}]: ${message}`,
      ]);
    });

    socket.on("typing", (message) => {
      console.log("recieving typing event", message);
      setIsTyping(true);
      setTyping(message);
    });
    socket.on("stoptyping", (message) => {
      console.log("recieving typing event", message);
      setIsTyping(false);
      setTyping(message);
    });
  }, []);

  const formatMessage = (item) => {
    if (typeof item === "string") {
      return item;
    } else {
      return `${item.username}: ${item.message}`;
    }
  };

  const joinRoom = () => {
    if (username && room) {
      socket.emit("joinRoom", { username, room });
    }
  };

  const sendMessage = () => {
    if (message) {
      // Check if a user is selected for private messaging
      if (selectedUser) {
        socket.emit("sendPrivateMessage", {
          from: username,
          to: selectedUser,
          message,
        });
      } else {
        // Send a regular message to the room
        socket.emit("sendMessage", { username, room, message });

        setTimeout(() => {
          handleTypingStop();
        }, 1000);
      }
      setMessage("");
    }
  };

  const handleTypingStart = () => {
    setIsTyping(true);
    socket.emit("typing", { username, room });
  };

  const handleTypingStop = () => {
    setIsTyping(false);
    socket.emit("stoptyping", { username, room });
  };

  const handleUserClick = (selectedUsername) => {
    setSelectedUser(selectedUsername);
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>

      <div id="chat" className="private-message">
        <ul>
          {messages.map((msg, index) => (
            <li
              key={index}
              onClick={() => handleUserClick(msg.split(":")[0])}
              className={
                selectedUser === msg.split(":")[0] ? "selected-user" : ""
              }
            >
              {msg}
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder={`Type your message${
            selectedUser ? ` to ${selectedUser}` : ""
          }...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTypingStart} // Start typing when a key is pressed
        />
        <button onClick={sendMessage}>Send</button>
        <p>{isTyping ? typing : null}</p>
      </div>
    </div>
  );
};

export default Chat;
