import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, change, gradient }) => {
    return (
        <div className={`${styles.card} ${styles[gradient]}`}>
            <h3>{title}</h3>
            <div className={styles.value}>{value}</div>
            <div className={styles.change}>{change}</div>
        </div>
    );
};

export default StatsCard;