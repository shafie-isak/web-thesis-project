import React from 'react';
import TopUserCard from './TopUserCard';

const mockUsers = [
  { name: 'Bile Abdulkadir', coins: 3200, avatar: '/avatars/user1.jpg' },
  { name: 'Shafie Abdi', coins: 3090, avatar: '/avatars/user2.jpg' },
  { name: 'Abdulkadir Hussein', coins: 2842, avatar: '/avatars/user3.jpg' },
  { name: 'Raxmo Mohamed', coins: 2590, avatar: '/avatars/user4.jpg' },
  { name: 'Asma Abdulkadir', coins: 2467, avatar: '/avatars/user5.jpg' },
];

const TopUsers = () => {
  return (
    <div className="bg-white bg-opacity-10 p-5 rounded-2xl text-white w-full lg:w-[340px] shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top users</h2>
      {mockUsers.map((user, i) => (
        <TopUserCard
          key={i}
          name={user.name}
          coins={user.coins}
          avatar={user.avatar}
        />
      ))}
    </div>
  );
};

export default TopUsers;
