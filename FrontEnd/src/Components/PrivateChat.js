import React, { useState } from "react";

const ChatWindow = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!selectedUser || newMessage.trim() === "") return;

    setMessages([...messages, { sender: "You", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <div>
        <h2>Select a user to chat</h2>
        <select
          onChange={(e) =>
            setSelectedUser(
              users.find((user) => user.id === parseInt(e.target.value))
            )
          }
        >
          <option value="" disabled>
            Select a user
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div>
          <h2>Chat with {selectedUser.name}</h2>
          {messages.length >= 1 && (
            <div
              style={{
                border: "1px solid #ccc",
                height: "300px",
                overflowY: "auto",
                marginBottom: "10px",
              }}
            >
              {messages.map((message, index) => (
                <div key={index}>
                  <strong>{message.sender}:</strong> {message.text}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, marginRight: "10px" }}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
