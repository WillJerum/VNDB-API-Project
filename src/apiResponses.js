const json = require('./jsonSearch.js');

const testSearch = (request, response) => {
    const result = json.searchJSON("name", "Fant"); // fuzzy search test
  if (result) {
    response.writeHead(200, { 'Content-Type': 'application/json' }); // If results are found
    response.end(JSON.stringify(result));
  } else {
    response.writeHead(404); // If results are not found
    response.end();
  }
};

module.exports = { testSearch };