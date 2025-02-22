const fs = require('fs');

// Load and parse the JSON file
const rawData = fs.readFileSync('./src/tags.json');
const jsonData = JSON.parse(rawData);

/**
 * Function to search for objects based on a key-value pair.
 * @param {string} key - The key to search for.
 * @param {string|number} value - The value to match.
 * @returns {object|array|null} - The matched object(s) or null if not found.
 */
const searchJSON = (key, value) => {
    const cleanValue = decodeURIComponent(value).toLowerCase().trim(); // Clean up response
    result = {}; // Store result in memory

    switch (key) {
        case 'id':
           result = jsonData.find(obj => obj[key] == cleanValue);
            break;
        case 'name':
        case 'aliases':
            result = jsonData.filter(obj =>
                (obj['aliases'] && obj['aliases'].toString().toLowerCase().includes(cleanValue)) || 
                (obj['name'] && obj['name'].toString().toLowerCase().includes(cleanValue)))
            break;
        default: 
           result = jsonData.filter(obj => 
               obj[key] && obj[key].toString().toLowerCase().includes(cleanValue) // Case-insensitive partial match
           );
           break;
    }

    return result;

    
}

module.exports = { searchJSON };