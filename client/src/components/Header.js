import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return <div className="header"><Link to="/"><img src={`https://res.cloudinary.com/hogae7vnc/image/upload/v1526402599/mafia-logo.png`} alt="Mafia Logo" className="logo" /></Link></div>
};

export default Header;