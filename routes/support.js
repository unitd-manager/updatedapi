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
app.get('/getSupport', (req, res, next) => {
  db.query(`Select c.title
  , c.support_id
  ,c.description
  ,c.value
  ,c.creation_date
  ,c.modification_date 
  ,c.created_by
  ,c.modified_by
  ,c.record_type
  FROM support c
  WHERE c.support_id !='' `,
  (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Success',
})
}
  }
);
});


app.post('/getSupportById', (req, res, next) => {
  db.query(`Select c.title
  , c.support_id
  ,c.description
  ,c.value
  ,c.creation_date
  ,c.modification_date 
  ,c.created_by
  ,c.modified_by
  ,c.record_type
  FROM support c
  WHERE c.support_id = ${db.escape(req.body.support_id)} `,
  (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Success',
})
}
  }
);
});

app.post('/editSupport', (req, res, next) => {
  db.query(`UPDATE support
            SET title=${db.escape(req.body.title)}
            ,description=${db.escape(req.body.description)}
            ,value=${db.escape(req.body.value)}
            ,record_type=${db.escape(req.body.record_type)}
            ,modification_date=${db.escape(
              new Date().toISOString().slice(0, 19).replace('T', ' '),
            )}
            ,modified_by=${db.escape(req.user)}

            WHERE support_id = ${db.escape(req.body.support_id)}`,
            (err, result) => {
              if (err) {
                console.log('error: ', err)
                return res.status(400).send({
                  data: err,
                  msg: 'failed',
                })
              } else {
                return res.status(200).send({
                  data: result,
                  msg: 'Success',
          })
        }
            }
          );
        });




app.post('/insertSupport', (req, res, next) => {

  let data = {
     title: req.body.title
    , description: req.body.description
    , value: req.body.value
    , record_type: req.body.record_type
    ,creation_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    ,modification_date: null
    , created_by: req.user
    , modified_by: req.body.modified_by


   
 };
  let sql = "INSERT INTO support SET ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Success',
})
}
  }
);
});


app.post('/deleteSupport', (req, res, next) => {

  let data = {support_id : req.body.support_id };
  let sql = "DELETE FROM support  WHERE ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Success',
})
}
  }
);
});

app.get('/getSupportDropdown', (req, res, next) => {
  return res.status(200).send({
    data: [
      {id:'1',name:'Change Request'},
      {id:'2',name:'Issue'},
      {id:'3',name:'Cancelled'},

    ],
    msg:'Success'
});
});



app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;