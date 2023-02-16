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

app.get('/getSupplier', (req, res, next) => {
  db.query(`SELECT s.company_name
  ,s.supplier_id
  ,s.email
  ,s.fax
  ,s.supplier_id
  ,s.mobile
  ,s.status
  ,s.gst_no
  ,s.contact_person
  ,s.address_flat
  ,s.address_street
  ,s.address_state
  ,s.address_country
  ,s.address_po_code
  ,s.payment_details
  ,s.terms
  ,s.phone
  ,gc.name AS country_name 
  FROM supplier s LEFT JOIN (geo_country gc) ON (s.address_country = gc.country_code) WHERE s.supplier_id != ''`,
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
app.post('/get-SupplierById', (req, res, next) => {
  db.query(`SELECT s.company_name
  ,s.supplier_id
  ,s.email
  ,s.fax
  ,s.mobile
  ,s.status
  ,s.gst_no
  ,s.contact_person
  ,s.address_flat
  ,s.address_street
  ,s.address_state
  ,s.address_country
  ,s.address_po_code
  ,s.payment_details
  ,s.terms
  ,s.phone
  ,gc.name AS country_name 
  FROM supplier s LEFT JOIN (geo_country gc) ON (s.address_country = gc.country_code) WHERE s.supplier_id=${db.escape(req.body.supplier_id)}`,
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


app.post('/edit-Supplier', (req, res, next) => {
  db.query(`UPDATE supplier 
            SET company_name=${db.escape(req.body.company_name)}
            ,email=${db.escape(req.body.email)}
            ,fax=${db.escape(req.body.fax)}
            ,mobile=${db.escape(req.body.mobile)}
            ,status=${db.escape(req.body.status)}
            ,gst_no=${db.escape(req.body.gst_no)}
            ,contact_person=${db.escape(req.body.contact_person)}
            ,address_flat=${db.escape(req.body.address_flat)}
            ,address_street=${db.escape(req.body.address_street)}
            ,address_state=${db.escape(req.body.address_state)}
            ,address_country=${db.escape(req.body.address_country)}
            ,address_po_code=${db.escape(req.body.address_po_code)}
            ,payment_details=${db.escape(req.body.payment_details)}
            ,terms=${db.escape(req.body.terms)}
            WHERE supplier_id =${db.escape(req.body.supplier_id)}`,
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


app.post('/insert-Supplier', (req, res, next) => {

  let data = {company_name: req.body.company_name,
              email: req.body.email,
              address_street: req.body.address_street,
              address_town: req.body.address_town,
              address_state: req.body.address_state,
              address_country: req.body.address_country,
              address_po_code: req.body.address_po_code,
              phone: req.body.phone,
              fax: req.body.fax,
              notes: req.body.notes,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              mobile: req.body.mobile,
              flag: req.body.flag,
              address_flat: req.body.address_flat,
              status: req.body.status,
              website: req.body.website,
              category: req.body.category,
              comment_by: req.body.comment_by,
              company_size: req.body.company_size,
              industry: req.body.industry,
              source: req.body.source,
              group_name: req.body.group_name,
              supplier_type: req.body.supplier_type,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              chi_company_name: req.body.chi_company_name,
              chi_company_address: req.body.chi_company_address,
              company_address_id: req.body.company_address_id,
              contact_person: req.body.contact_person,
              billing_address_flat: req.body.billing_address_flat,
              billing_address_street: req.body.billing_address_street,
              billing_address_country: req.body.billing_address_country,
              billing_address_po_code: req.body.billing_address_po_code,
              gst_no: req.body.gst_no,
              terms: req.body.terms,
              payment_details: req.body.payment_details};
  let sql = "INSERT INTO supplier SET ?";
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

app.post('/insert-SupplierReceipt', (req, res, next) => {

  let data = {receipt_code: req.body.receipt_code,
              amount: req.body.amount,
              mode_of_payment: req.body.mode_of_payment,
              remarks: req.body.remarks,
              date: req.body.date,
              published: req.body.published,
              flag: req.body.flag,
              creation_date: req.body.creation_date,
              supplier_id: req.body.supplier_id,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              receipt_status: req.body.receipt_status,
              type: req.body.type,
              cheque_date: req.body.cheque_date,
              bank_name: req.body.bank_name,
              issued_by: req.body.issued_by,
              cheque_no: req.body.cheque_no,
              coi_no: req.body.coi_no,
              company_contact_salutation: req.body.company_contact_salutation,
              company_contact_name: req.body.company_contact_name,
              cust_first_name: req.body.cust_first_name,
              cust_email: req.body.cust_email,
              cust_address1: req.body.cust_address1,
              cust_address2: req.body.cust_address2,
              cust_address_po_code: req.body.cust_address_po_code,
              cust_address_country_code: req.body.cust_address_country_code,
              site_id: req.body.site_id,
              advance_payment_used: req.body.advance_payment_used};
  let sql = "INSERT INTO supplier_receipt SET ?";
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




app.post('/deleteSupplier', (req, res, next) => {

  let data = {supplier_id : req.body.supplier_id  };
  let sql = "DELETE FROM supplier WHERE ?";
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


app.post('/insertGeo_country', (req, res, next) => {

  let data = {country_code: req.body.country_code,
              name: req.body.name,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              published: req.body.published,
              flag: req.body.flag,
              chi_name: req.body.chi_name};
  let sql = "INSERT INTO geo_country SET ?";
  let query = db.query(sql, data,  (err, result) => {
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

app.delete('/deleteGeo_country', (req, res, next) => {

  let data = {geo_country_id  : req.body.geo_country_id   };
  let sql = "DELETE FROM geo_country WHERE ?";
  let query = db.query(sql, data,  (err, result) => {
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


app.get('/getTabPurchaseOrderLinked', (req, res, next) => {
  db.query(`SELECT p.purchase_order_id 
            FROM purchase_order p 
            WHERE p.supplier_id != '' AND (p.payment_status != 'Cancelled' OR p.payment_status IS NULL)`,
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

app.post('/getMakePayment', (req, res, next) => {
  db.query(`SELECT i.po_code,
  i.purchase_order_id,
  i.supplier_id,
  i.payment_status
  ,(SELECT SUM(pop.cost_price*pop.quantity) AS prev_sum 
    FROM po_product pop
    WHERE pop.purchase_order_id =  i.purchase_order_id) as prev_inv_amount
    ,(SELECT SUM(supHist.amount) AS prev_sum 
  FROM supplier_receipt_history supHist 
  LEFT JOIN supplier_receipt r ON (r.supplier_receipt_id = supHist.supplier_receipt_id) 
  WHERE supHist.purchase_order_id = i.purchase_order_id AND i.status != 'Cancelled' ) as prev_amount 
FROM purchase_order i 
LEFT JOIN supplier o ON (i.supplier_id = o.supplier_id)
WHERE i.supplier_id=${db.escape(req.body.supplier_id)} AND i.status='due'`,
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

app.post('/getPurchaseOrderLinkedss', (req, res, next) => {
  db.query(`SELECT p.po_code,
  p.po_date,
  p.payment_status,
  p.purchase_order_id,
  sup.amount
    ,(
    SELECT SUM(pop.cost_price*pop.quantity) AS po_value
    FROM po_product pop
    WHERE pop.purchase_order_id =  p.purchase_order_id) as po_value
    ,(SELECT SUM(supHist.amount) AS prev_sum 
    FROM supplier_receipt_history supHist 
    LEFT JOIN supplier_receipt r ON (r.supplier_receipt_id = supHist.supplier_receipt_id) 
    WHERE supHist.purchase_order_id = p.purchase_order_id AND p.status != 'Cancelled' ) as prev_amount 
  FROM purchase_order p
  LEFT JOIN supplier o ON (p.supplier_id = o.supplier_id)
  LEFT JOIN supplier_receipt sup ON (sup.supplier_id = o.supplier_id)
  WHERE p.supplier_id=${db.escape(req.body.supplier_id)};`,
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

app.post('/SupplierPayment', (req, res, next) => {
  db.query(`SELECT sr.amount
  ,srh.creation_date
  ,sr.mode_of_payment
  ,sr.receipt_status
  ,sr.supplier_receipt_id
  ,sr.supplier_id
  ,srh.purchase_order_id
FROM supplier_receipt_history srh
LEFT JOIN (supplier_receipt sr) ON (sr.supplier_receipt_id = srh.supplier_receipt_id)
WHERE srh.purchase_order_id = ${db.escape(req.body.purchase_order_id)}
ORDER BY srh.supplier_receipt_history_id;`,
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

app.post('/insert-SupplierReceipt', (req, res, next) => {
  let data = {receipt_code: req.body.receipt_code,
              amount: req.body.amount,
              mode_of_payment: req.body.mode_of_payment,
              remarks: req.body.remarks,
              date: req.body.date,
              published: req.body.published,
              flag: req.body.flag,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              supplier_id: req.body.supplier_id,
              receipt_status: req.body.receipt_status,
              type: req.body.type,
              cheque_date: req.body.cheque_date,
              bank: req.body.bank,
              issued_by: req.body.issued_by,
              cheque_no: req.body.cheque_no,
              coi_no: req.body.coi_no,
              company_contact_salutation: req.body.company_contact_salutation,
              company_contact_name: req.body.company_contact_name,
              cust_first_name: req.body.cust_first_name,
              cust_email: req.body.cust_email,
              cust_address1: req.body.cust_address1,
              cust_address2: req.body.cust_address2,
              cust_address_po_code: req.body.cust_address_po_code,
              cust_address_country_code: req.body.cust_address_country_code,
              site_id: req.body.site_id,
              advance_payment_used: req.body.advance_payment_used,};
  let sql = "INSERT INTO supplier_receipt SET ?";
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

app.post('/insert-SupplierReceiptsHistory', (req, res, next) => {
  let data = {purchase_order_id: req.body.purchase_order_id,
              supplier_receipt_id: req.body.supplier_receipt_id,
              published: req.body.published,
              flag: req.body.flag,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              amount: req.body.amount,
              purchase_order_date: req.body.purchase_order_date,
              invoice_paid_status: req.body.invoice_paid_status,
              title: req.body.title,
              installment_id: req.body.installment_id,
              receipt_type: req.body.receipt_type,
              related_purchase_order_id: req.body.related_purchase_order_id,
              gst_amount: req.body.gst_amount};
  let sql = "INSERT INTO supplier_receipt_history SET ?";
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

app.delete('/deleteSupplier_receipt_history', (req, res, next) => {

  let data = {supplier_receipt_history_id : req.body.supplier_receipt_history_id};
  let sql = "DELETE FROM supplier_receipt_history WHERE ?";
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
app.post('/editPurchaseStatus', (req, res, next) => {
  db.query(`UPDATE purchase_order 
            SET payment_status = 'paid',status='paid'
             WHERE purchase_order_id =  ${db.escape(req.body.purchase_order_id)}`,
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
app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;