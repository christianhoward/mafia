import React from 'react';

import Button from './Button';

const PublicNomination = ({ handleVote, accusation }) => (
    <div>
        <div>Would you like to accuse a Villager?</div>
        <Button 
            value={'Yes'} 
            onClick={(e) => {handleVote('accusation', e)}}
            disabled={accusation === 'No'}
            use="generic" 
        />
        <Button 
            value={'No'} 
            onClick={(e) => {handleVote('accusation', e)}}
            disabled={accusation === 'No'}
            use="generic"  
        />
    </div>
);

export default PublicNomination;