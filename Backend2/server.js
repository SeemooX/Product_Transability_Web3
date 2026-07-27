const express = require('express');
const cookieParser = require('cookie-parser');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const resetRouter = require('./routes/register');
const manifactureRouter = require('./routes/api/Manifacture');
const transporterRouter = require('./routes/api/transporter');
const productRouter = require('./routes/api/product');
const cors = require('cors');
const { corsOptions } = require('./config/corsOptions');
const { credentials } = require('./middlewares/credentials');
const verifyJWT = require('./middlewares/verifyJWT');
const { loadRoles } = require('./middlewares/verifyRoles');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3500;

// CORS
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json()); // This is a built-in Middleware, parses the raw JSON string from the body of the http request into a real JS object and puts it into req.body, "fetch('/login', { method: 'POST', body: JSON.stringify({...}) }))"
app.use(express.urlencoded({ extended: false })); // This let express understands HTML submission forms, example when URL data has "email=test@gmail.com&password=1234", "req.body = { email: "test@gmail.com", password: "1234" }"
app.use(cookieParser()); // Let express know how to read cookies attached in a request, this extracts Cookies header and puts them into req.cookies

app.use('/login', loginRouter);
app.use('/reset', resetRouter);

app.use(verifyJWT);

app.use('/register', registerRouter);
app.use('/manufacturer', manifactureRouter);
app.use('/transporter', transporterRouter);
app.use('/products', productRouter);


const startServer = async () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


startServer();