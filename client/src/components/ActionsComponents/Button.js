import React from "react";

const Button = ({ disabled, value, onClick, use, children }) => (
        <button data-use={use} value={value} disabled={!disabled ? false : disabled} onClick={onClick}>{value !== children && children ? children : value}</button>
);

export default Button;