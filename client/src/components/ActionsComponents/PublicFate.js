import React from 'react';

import Button from './Button';

const PublicFate = ({ nominations, handleVote, submitVote, fate }) => (
    <div>
        {nominations.filter(player => player.seconded === true).map(player => {
            return (
                <div key={player.username}>
                    The group must determine the fate of <strong>{player.username.toUpperCase()}</strong>. Do you think they are a member of the Mafia and should be eliminated?
                    <div className="button-group">
                        <Button 
                            value={player.username} 
                            onClick={(e) => {handleVote('fate', e); submitVote(e);}}
                            disabled={fate.find(fate => fate.username === player.username)}
                            use="Public-Fate" 
                            className="button-group__button"
                        >Yes</Button>
                        <Button 
                            value={player.username} 
                            onClick={(e) => {handleVote('fate', e); submitVote(e);}}
                            disabled={fate.find(fate => fate.username === player.username)}
                            use="Public-Fate" 
                            className="button-group__button" 
                        >No</Button>
                    </div>
                </div>
            );
        })}
    </div>
);

export default PublicFate;