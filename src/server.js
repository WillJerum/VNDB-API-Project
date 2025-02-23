const http = require('http');
const url = require('url'); // Import URL module

const htmlHandler = require('./htmlResponses.js');
const apiHandler = require('./apiResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true); // Parse the URL

  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCss(request, response);
      break;
    case '/pairSearch':
      apiHandler.pairSearch(request, response);
      break;
    case '/getParents':
      apiHandler.getParents(request, response);
      break;
    case '/updateTag':
      apiHandler.updateTag(request, response);
      break;
    default:
      htmlHandler.getIndex(request, response);
      // apiHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
