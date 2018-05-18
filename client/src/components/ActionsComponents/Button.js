import React from "react";

const Button = ({ disabled, value, onClick, use }) => (
        <button data-use={use} value={value} disabled={!disabled ? false : disabled} onClick={onClick}>{value}</button>
);

export default Button;