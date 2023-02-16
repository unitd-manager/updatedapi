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

app.get('/getpayrollmanagementMain', (req, res, next) => {
  db.query(`SELECT pm.payroll_month
            ,pm.payroll_year
            ,pm.basic_pay
            ,pm.ot_amount
            ,pm.cpf_employer
            ,pm.cpf_employee
            ,pm.allowance1
            ,pm.deduction1
            ,pm.net_total
            ,pm.payroll_management_id 
            ,CONCAT_WS(' ', e.first_name) AS employee_name
            ,e.position AS designation
            ,e.salary
            ,e.date_of_birth AS dob
            ,e.spr_year
            ,e.citizen
            ,e.status AS employee_status
  FROM payroll_management pm
  LEFT JOIN (employee e) ON (e.employee_id = pm.employee_id)
  WHERE pm.payroll_management_id != ''
  ORDER BY e.first_name ASC`,
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

app.post('/getpayrollmanagementById', (req, res, next) => {
  db.query(`SELECT pm.payroll_month
            ,pm.payroll_year
            ,pm.basic_pay
            ,pm.ot_amount
            ,pm.cpf_employer
            ,pm.cpf_employee
            ,pm.allowance1
            ,pm.deduction1
            ,pm.net_total
            ,pm.payroll_management_id 
            ,CONCAT_WS(' ', e.first_name) AS employee_name
            ,e.position AS designation
            ,e.salary
            ,e.date_of_birth AS dob
            ,e.spr_year
            ,e.citizen
            ,e.status AS employee_status
  FROM payroll_management pm
  LEFT JOIN (employee e) ON (e.employee_id = pm.employee_id)
  WHERE pm.payroll_management_id = ${db.escape(req.body.payroll_management_id )}
  ORDER BY e.first_name ASC`,
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

app.post('/editpayrollmanagementMain', (req, res, next) => {
  db.query(`UPDATE  payroll_management 
            SET employee_id  =${db.escape(req.body.employee_id)}
                ,payroll_month=${db.escape(req.body.payroll_month)}
                ,payroll_year=${db.escape(req.body.payroll_year)}
                ,ot_hours=${db.escape(req.body.ot_hours)}
                ,additional_wages=${db.escape(req.body.additional_wages)}
                ,cpf_deduction=${db.escape(req.body.cpf_deduction)}
                ,statutary_deduction=${db.escape(req.body.statutary_deduction)}
                ,status=${db.escape(req.body.status)}
                ,net_total=${db.escape(req.body.net_total)}
                ,notes=${db.escape(req.body.notes)}
                ,creation_date=${db.escape(req.body.creation_date)}
                ,modification_date=${db.escape(req.body.modification_date)}
                ,created_by=${db.escape(req.body.created_by)}
                ,modified_by=${db.escape(req.body.modified_by)}
                ,flag=${db.escape(req.body.flag)}
                ,income_tax_amount=${db.escape(req.body.income_tax_amount)}
                ,loan_amount=${db.escape(req.body.loan_amount)}
                ,loan_description=${db.escape(req.body.loan_description)}
                ,commission=${db.escape(req.body.commission)}
                ,sdl=${db.escape(req.body.sdl)}
                ,ot_amount=${db.escape(req.body.ot_amount)}
                ,basic_pay=${db.escape(req.body.basic_pay)}
                ,overtime_pay_rate=${db.escape(req.body.overtime_pay_rate)}
                ,department=${db.escape(req.body.department)}
                ,cpf_account_no=${db.escape(req.body.cpf_account_no)}
                ,pay_cdac=${db.escape(req.body.pay_cdac)}
                ,pay_sinda=${db.escape(req.body.pay_sinda)}
                ,pay_mbmf=${db.escape(req.body.pay_mbmf)}
                ,pay_eucf=${db.escape(req.body.pay_eucf)}
                ,allowance1=${db.escape(req.body.allowance1)}
                ,allowance2=${db.escape(req.body.allowance2)}
                ,allowance3	=${db.escape(req.body.allowance3)}
                ,paid_date=${db.escape(req.body.paid_date)}
                ,generated_date=${db.escape(req.body.generated_date)}
                ,deduction1=${db.escape(req.body.deduction1)}
                ,deduction2=${db.escape(req.body.deduction2)}
                ,deduction3=${db.escape(req.body.deduction3)}
                ,deduction4=${db.escape(req.body.deduction4)}
                ,cpf_employee=${db.escape(req.body.cpf_employee)}
                ,cpf_employer=${db.escape(req.body.cpf_employer)}
                ,loan_deduction=${db.escape(req.body.loan_deduction)}
                ,govt_donation=${db.escape(req.body.govt_donation)}
                ,total_cpf_contribution=${db.escape(req.body.total_cpf_contribution)}
                ,payslip_start_date=${db.escape(req.body.payslip_start_date)}
                ,payslip_end_date=${db.escape(req.body.payslip_end_date)}
                ,actual_working_days=${db.escape(req.body.actual_working_days)}
                ,working_days_in_month=${db.escape(req.body.working_days_in_month)}
                ,reimbursement=${db.escape(req.body.reimbursement)}
                ,allowance4=${db.escape(req.body.allowance4)}
                ,allowance5=${db.escape(req.body.allowance5)}
                ,director_fee=${db.escape(req.body.director_fee)}
                ,total_basic_pay_for_month=${db.escape(req.body.total_basic_pay_for_month)}
                ,mode_of_payment=${db.escape(req.body.mode_of_payment)}
                ,allowance6=${db.escape(req.body.allowance6)}
                WHERE payroll_management_id = ${db.escape(req.body.payroll_management_id  )}`,
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

app.post('/insertpayroll_management', (req, res, next) => {

  let data = {employee_id: req.body.employee_id,
              payroll_month: req.body.payroll_month,
              payroll_year: req.body.payroll_year,
              ot_hours	: req.body.ot_hours,
              additional_wages: req.body.additional_wages,
              cpf_deduction: req.body.cpf_deduction,
              statutary_deduction: req.body.statutary_deduction,
              status: req.body.status,
              net_total: req.body.net_total,
              notes: req.body.notes,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              flag: req.body.flag,
              income_tax_amount: req.body.income_tax_amount,
              loan_amount: req.body.loan_amount,
              loan_description: req.body.loan_description,
              commission: req.body.commission,
              sdl: req.body.sdl,
              ot_amount	: req.body.ot_amount,
              basic_pay: req.body.basic_pay,
              overtime_pay_rate: req.body.overtime_pay_rate,
              department: req.body.department,
              cpf_account_no: req.body.cpf_account_no,
              pay_cdac: req.body.pay_cdac,
              pay_sinda: req.body.pay_sinda,
              pay_mbmf: req.body.pay_mbmf,
              pay_eucf: req.body.pay_eucf,
              allowance1: req.body.allowance1,
              allowance2: req.body.allowance2,
              allowance3: req.body.allowance3,
              paid_date: req.body.paid_date,
              generated_date: req.body.generated_date,
              deduction1: req.body.deduction1,
              deduction2: req.body.deduction2,
              deduction3: req.body.deduction3,
              deduction4: req.body.deduction4,
              cpf_employee: req.body.cpf_employee,
              cpf_employer: req.body.cpf_employer,
              loan_deduction: req.body.loan_deduction,
              govt_donation: req.body.govt_donation,
              total_cpf_contribution: req.body.total_cpf_contribution,
              payslip_start_date: req.body.payslip_start_date,
              payslip_end_date: req.body.payslip_end_date,
              actual_working_days: req.body.actual_working_days,
              working_days_in_month: req.body.working_days_in_month,
              reimbursement: req.body.reimbursement,
              allowance4: req.body.allowance4,
              allowance5: req.body.allowance5,
              director_fee: req.body.director_fee,
              total_basic_pay_for_month: req.body.total_basic_pay_for_month,
              mode_of_payment: req.body.mode_of_payment,
              allowance6: req.body.allowance6,
        };

  let sql = "INSERT INTO payroll_management SET ?";
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

app.delete('/deletepayroll_management', (req, res, next) => {

  let data = {payroll_management_id : req.body.payroll_management_id };
  let sql = "DELETE FROM payroll_management WHERE ?";
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

app.post('/getPastLeaveHistory', (req, res, next) => {
  db.query(`SELECT l.from_date
  ,l.to_date
  ,l.no_of_days
  ,l.employee_id
  ,l.leave_type 
  FROM empleave l
  WHERE l.employee_id = ${db.escape(req.body.employee_id)}`,
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