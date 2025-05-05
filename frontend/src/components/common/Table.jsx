import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ headers, data, renderRow, emptyMessage = 'No data available', className = '' }) => {
    return (
        <div className="overflow-x-auto">
            <table className={`table ${className}`}>
                <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => renderRow(item, index))
                ) : (
                    <tr>
                        <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string,
    className: PropTypes.string,
};

export default Table;