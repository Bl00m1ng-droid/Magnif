const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
app.use('/api/products',productRoutes);{/**anything defined in productRoutes
    gets prefixed with /api/products */}
{/**the frontend send HTTPS requests to the server,the server talks to the 
    database and sends a response back.
    app.get(path,handler) -
    every route handler receives two objects:
    req(request) - everything about what the client sent:
                  URL params,query strings,body data,headers
    res(response) - what you send back: res.send(),res.json(),
                  res.status(404).json etc
     a REST API is just a convection for organizing those requests around resources
    (things like 'products','users','orders') and standard HTTP methods that describe the action:
    GET -read data : GET/api/products - list all products
    POST - create data : POST/api/products - add a new product
    PUT/PATCH - update data: PUT/api/products/3 - edit product 3
    DELETE - remove data: DELETE/api/products/3 - delete product 3
    each response comes back with a status code telling you what happened:
    200 - ok
    201 - created;succes,new resource made
    400 - bad request; client sent something invalid
    401 - unauthorized; not logged in
    403 - forbidden;logged in but not allowed
    404 - not found
    500 - server error*/}
app.get('/', (req,res) => res.send('Magnif API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));