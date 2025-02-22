const fs = require('fs');

// Load and parse the JSON file
const rawData = fs.readFileSync('./src/tags.json');
const jsonData = JSON.parse(rawData);

/**
 * Function to search for tags based on a key-value pair.
 * @param {string} key - The key to search for.
 * @param {string|number} value - The value to match.
 * @returns {object|array|null} - The matched object(s) or null if not found.
 */
const searchJSON = (key, value) => {
    const cleanValue = decodeURIComponent(value).toLowerCase().trim(); // Clean up response
    let result = {}; // Store result in memory

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

/**
 * Function to create an array of parents of a tag given the child tag id.
 * @param {string} id - The child tag id to search for.
 * @returns {object|array|null} - The matched object(s) or null if not found.
 */
const getParents = (id) => {
    let result = []; // Result will be stored in memory as an empty object to start

    const childTag = searchJSON('id', id); // Finds child tag containing list of parents
    
    if (!childTag || !Array.isArray(childTag['parents'])) return null; // returns null if tag is invalid

    for (let parentId of childTag['parents']) {
        let parentTag = jsonData.find(obj => obj['id'] === parentId);
        if (parentTag) result.push(parentTag);
    }

    return result.length > 0 ? result : null; // Returns result if array is not empty, null otherwise
}

/**
 * Function to create a new tag
 * @param {object} tag - tag data to be added
 * @returns {none} - This function returns nothing.
 */
const addTag = (newTag) => {
    // Dynamically assign ID
    const maxId = jsonData.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
    newTag.id = maxId + 1; // Assign next available ID

    jsonData.push(newTag);
    console.log(`Tag "${newTag.name}" has been added at ID ${newTag.id}`);
};

module.exports = { searchJSON, getParents, addTag };