/**
 * API functions for report generation
 */
const reportApi = {
    /**
     * Generate and download Excel report
     * @param {string} reportType - Type of report to generate
     * @param {string} [condition] - Optional condition for inventory_by_condition report
     * @returns {Promise<Blob>} - Resolves with blob data for the report
     */
    generateExcelReport: async (reportType, condition = null) => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1234/api';
        const params = new URLSearchParams();
        params.append('report_type', reportType);

        if (condition) {
            params.append('condition', condition);
        }

        const url = `${baseUrl}/reports/excel?${params.toString()}`;
        const token = localStorage.getItem('authToken');

        const headers = {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.blob();
    }
};



export default reportApi;