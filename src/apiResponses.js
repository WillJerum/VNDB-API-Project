const url = require('url'); // Import URL module
const json = require('./jsonHandler.js');

const pairSearch = (request, response) => {
    const parsedUrl = url.parse(request.url, true); // Parse the URL

    console.log(parsedUrl.query.key);
    console.log(parsedUrl.query.value);

    const result = json.searchJSON(parsedUrl.query.key, parsedUrl.query.value); // fuzzy search

  if (result) {
    response.writeHead(200, { 'Content-Type': 'application/json' }); // If results are found
    response.end(JSON.stringify(result));
  } else {
    response.writeHead(404); // If results are not found
    response.end();
  }
};

const getParents = (request, response) => {
    const parsedUrl = url.parse(request.url, true); // Parse the URL

    console.log(parsedUrl.query.id);

    const result = json.getParents(parsedUrl.query.id) // Run helper function to find parents

  if (result) {
    response.writeHead(200, { 'Content-Type': 'application/json' }); // If results are found
    response.end(JSON.stringify(result));
  } else {
    response.writeHead(404); // If results are not found
    response.end();
  }
};

const addTag = (request, response) => {
    if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString(); // Convert buffer to string
        });
        request.on('end', () => {
            try {
                const newTag = JSON.parse(body);
                json.addTag(newTag);
                response.writeHead(201, { 'Content-Type': 'application/json' }); // 201 Created
                response.end(JSON.stringify({ message: 'Tag added successfully' })); // Send a success message
            } catch (error) {
                console.error('Error parsing JSON or adding tag:', error);
                response.writeHead(400, { 'Content-Type': 'application/json' }); // 400 Bad Request
                response.end(JSON.stringify({ error: 'Invalid JSON or tag data' })); // Send an error message
            }
        });
    } else {
        response.writeHead(405); // 405 Method Not Allowed
        response.end();
    }
};

module.exports = { pairSearch, getParents, addTag };