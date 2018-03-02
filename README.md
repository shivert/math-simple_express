## Math Simple Express Server

To begin, download all dependencies:

`npm install`

Next, start server with the following command:

`node server.js`

If not otherwise specified, server will be running at http://localhost:4000

###Current Supported Endpoints

Returns list of currently implemented boolean laws
GET /api/simplify/boolean/laws

Returns list of pre-computed boolean expressions
Optional Query Parameter to search for individual expression
GET /api/simplify/boolean/expressions

Simplifies a boolean expression
POST /api/simplify/boolean/expressions
