import React from "react";

const Button = ({ disabled, value, onClick }) => (
        <button value={value} disabled={!disabled ? false : disabled} onClick={onClick}>{value}</button>
);

export default Button;