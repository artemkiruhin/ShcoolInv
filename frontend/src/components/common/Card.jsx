import React from 'react';
import PropTypes from 'prop-types';
import './../../assets/styles/global.css';

const Card = ({ children, className = '', title }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
};

export default Card;