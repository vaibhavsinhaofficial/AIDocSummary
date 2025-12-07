const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 4000;
app.use(express.urlencoded({extended:false}));
app.use(express.json())

app.use(require('./routes/summaryRoute'))
app.use(require('./config/db'))



app.listen(port, ()=>{
    console.log(`app is running on ${port}`);
    
})