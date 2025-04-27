import styles from './Button.module.css';

const Button = ({
                    children,
                    variant = 'primary',
                    onClick,
                    type = 'button',
                    disabled = false,
                    className = ''
                }) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;