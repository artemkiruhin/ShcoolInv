import styles from './FilterDropdown.module.css';

const FilterDropdown = ({
                            options = [],
                            selectedValue,
                            onChange,
                            defaultLabel = "Все категории",
                            className = ''
                        }) => {
    return (
        <div className={`${styles.filterDropdown} ${className}`}>
            <select
                value={selectedValue}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="all">{defaultLabel}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropdown;