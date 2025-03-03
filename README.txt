Documentation

The dataset being used in this project is the VNDB Tags database from vndb.org. It contains all of the tag data for every tag currently in
use on the site. 

This API is currently a work in progress. Below, the currently implemented features are outlined and explained.

pairSearch:
    Type: GET, HEAD
    Params: Query (key, value, filter)
    Returns: JSON data, 200, 400, 404
This endpoint takes a key and value query parameter, and returns relevant data as a JSON. When searching by ID, only
the first exact match is returned. All other key parameters use a fuzzy search with multiple results. When searching by
name, all aliases will be included, and vice versa. Results will be unfiltered by default. A helper function is called
when filtering. Returns 404 when no matching tags are found. Automatically prevents filtering when using ID search.


getParents:
    Type: GET, HEAD
    Params: Query (id)
    Returns: JSON data, 200, 404
This endpoint searches for all parents of a tag given the tag ID, and returns all relevant data as a JSON. It calls pairSearch
to assist with doing this. Returns 404 if tag has no parents. 

tagTree
    Type: GET, HEAD
    Params: Query (id)
    Returns: JSON data, 200, 204
This function returns nested JSON objects illustrating the parent-child relationships of all tags that parent the given tag 
or its parents, or its parents' parents, et cetera. The JSON data is returned as a sort of reverse tree, with the child at the
top branching out into the parents. This makes more sense in context, or so I believe. This is a recursive function. Will return
404 if the tag does not exist.

getRandomTag
    Type: GET, HEAD
    Params: None
    Returns: JSON data, 200, 404
Returns a completely random tag from the data set. It recalculates the bounds of the set every time it is called, to ensure
that newly added tags are in the pool to be selected at random. Uses a helper function pulled from Mozilla Documentation
to generate said random number. VNDB occasionally deletes old or unused tags, meaning there are some gaps in the data set.
This function checks data validity before returning to make sure one of these empty tags is not mistakenly returned. In
the case that it is, the function will run recursively until valid data is found.

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


updateTag:
    Type: POST
    Params: Request
    Returns: 200, 204, 400, 404, 405
Edits an existing tag given required parameters. If parameter is not explicitly updated in the form, the parameter will not be changed.
Returns a 204 status code when an update does not change any data. If a the form is missing an ID, a 400 status code will be returned.

A lot of things went really well during this project. Honestly, I was really worried about being able to submit anything working at all, 
let alone something that (ostensibly) meets all of the requirements. The fact that I got this code out the door and working
without any known bugs is something I am genuinely proud of.

Unfortunately, I do feel like the data set I chose limited the amount of interesting endpoints I could implement for this project.
While there is a lot of data included, a good chunk of it is really only for use in conjunction with VNDBs other databases, which
would be well out of scope for this project. Additionally, not implementing the POST requests with the idea that they would later
have to accept multiple form types led to a lot of rewriting of code that easily could have been avoided with better planning.

During development of this project, I greatly enhanced my understanding of APIs in general. I was having trouble with a lot of the finer
points during homework exercises, but after roughly 20 hours in front of this code base, I feel far more comfortable than I did at
the outset, which I consider to be a massive success. 

I didn't really go above and beyond for this project. My goal from the outset was honestly "scrape up as many points as you can and
hope it goes well." I really didn't have much confidence in my abilities to begin with. It did take pretty much everything I had to
get something that works as well as this does. I hope that with the newfound confidence I gained by working on this, I can
truly go above and beyond next time.

Most code was written by me specifically for this project, with some code being corrected with generative AI during the testing phase.
The remainder of the code was borrowed from previous assignments and in-class demos.
