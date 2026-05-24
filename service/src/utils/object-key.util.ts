
/**
 * convert a key to camelcase.
 *
 * @param {string} str - An object key.
 * @returns {string} - A camelCase object key.
 */
const camelCase = (str: string): string => {
    return str.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
}

const formatKey = (key: string): string => {
    if (key.startsWith('_')) {
        return key.substring(1);
    }
    return key;
}

/**
 * Convert all object keys to camelcase.
 *
 * @param {any} obj - An array or an object.
 * @returns {any} - Return data in camelcase objects.
 */
export const toCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(toCamelCase);
    } else if (obj && typeof obj === 'object' && typeof obj.getMonth !== 'function') {
        return Object.keys(obj).reduce((acc, key) => {
            acc[camelCase(formatKey(key))] = toCamelCase(obj[key]);
            return acc;
        }, {} as any);
    }
    return obj;
};