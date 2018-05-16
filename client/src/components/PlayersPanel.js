import React from 'react';

const PlayerPanel = ({ players, username }) => (
    players.map(player => {
        return (
            <div className="player" key={player.username}>
                <div className={player.eliminated ? 'player-out' : '' }><img src="http://via.placeholder.com/125x125" alt={player.username} /></div>
                <div style={player.username === username ? {color: 'blue'} : {color: 'black'}}>{player.username}</div>
            </div>
        );
    })
);

export default PlayerPanel;