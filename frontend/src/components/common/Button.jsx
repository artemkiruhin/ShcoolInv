import React from 'react';
import PropTypes from 'prop-types';
import './../../assets/styles/global.css';

const Button = ({ children, type = 'button', variant = 'primary', onClick, className = '', disabled = false }) => {
    return (
        <button
            type={type}
            className={`btn ${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'warning', 'success']),
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;