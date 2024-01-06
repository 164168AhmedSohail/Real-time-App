import React from "react";

export const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
];

const UserList = ({ onSelect }) => {
  return (
    <div
      style={{ width: "20%", padding: "10px", borderRight: "1px solid #ccc" }}
    >
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onSelect(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
