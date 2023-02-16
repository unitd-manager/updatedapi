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

app.get('/getinventoryMain', (req, res, next) => {
  db.query(`SELECT i.inventory_code,
  i.inventory_id
  ,i.minimum_order_level
  ,p.product_id AS productId
  ,p.product_type
  ,c.company_name
  ,p.title AS product_name
  ,p.item_code
  ,p.unit
  ,i.notes
  ,p.product_code
  ,i.actual_stock AS stock
FROM inventory i
LEFT JOIN (product p) ON (p.product_id = i.product_id)
LEFT JOIN (product_company pc) ON (pc.product_id = p.product_id)
LEFT JOIN (supplier c) ON (c.supplier_id = pc.company_id)
WHERE i.inventory_id != ''
ORDER BY stock DESC`,
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
            });
      }
 
    }
  );
});

app.post('/getinventoryById', (req, res, next) => {
  db.query(`SELECT i.inventory_code
  ,i.inventory_id
  ,i.minimum_order_level
  ,p.product_id AS productId
  ,p.product_type
  ,c.company_name
  ,p.title AS product_name
  ,p.item_code
  ,p.unit
  ,i.notes
  ,p.product_code
  ,i.actual_stock AS stock
FROM inventory i
LEFT JOIN (product p) ON (p.product_id = i.product_id)
LEFT JOIN (product_company pc) ON (pc.product_id = p.product_id)
LEFT JOIN (supplier c) ON (c.supplier_id = pc.company_id)
WHERE i.product_id = ${db.escape(req.body.productId)}
ORDER BY stock DESC`,
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
            });
      }
 
    }
  );
});

app.post('/editinventoryMain', (req, res, next) => {
  db.query(`UPDATE inventory  
            SET minimum_order_level =${db.escape(req.body.minimum_order_level)}
                ,notes=${db.escape(req.body.notes)}
            
             WHERE product_id =  ${db.escape(req.body.productId)}`,
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
            });
      }
     }
  );
});

app.post('/updateinventoryStock', (req, res, next) => {
  db.query(`UPDATE inventory  
            SET actual_stock =${db.escape(req.body.stock)}
                
            
             WHERE inventory_id =  ${db.escape(req.body.inventory_id)}`,
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
            });
      }
     }
  );
});


app.post('/insertinventory', (req, res, next) => {

  let data = {creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              flag: req.body.flag,
              minimum_order_level: req.body.minimum_order_level,
              site_id: req.body.site_id,
              actual_stock: req.body.actual_stock,
              inventory_code: req.body.inventory_code,
              color: req.body.color,
              size: req.body.size,
              code: req.body.code,
              model: req.body.model,
              changed_stock: req.body.changed_stock,
              notes: req.body.notes,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
          };

  let sql = "INSERT INTO  inventory SET ?";
  let query = db.query(sql, data,(err, result) => {
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
          });
    }
  });
});



app.delete('/deleteInventory', (req, res, next) => {

  let data = {inventory_id  : req.body.inventory_id  };
  let sql = "DELETE FROM inventory WHERE ?";
  let query = db.query(sql, data,(err, result) => {
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
          });
    }
  });
});

app.post('/insertsite', (req, res, next) => {

  let data = {site_id: req.body.site_id,
              title: req.body.title,
              admin_email: req.body.admin_email,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              default_language: req.body.default_language,
              published: req.body.published,
              flag: req.body.flag,
              site_url: req.body.site_url,
              google_analytics_id: req.body.google_analytics_id,
              tag_line: req.body.tag_line,
              tag_line2: req.body.tag_line2,
              theme: req.body.theme,
              skin: req.body.skin,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              ad_ops_site_name: req.body.ad_ops_site_name,
              additional_meta_tags: req.body.additional_meta_tags,
              additional_analytics_script: req.body.additional_analytics_script,
            
          };

  let sql = "INSERT INTO site SET ?";
  let query = db.query(sql, data,(err, result) => {
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
          });
    }
  });
});


app.delete('/deleteSite', (req, res, next) => {

  let data = {site_id  : req.body.site_id };
  let sql = "DELETE FROM site WHERE ?";
  let query = db.query(sql, data,(err, result) => {
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
          });
    }
  });
});


app.get('/gettabPurchaseOrderLinked', (req, res, next) => {
  db.query(`SELECT pop.cost_price
  ,pop.qty
  ,com.company_name AS supplier_name
  ,po.po_code
  ,po.purchase_order_date
  ,po.purchase_order_id
  ,po.creation_date
  ,p.title
  ,c.company_name
  ,st.title as site_title
FROM po_product pop
LEFT JOIN purchase_order po ON po.purchase_order_id = pop.purchase_order_id
LEFT JOIN project p ON p.project_id = po.project_id
LEFT JOIN company c ON c.company_id = p.company_id
LEFT JOIN supplier com ON pop.supplier_id = com.supplier_id
LEFT JOIN site st ON st.site_id = po.site_id
WHERE pop.product_id != ''`,
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
            });
      }
 
    }
  );
});

app.post('/gettabPurchaseOrderLinkedById', (req, res, next) => {
  db.query(`SELECT pop.cost_price
  ,pop.qty
  ,com.company_name AS supplier_name
  ,po.po_code
  ,po.purchase_order_date
  ,po.purchase_order_id
  ,po.creation_date
  ,p.title
  ,c.company_name
  ,st.title as site_title
FROM po_product pop
LEFT JOIN purchase_order po ON po.purchase_order_id = pop.purchase_order_id
LEFT JOIN project p ON p.project_id = po.project_id
LEFT JOIN company c ON c.company_id = p.company_id
LEFT JOIN supplier com ON pop.supplier_id = com.supplier_id
LEFT JOIN site st ON st.site_id = po.site_id
WHERE pop.product_id = ${db.escape(req.body.product_id)}`,
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
            });
      }
 
    }
  );
});

app.get('/getTabProjectLinked', (req, res, next) => {
  db.query(`SELECT DISTINCT p.project_id
           ,pm.material_used_date
           ,p.title
           ,com.company_name
           ,pm.quantity
           FROM project_materials pm
           LEFT JOIN project p ON (p.project_id = pm.project_id)
           LEFT JOIN company com ON (com.company_id = p.company_id)
           WHERE pm.product_id != ''`,
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
            });
      }
 
    }
  );
});

app.post('/getTabProjectLinkedById', (req, res, next) => {
  db.query(`SELECT DISTINCT p.project_id
           ,pm.product_id
           ,pm.material_used_date
           ,p.title
           ,com.company_name
           ,pm.quantity
           FROM project_materials pm
           LEFT JOIN project p ON (p.project_id = pm.project_id)
           LEFT JOIN company com ON (com.company_id = p.company_id)
           WHERE pm.product_id = ${db.escape(req.body.product_id)}`,
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
            });
      }
 
    }
  );
});

app.post('/getAdjustStock', (req, res, next) => {
  db.query(`SELECT adjust_stock_log_id
           adjust_stock,
           current_stock,
           created_by
           FROM adjust_stock_log
           WHERE inventory_id = ${db.escape(req.body.inventory_id)}`,
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
            });
      }
    }
  );
});

app.get('/getAdjustStockMain', (req, res, next) => {
  db.query(`SELECT adjust_stock_log_id
           adjust_stock,
           materials_used,
           current_stock,
           created_by
           FROM adjust_stock_log
           WHERE inventory_id != ""`,
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
            });
      }
 
    }
  );
});

app.post('/insertadjust_stock_log', (req, res, next) => {

  let data = {adjust_stock_log_id: req.body.adjust_stock_log_id,
              inventory_id: req.body.inventory_id,
              product_id: req.body.product_id,
              adjust_stock: req.body.adjust_stock,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              modified_by: req.body.modified_by,
              created_by: req.body.created_by,
              current_stock: req.body.current_stock,
             
            
          };

  let sql = "INSERT INTO adjust_stock_log SET ?";
  let query = db.query(sql, data,(err, result) => {
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
          });
    }
  });
});

app.post('/getProductQuantity', (req, res, next) => {
  db.query(`SELECT DISTINCT po.product_id
           ,po.qty as materials_purchased
           ,pm.quantity as materials_used
           FROM project_materials pm
           LEFT JOIN po_product po ON (po.product_id = pm.product_id)
           WHERE pm.product_id = ${db.escape(req.body.product_id)} `,
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
            });
      }
 
    }
  );
});

app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;