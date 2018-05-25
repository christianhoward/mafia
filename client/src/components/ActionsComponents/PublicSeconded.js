import React from 'react';

import Button from './Button';

const PublicSeconded = ({ handleVote, submitVote, seconded, nominations, username, nominator }) => (
    <div>
        {nominations.map(player => {
            return (
                <div key={player.username}>
                    <div>Is there a second for {player.username}?</div>
                    <Button 
                        value={player.username} 
                        onClick={(e) => {handleVote('seconded', e); submitVote(e);}}
                        disabled={nominator === username ? true : seconded.length}
                        use="Public-Seconded" 
                    >Yes</Button>
                    <Button 
                        value={'No'} 
                        onClick={(e) => {handleVote('seconded', e); submitVote(e);}}
                        disabled={nominator === username ? true : seconded.length}
                        use="Public-Seconded"  
                    />
                </div>
            );
        })}
    </div>
);

export default PublicSeconded;