const url = require('url'); // Import URL module

const json = require('./jsonHandler.js');

const pairSearch = (request, response) => {
  const parsedUrl = url.parse(request.url, true); // Parse the URL
  console.log(parsedUrl.query.key);
  console.log(parsedUrl.query.value);
  console.log(parsedUrl.query.filt);

  // fuzzy search
  const result = json.searchJSON(parsedUrl.query.key, parsedUrl.query.value, parsedUrl.query.filt);

  if (result) {
    if (result.error) {
      const responseObj = JSON.stringify(result);
      response.writeHead(400, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(responseObj) });
      response.end(responseObj);
    } else {
      const responseObj = JSON.stringify(result);
      response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(responseObj) }); // If results are found
      response.end(JSON.stringify(result));
    }
  } else {
    response.writeHead(404); // If results are not found
    response.end();
  }
};

const getParents = (request, response) => {
  const parsedUrl = url.parse(request.url, true); // Parse the URL
  console.log(parsedUrl.query.id);

  const result = json.getParents(parsedUrl.query.id); // Run helper function to find parents

  if (result) {
    const responseObj = JSON.stringify(result);
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(responseObj) }); // If results are found
    response.end(responseObj);
  } else {
    response.writeHead(404); // If results are not found
    response.end();
  }
};

const tagTree = (request, response) => {
  const parsedUrl = url.parse(request.url, true); // Parse the URL
  console.log(parsedUrl.query.id);

  const result = json.buildParentTagTree(parsedUrl.query.id);

  if (result) {
    const responseObj = JSON.stringify(result);
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(responseObj) }); // If results are found
    response.end(responseObj);
  } else {
    const message = JSON.stringify({ error: 'Tag not found' });
    response.writeHead(404, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) });
    response.end(message);
  }
};

const getRandomTag = (request, response) => {
  const result = json.getRandomTag();
  if (result) {
    const responseObj = JSON.stringify(result);
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(responseObj) }); // If results are found
    response.end(responseObj);
  } else {
    const message = JSON.stringify({ error: 'Tag not found' });
    response.writeHead(404, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) });
    response.end(message);
  }
};

const addTag = (request, response) => {
  if (request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });
    request.on('end', () => {
      try {
        let newTag = {};
        // Checks if URL encoded
        if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
          const urlParams = new URLSearchParams(body);
          urlParams.forEach((value, key) => {
            newTag[key] = value;
          });
          // Defaults to JSON
        } else {
          newTag = JSON.parse(body);
        }
        const newId = json.addTag(newTag); // Pushes new tag and gets ID
        const message = JSON.stringify({ message: `Tag added successfully at ID ${newId}` });
        response.writeHead(201, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) }); // 201 Created
        response.end(message); // Send a success message
      } catch (error) {
        const message = JSON.stringify({ error: 'Invalid JSON or tag data' });
        console.error('Error parsing JSON or adding tag:', error);
        response.writeHead(400, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) }); // 400 Bad Request
        response.end(message); // Send an error message
      }
    });
  } else {
    response.writeHead(405); // 405 Method Not Allowed
    response.end();
  }
};

const editTag = (request, response) => {
  if (request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });
    request.on('end', () => {
      try {
        let updatedTag = {};
        // Checks if URL encoded
        if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
          const urlParams = new URLSearchParams(body);
          urlParams.forEach((value, key) => {
            updatedTag[key] = value;
          });
          // Defaults to JSON
        } else {
          updatedTag = JSON.parse(body);
        }
        // Check if the tag exists and if there are any changes
        const result = json.editTag(updatedTag);
        if (result.updated) {
          const message = JSON.stringify({ message: 'Tag updated successfully' });
          response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) });
          response.end(message);
        } else if (result.exists) {
          response.writeHead(204, { 'Content-Type': 'application/json' });
          console.log('No changes made to tag.');
          response.end();
        } else if (result.bad) {
          const message = JSON.stringify({ error: 'Missing ID' });
          response.writeHead(400, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) });
          response.end(message);
        } else {
          const message = JSON.stringify({ error: 'Tag not found' });
          response.writeHead(404, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) });
          response.end(message);
        }
      } catch (error) {
        const message = JSON.stringify({ error: 'Invalid JSON or tag data' });
        console.error('Error parsing JSON or updating tag:', error);
        response.writeHead(400, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message) });
        response.end(message);
      }
    });
  } else {
    response.writeHead(405); // 405 Method Not Allowed
    response.end();
  }
};

const updateTag = (request, response) => {
  console.log(request.action);
  switch (request.headers.action) {
    case 'add':
      addTag(request, response);
      break;
    case 'edit':
      editTag(request, response);
      break;
    default:
      console.log('Error in handling POST request routing.');
      break;
  }
};

module.exports = {
  pairSearch, getParents, tagTree, updateTag, getRandomTag,
};
