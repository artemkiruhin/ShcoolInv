import styles from './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
    const statusText = {
        good: 'Отличное',
        warning: 'Требует проверки',
        bad: 'В ремонте',
        scrapped: 'Списано'
    };

    return (
        <span className={`${styles.statusBadge} ${styles[status]}`}>
      {statusText[status]}
    </span>
    );
};

export default StatusBadge;