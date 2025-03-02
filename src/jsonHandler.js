const fs = require('fs');

// Load and parse the JSON file
const rawData = fs.readFileSync('./src/tags.json');
const jsonData = JSON.parse(rawData);

/**
 * Helper function to clean up search params so eslint stops yelling at me
 * @param {string|int} input - Input to clean up
 * @returns {string} - The clean string
 */
const prettify = (input) => input.toString().toLowerCase().trim();

/**
 * Function to search for tags based on a key-value pair.
 * @param {string} key - The key to search for.
 * @param {string|number} value - The value to match.
 * @returns {object|array|null} - The matched object(s) or null if not found.
 */
const searchJSON = (key, value) => {
  const cleanValue = prettify(decodeURIComponent(value)); // Clean up response
  let result = {}; // Store result in memory

  switch (key) {
    case 'id':
      result = jsonData.find((obj) => prettify(obj[key]) === cleanValue);
      break;
    case 'name':
    case 'aliases':
      result = jsonData.filter((obj) => (obj.aliases && prettify(obj.aliases).includes(cleanValue))
        || (obj.name && prettify(obj.name).includes(cleanValue)));
      break;
    default: // Case-insensitive partial match
      result = jsonData.filter((obj) => obj[key] && prettify(obj[key]).includes(cleanValue));
      break;
  }

  return result;
};

/**
 * Function to create an array of parents of a tag given the child tag id.
 * @param {string} id - The child tag id to search for.
 * @returns {object|array|null} - The matched object(s) or null if not found.
 */
const getParents = (id) => {
  const result = []; // Result will be stored in memory as an empty object to start

  const childTag = searchJSON('id', id); // Finds child tag containing list of parents

  if (!childTag || !Array.isArray(childTag.parents)) return null; // returns null if tag is invalid

  childTag.parents.forEach((parentId) => { // Use forEach instead of for...of
    const parentTag = jsonData.find((obj) => obj.id === parentId);
    if (parentTag) result.push(parentTag);
  });

  return result.length > 0 ? result : null; // Returns result if array is not empty, null otherwise
};

/**
 * Function to create a new tag
 * @param {object} tag - tag data to be added
 * @returns {int} - The ID of the new tag
 */
const addTag = (newTag) => {
  // Dynamically assign ID
  const maxId = jsonData.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
  const newTagWithID = {
    name: newTag.name,
    id: maxId + 1,
    description: newTag.description,
    aliases: newTag.aliases,
    cat: newTag.cat,
    parents: newTag.parents,
    vns: newTag.vns,
    meta: newTag.meta,
    applicable: newTag.applicable,
    searchable: newTag.searchable,
  };

  jsonData.push(newTagWithID);
  console.log(`Tag '${newTagWithID.name}' has been added at ID ${newTagWithID.id}`);
  return (newTagWithID.id);
};

/**
 * Function to update a tag by ID (in-memory only, preserves original data for blank form fields)
 * @param {object} updatedTag - The updated tag data.  Must include the tag's ID.
 * @returns {object} - An object with status on completion of tasks
 */
const editTag = (updatedTag) => {
  console.log(updatedTag.id);

  if (updatedTag.id === undefined || updatedTag.id === null || updatedTag.id === '') {
    return { bad: true };
  }

  // Find the index of the tag to update
  const index = jsonData.findIndex((obj) => obj.id.toString() === updatedTag.id.toString());

  console.log(index); // Helpful for debugging

  if (index === -1) {
    return { exists: false, updated: false, error: 'Tag not found' };
  }

  // Get the *existing* tag (for comparison)
  const existingTag = jsonData[index];

  // Create a copy to avoid modifying the original
  const updatedTagCopy = JSON.parse(JSON.stringify(updatedTag));

  // Update Tag Data
  // Iterate through the properties of the updatedTagCopy
  Object.keys(updatedTagCopy).forEach((key) => {
    if (updatedTagCopy[key] === '') {
      delete updatedTagCopy[key];
    }
  });

  const mergedTag = { ...existingTag, ...updatedTagCopy };

  // Check if there are any differences
  if (JSON.stringify(existingTag) === JSON.stringify(mergedTag)) {
    return { exists: true, updated: false, message: 'No changes detected' };
  }

  jsonData[index] = mergedTag;

  // Return
  return { exists: true, updated: true, message: 'Tag updated successfully' };
};

/**
 * Function to recursively build a tree of parent tags for a given child tag ID.
 * @param {number} childTagId - The ID of the child tag.
 * @returns {object | null} - A nested JSON object representing the parent hierarchy, or null.
 */
const buildParentTagTree = (childTagId) => {
  const childTag = searchJSON('id', childTagId);

  if (!childTag) {
    return null; // Tag not found
  }

  const parentIds = childTag.parents;

  if (!parentIds || parentIds.length === 0) {
    return childTag; // Base case
  }

  // Recursive case
  const parents = parentIds.map((parentId) => buildParentTagTree(parentId));

  // Create a new object to represent the parent tree
  const parentTree = {
    ...childTag, // Include the child tag's data
    inherits: parents, // Add the parent trees as children
  };

  return parentTree;
};

module.exports = {
  searchJSON, getParents, addTag, editTag, buildParentTagTree,
};
