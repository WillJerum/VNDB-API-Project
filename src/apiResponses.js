const url = require('url'); // Import URL module
const json = require('./jsonSearch.js');

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

module.exports = { pairSearch };