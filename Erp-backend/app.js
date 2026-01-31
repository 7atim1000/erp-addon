//require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const config = require("./config/config");
const globalErrorHandler = require('./middlewares/globalErrorHandler');
//const createHttpError = require('http-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();

const connectCloudinary = require('./config/cloudinary');


require('colors')

//const PORT = process.env.PORT;
const PORT = config.port;

connectDB();
connectCloudinary();


// cors policy to unblock response
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
 }));
 
//Middleware Parse incoming request in json format and cookie parser for cookies and token 
app.use(express.json()); 
// to activate middleware (cookieParser)
app.use(cookieParser());


// endPoint Route
app.get('/', (req, res) => {
    //const err = createHttpError(404, "something went wrong!");
    //throw err;
    res.json({message: 'Hellow from EnterpriceRP Server'})
}) ;


app.use('/api/auth', require('./routes/userRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/item', require('./routes/itemRoute'));
app.use('/api/services', require('./routes/serviceRoute'));

app.use('/api/customers', require('./routes/customerRoute'));
app.use('/api/suppliers', require('./routes/supplierRoute'));
app.use('/api/representative', require('./routes/representativeRoute'));

app.use('/api/transactions', require('./routes/transactionRoute'));
app.use('/api/expenses', require('./routes/expenseRoute'));
app.use('/api/incomes', require('./routes/incomeRoute')); //differs
app.use('/api/units', require('./routes/unitRoute'));

app.use('/api/invoice', require('./routes/invoiceRoute'));

// HR
app.use('/api/department', require('./routes/departmentRoute'));
app.use('/api/job', require('./routes/jobRoute'));
app.use('/api/employee', require('./routes/employeeRoute'));
app.use('/api/salary', require('./routes/salaryRoute'));
app.use('/api/attendance', require('./routes/attendanceRoute'));

app.use('/api/monthlysalaries', require('./routes/monthlySalariesRoute'));
app.use('/api/vacation', require('./routes/vacationRoute'));



// Stores
app.use('/api/stores', require('./routes/storesRoute'));
app.use('/api/storescategories', require('./routes/storescategoriesRoute'));
app.use('/api/storesunits', require('./routes/storesunitsRoute'));
app.use('/api/products', require('./routes/productsRoute'));
app.use('/api/storesitems', require('./routes/storesItemsRoute'))
app.use('/api/storeinvoice', require('./routes/storeInvoiceRoute'))

// global Error Handler 
app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`POS server is listening on port ${PORT}` .bgCyan); 
})