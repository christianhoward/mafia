import React from "react";

const Button = ({ disabled, value, onClick, use, children, className }) => (
        <div className={className}>
                <button data-use={use} value={value} disabled={!disabled ? false : disabled} onClick={onClick}>{value !== children && children ? children : value}</button>
        </div>
);

export default Button;