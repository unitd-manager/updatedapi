const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/Database.js')
const userMiddleware = require('../middleware/UserModel.js')
var md5 = require('md5')
const fileUpload = require('express-fileupload')
const _ = require('lodash')
const mime = require('mime-types')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
app.use(cors())

app.use(
  fileUpload({
    createParentPath: true,
  }),
)

app.get('/getSubCategory', (req, res, next) => {
  db.query(
    `SELECT sc.sub_category_id 
  ,sc.sub_category_title 
  ,sc.sort_order 
  ,sc.sub_category_type
  ,sc.chi_title 
  ,sc.display_type
  ,sc.published
  ,sc.show_navigation_panel 
  ,sc.external_link 
  ,sc.template 
  ,sc.creation_date 
  ,sc.modification_date 
  ,sc.published_test
  ,sc.internal_link 
  ,sc.meta_title
  ,sc.meta_description
  ,sc.meta_keyword 
  ,sc.seo_title
  ,s.section_title
  ,sc.show_in_nav
  ,sc.category_id
  ,ca.category_title  
  FROM sub_category sc 
  LEFT JOIN category ca ON sc.category_id=ca.category_id 
  LEFT JOIN section s  ON ca.section_id=s.section_id 
  WHERE sc.sub_category_id !=''
  ORDER BY sc.sort_order ASC`,
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
    },
  )
})

app.post('/getSubCategoryById', (req, res, next) => {
  db.query(
    `SELECT sc.sub_category_id 
    ,sc.sub_category_title 
    ,sc.sort_order 
    ,sc.sub_category_type
    ,sc.chi_title 
    ,sc.display_type
    ,sc.published
    ,sc.show_navigation_panel 
    ,sc.external_link 
    ,sc.template 
    ,sc.creation_date 
    ,sc.modification_date 
    ,sc.published_test
    ,sc.internal_link 
    ,sc.meta_title
    ,sc.meta_description
    ,sc.meta_keyword 
    ,sc.seo_title
    ,s.section_title
    ,sc.show_in_nav
    ,sc.category_id
    ,ca.category_title  
    FROM sub_category sc 
    LEFT JOIN category ca ON sc.category_id=ca.category_id 
    LEFT JOIN section s  ON ca.section_id=s.section_id
  WHERE sub_category_id = ${db.escape(req.body.sub_category_id)}`,
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
          msg: 'SubCategory has been get successfully',
        })
      }
    },
  )
})

app.get('/getCategory', (req, res, next) => {
  db.query(
    `SELECT
  ca.category_id
  ,ca.category_title
  ,s.section_title
  ,CONCAT(ca.category_title, '/', s.section_title ) AS concattitle
  From category ca
  INNER JOIN section s ON (ca.section_id = s.section_id)
  WHERE ca.category_id  !=''`,
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
          msg: 'Category has been get successfully',
        })
      }
    },
  )
})

app.post('/updateSortOrder', (req, res, next) => {
  db.query(
    `UPDATE sub_category 
            SET 
            sort_order=${db.escape(req.body.sort_order)}
            WHERE sub_category_id= ${db.escape(req.body.sub_category_id)}`,
    (err, result) => {
      if (err) {
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
    },
  )
})

app.post('/insertSubCategory', (req, res, next) => {
  let data = {
    sub_category_id: req.body.sub_category_id,
    sub_category_title: req.body.sub_category_title,
    sort_order: req.body.sort_order,
    sub_category_type: 'Content',
    chi_title: req.body.chi_title,
    display_type: req.body.display_type,
    published: '0',
    show_navigation_panel: req.body.show_navigation_panel,
    category_id: req.body.category_id,
    external_link: req.body.external_link,
    template: req.body.template,
    creation_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    modification_date: null,
    published_test: req.body.published_test,
    internal_link: req.body.internal_link,
    meta_title: req.body.meta_title,
    meta_keyword: req.body.meta_keyword,
    meta_description: req.body.meta_description,
    seo_title: req.body.sub_category_title,
  }
  let sql = 'INSERT INTO sub_category SET ?'
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
        msg: 'New Subcategory has been created successfully',
      })
    }
  })
})

// app.post('/insertsubcategory', (req, res, next) => {

//   let data = {sub_category_id	:req.body.sub_category_id
//    , title	:req.body.title
//    , seo_title	: req.body.title
//  };
//   let sql = "INSERT INTO sub_category SET ?";
//   let query = db.query(sql, data,(err, result) => {
//     if (err) {
//       console.log("error: ", err);
//       return;
//     } else {
//           return res.status(200).send({
//             data: result,
//             msg:'Success'
//           });
//     }
//   });
// });

// app.post('/insertsubcategory', (req, res, next) => {

//   let data = {
//     title	: req.body.title
//    , seo_title: req.body.title};
//   let sql = "INSERT INTO sub_category SET ?";
//   let query = db.query(sql, data,(err, result) => {
//     if (err) {
//       console.log("error: ", err);
//       return;
//     } else {
//           return res.status(200).send({
//             data: result,
//             msg:'New Subcategory has been created successfully'
//           });
//     }
//   });
// });

app.post('/insertCategory', (req, res, next) => {
  let data = {
    category_id: req.body.category_id,
    meta_title: req.body.meta_title,
    meta_keyword: req.body.meta_keyword,
    category_title: req.body.category_title,
    meta_description: req.body.meta_description,
  }
  let sql = 'INSERT INTO category SET ?'
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
        msg: 'New category has been created successfully',
      })
    }
  })
})

app.post('/editSubCategory', (req, res, next) => {
  db.query(
    `UPDATE sub_category 
            SET 
            sub_category_title=${db.escape(req.body.sub_category_title)}
            ,category_id=${db.escape(req.body.category_id)}
            ,sort_order=${db.escape(req.body.sort_order)}
            ,sub_category_type=${db.escape(req.body.sub_category_type)}
            ,chi_title=${db.escape(req.body.chi_title)}
            ,display_type=${db.escape(req.body.display_type)}
            ,published =${db.escape(req.body.published)}
            ,show_navigation_panel=${db.escape(req.body.show_navigation_panel)}
            ,external_link=${db.escape(req.body.external_link)}
            ,template=${db.escape(req.body.template)}
            ,creation_date =${db.escape(req.body.creation_date)}
            ,modification_date=${db.escape(
              new Date().toISOString().slice(0, 19).replace('T', ' '),
            )}
            ,published_test=${db.escape(req.body.published_test)}
            ,internal_link  =${db.escape(req.body.internal_link)}
            ,show_in_nav=${db.escape(req.body.show_in_nav)}
            ,meta_title=${db.escape(req.body.meta_title)}
            ,meta_description=${db.escape(req.body.meta_description)}
            ,meta_keyword=${db.escape(req.body.meta_keyword)}
            ,seo_title=${db.escape(req.body.seo_title)}
            WHERE sub_category_id = ${db.escape(req.body.sub_category_id)}`,
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
    },
  )
})

app.post('/editCategory', (req, res, next) => {
  db.query(
    `UPDATE category
            SET 
            category_title=${db.escape(req.body.category_title)} 
            WHERE category_id = ${db.escape(req.body.category_id)}`,
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
          msg: 'SubCategory has been Edited successfully',
        })
      }
    },
  )
})

app.post('/deleteSubCategory', (req, res, next) => {
  let data = { sub_category_id: req.body.sub_category_id }
  let sql = 'DELETE FROM sub_category WHERE ?'
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
        msg: 'SubCategory has been removed successfully',
      })
    }
  })
})

module.exports = app
