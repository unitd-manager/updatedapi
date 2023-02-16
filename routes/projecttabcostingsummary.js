const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/Database.js');
const userMiddleware = require('../middleware/UserModel.js');
var md5 = require('md5');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const mime = require('mime-types')
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors());

app.use(fileUpload({
    createParentPath: true
}));

app.post('/getTabCostingSummary', (req, res, next) => {
    db.query(`SELECT 
    c.no_of_worker_useds
    ,c.no_of_days_worked
    ,c.labour_rates_per_day
    ,c.po_price
    ,c.po_price_with_gst
    ,c.profit_percentage
    ,c.profit
    ,c.total_material_price
    ,c.transport_charges
    ,c.total_labour_charges
    ,c.salesman_commission
    ,c.finance_charges
    ,c.office_overheads
    ,c.other_charges
    ,c.total_cost of FROM costing_summary c WHERE c.project_id =${db.escape(req.body.project_id)} ORDER BY c.costing_summary_id DESC`,
      (err, result) =>{
        if (err) {
             return res.status(400).send({
                  data: err,
                  msg:'err'
                });
          } else {
              if(result.length == 0){
                return res.status(400).send({
                  msg:'err'
                });
              }else{
                    return res.status(200).send({
                  data: result,
                  msg:'Success'
                });
              }
  
          }
   
      }
    );
  });
  module.exports = app;