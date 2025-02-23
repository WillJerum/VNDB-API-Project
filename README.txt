Documentation

The dataset being used in this project is the VNDB Tags database from vndb.org. It contains all of the tag data for every tag currently in
use on the site. 

This API is currently a work in progress. Below, the currently implemented features are outlined and explained.

pairSearch:
    Type: GET (HEAD will be supported later)
    Params: Query (key, value)
    Returns: JSON data
This endpoint takes a key and value query parameter, and returns relevant data as a JSON. When searching by ID, only
the first exact match is returned. All other key parameters use a fuzzy search with multiple results. When searching by
name, all aliases will be included, and vice versa. Currently causes an error if no results are found.

*TODO* Implement client-facing interface for searching.
*TODO* Return a 404 status code when no results are found.

getParents:
    Type: GET (HEAD will be supported later)
    Params: Query (id)
    Returns: JSON data
This endpoint searches for all parents of a tag given the tag ID, and returns all relevant data as a JSON. It calls pairSearch
to assist with doing this. Currently causes an error if no results are found.

*TODO* Implement client-facing interface for searching.
*TODO* Return a 404 status code when no results are found.

updateTag:
    Type: POST
    Params: Request
    Returns: Response
This endpoint is an intermediary to determine which type of tag update is being used. Depending on which choice is currently
selected in the client interface, this will route to two sub-endpoints that are not normally accessible by the API.

addTag:
    Type: POST
    Params: Request
    Returns: 201, 400, 405
Adds a new tag at the first available ID in the database. The request is read by the server, and the new tag is stored in memory.
The endpoint returns a status code that is shown in the client interface.

*TODO* Empty tag prevention, if time allows.

updateTag:
    Type: POST
    Params: Request
    Returns: 200, 204, 400, 404, 405
Edits an existing tag given required parameters. If parameter is not explicitly updated in the form, the parameter will not be changed.
Returns a 204 status code when an update does not change any data. If a the form is missing an ID, a 400 status code will be returned.


URL Encoding still needs to be implemented for the two POST endpoints. GET endpoints need a client interface. Additionally, I needto
implement two more GET endpoints, one of which returns all data from one tag category, and another that returns only meta tags.

If time allows, I'd like to create a clientside interface that automatically embeds links to VNDB whenever an ID is returned in the
content window, such as when parent IDs appear. 

Most code was written by me specifically for this project, with some code being corrected with generative AI during the testing phase.
The remainder of the code was borrowed from previous assignments and in-class demos.
