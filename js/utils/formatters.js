/**
 * Formats a cryptocurrency price with dynamic decimal places based on its value
 * @param {number} price - The price to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted price string
 */
export function formatCryptoPrice(price) {
    if (typeof price !== 'number') {
        price = Number(price);
    }

    // Handle invalid or zero prices
    if (!price || isNaN(price)) {
        return '$0.00';
    }

    // Define thresholds and their corresponding decimal places
    const thresholds = [
        { value: 1000, decimals: 2 },    // $1,000+ shows 2 decimals
        { value: 1, decimals: 2 },       // $1+ shows 2 decimals
        { value: 0.01, decimals: 4 },    // $0.01+ shows 4 decimals
        { value: 0.0001, decimals: 6 },  // $0.0001+ shows 6 decimals
        { value: 0, decimals: 8 }        // Below $0.0001 shows 8 decimals
    ];

    // Find the appropriate threshold
    const { decimals } = thresholds.find(t => price >= t.value) || thresholds[thresholds.length - 1];

    // Format the number with the determined decimal places
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(price);

    return formattedPrice;
}

/**
 * Formats a percentage change value
 * @param {number} value - The percentage value to format
 * @returns {string} - Formatted percentage string
 */
export function formatPercentageChange(value) {
    if (typeof value !== 'number') {
        value = Number(value);
    }

    // Handle invalid values
    if (isNaN(value)) {
        return '0.00%';
    }

    // Always show 2 decimal places for percentages
    return value.toFixed(2) + '%';
}
