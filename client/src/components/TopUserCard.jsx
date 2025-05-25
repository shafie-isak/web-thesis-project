import React from 'react';

const TopUserCard = ({ name, coins, avatar }) => {
  return (
    <div className="flex items-center justify-between bg-white bg-opacity-10 hover:bg-opacity-20 transition p-3 rounded-xl mb-3 cursor-pointer">
      <div className="flex items-center gap-3">
        <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-white text-opacity-70">{coins} Coins</p>
        </div>
      </div>
      <span className="text-white text-xl font-bold">&gt;</span>
    </div>
  );
};

export default TopUserCard;
