import React from 'react';

import Button from './Button';

const DoctorVote = ({ players, submitVote, doctorSaved }) => (
    <div>
        <div>You saved <strong>{doctorSaved ? doctorSaved.toUpperCase() : 'NO ONE'}</strong> last night.</div>
        {players.filter(player => player.eliminated === false).map(player => {
            return (
                <div key={player.username}>
                    <Button use='Doctor' value={`Save ${player.username}`} onClick={submitVote} disabled={doctorSaved === player.username} />
                </div>
            );
        })}
    </div>
);

export default DoctorVote;