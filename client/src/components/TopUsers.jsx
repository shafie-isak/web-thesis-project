import React, { useEffect, useState } from "react";
import { getTopUsers } from "../utils/api";

const TopUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getTopUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="p-4 rounded-lg bg-white/5 text-white">
      <h3 className="text-lg font-semibold mb-4">Top users</h3>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-lg"
          >
            <div className="flex items-center gap-2 w-52">
              <img
                src={user.profilePicture || "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.692268007.1730776170&semt=ais_hybrid&w=740"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs opacity-60">{user.coins} Coins</p>
              </div>
            </div>
            <span className="text-xs bg-white/10 px-2 py-1 rounded">
              {user.level}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;
