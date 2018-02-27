## Math Simple Express Server

To begin, download all dependencies:

npm intall

Next, start server with the following command:

node src/server.js

If not otherwise specified, server will be running at http://localhost:4000

Current Supported Endpoints
GET /api/simplify/boolean/laws

Returns list of currenltly implemented boolean laws
GET /api/simplify/boolean/expressions

Returns list of already simplified (pre-computed) boolean expressions
POST /api/simplify/boolean/expressions

Simplifies a boolean expression
Stores the computation
POST /api/simplify/boolean/expression/simpler

Check to see if a Boolean expression can be further simpified
POST /api/simplify/boolean/expressions/find

Check to see if a Boolean expression has already been simpified and if so, what was it's value