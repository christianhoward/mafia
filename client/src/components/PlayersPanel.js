import React from 'react';

const PlayerPanel = ({ players }) => (
    players.map(player => {
        return (
            <div key={player.username}>
                <div><img src="http://via.placeholder.com/125x125" /></div>
                <div>{player.username}</div>
            </div>
        );
    })
);

export default PlayerPanel;