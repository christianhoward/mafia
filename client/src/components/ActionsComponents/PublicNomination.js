import React from 'react';

import Button from './Button';

const PublicNomination = ({ handleVote, accusation }) => (
    <div className="module">
        <div className="role">Would you like to accuse a Villager?</div>
        <div className="button-group">
                <Button 
                    value={'Yes'} 
                    onClick={(e) => {handleVote('accusation', e)}}
                    disabled={accusation === 'No'}
                    use="generic"
                    className="button-group__button" 
                />
                <Button 
                    value={'No'} 
                    onClick={(e) => {handleVote('accusation', e)}}
                    disabled={accusation === 'No'}
                    use="generic" 
                    className="button-group__button" 
                />
        </div>
    </div>
);

export default PublicNomination;