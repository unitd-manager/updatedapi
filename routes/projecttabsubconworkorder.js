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

app.post('/SubConWorkOrderPortal', (req, res, next) => {
  db.query(`SELECT 
  q.sub_con_work_order_id
  ,q.work_order_date
  ,q.sub_con_id
  ,q.status
  ,q.work_order_due_date
  ,q.completed_date
  ,s.company_name
   FROM sub_con_work_order q 
   LEFT JOIN (project p) ON (p.project_id = q.project_id) 
   LEFT JOIN (sub_con s) ON (s.sub_con_id = q.sub_con_id) WHERE p.project_id =${db.escape(req.body.project_id)}`,
    (err, result) => {
       

      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });

          }
   
      }
    );
  });



  app.post('/editWorkOrderPortal', (req, res, next) => {
    db.query(`UPDATE sub_con_work_order
              SET work_order_due_date=${db.escape(req.body.work_order_due_date)}
              ,completed_date=${db.escape(req.body.completed_date)}
              ,project_location=${db.escape(req.body.project_location)}
              ,project_reference=${db.escape(req.body.project_reference)}
              ,work_order_date=${db.escape(req.body.work_order_date)}
              ,sub_con_id=${db.escape(req.body.sub_con_id)}
              ,quote_reference=${db.escape(req.body.quote_reference)}
              ,status=${db.escape(req.body.status)}
              ,quote_date=${db.escape(req.body.quote_date)}
              WHERE project_id = ${db.escape(req.body.project_id)}`,
      (err, result) => {
       
        if (err) {
          console.log("error: ", err);
          return;
        } else {
              return res.status(200).send({
                data: result,
                msg:'Success'
              });
        }
       }
    );
  });

  app.post('/insertsub_con_work_order', (req, res, next) => {

    let data = {sub_con_worker_code: req.body.sub_con_worker_code,
                work_order_date: req.body.work_order_date,
                work_order_due_date: req.body.work_order_due_date,
                completed_date: req.body.completed_date,
                project_id: req.body.project_id,
                sub_con_id: req.body.sub_con_id,
                work_order: req.body.work_order,
                status: req.body.status,
                creation_date: req.body.creation_date,
                modification_date: req.body.modification_date,
                created_by: req.body.created_by,
                modified_by: req.body.modified_by,
                project_location: req.body.project_location,
                project_reference: req.body.project_reference,
                condition: req.body.condition,
                quote_date: req.body.quote_date,
                quote_reference: req.body.quote_reference,};
    let sql = "INSERT INTO sub_con_work_order  SET ?";
    let query = db.query(sql, data,(err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });
      }
    });
  });
  app.delete('/deletesub_con_work_order', (req, res, next) => {

    let data = {sub_con_work_order_id : req.body.sub_con_work_order_id };
    let sql = "DELETE FROM sub_con_work_order WHERE ?";
    let query = db.query(sql, data,(err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });
      }
    });
  });

app.post('/PaymentHistoryPortal', (req, res, next) => {
  db.query(`SELECT 
  sr.amount
  ,sr.creation_date AS date
  ,sr.mode_of_payment
  ,sr.sub_con_payments_id
  ,sr.sub_con_id
  ,srh.sub_con_work_order_id
  ,sc.company_name FROM sub_con_payments_history srh LEFT JOIN (sub_con_payments sr) ON (sr.sub_con_payments_id = srh.sub_con_payments_id) LEFT JOIN (sub_con sc) ON (sc.sub_con_id = sr.sub_con_id) WHERE sr.project_id = ${db.escape(req.body.project_id)} AND sr.status != 'Cancelled'
  ORDER BY srh.sub_con_payments_history_id`,
    (err, result) => {
       
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });

        }
 
    }
  );
});

module.exports = app;