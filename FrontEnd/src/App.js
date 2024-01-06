import React from "react";
import Chat from "./Components/Chat";
import PrivateChat from "./Components/PrivateChat";
import { users } from "./Components/UserList";
function App() {
  return (
    <div>
      <PrivateChat users={users} />
      <Chat />
    </div>
  );
}

export default App;
