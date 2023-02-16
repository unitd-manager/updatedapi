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

app.get('/getjobinformationforList', (req, res, next) => {
  db.query(`SELECT 
  j.job_information_id
 ,j.department
 ,j.basic_pay
 ,e.emp_code
 ,e.first_name
 ,e.nric_no
 ,e.spass_no
 ,e.fin_no
 ,e.date_of_birth
 ,e.citizen
 ,j.status
 FROM job_information j
 LEFT JOIN (employee e) ON (e.employee_id = j.employee_id)
 WHERE j.job_information_id != '';`,
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



app.get('/getjobinformation', (req, res, next) => {
  db.query(`SELECT DISTINCT 
   j.act_join_date
             ,j.job_information_id
            ,j.duty_responsibility
            ,j.duration_of_employment
            ,j.place_of_work
            ,j.work_hour_details
            ,j.rest_day_per_week
            ,j.paid_annual_leave_per_year
            ,j.paid_outpatient_sick_leave_per_year
            ,j.paid_hospitalisation_leave_per_year
            ,j.paid_medical_examination_fee
            ,j.other_type_of_leave
            ,j.other_medical_benefits
            ,j.probationary
            ,j.emp_type
            ,j.designation
            ,j.department
            ,j.join_date
            ,j.status
            ,j.payment_type
            ,j.salary_payment_dates
            ,j.overtime_payment_dates
            ,j.working_days
            ,j.basic_pay
            ,j.overtime
            ,j.overtime_pay_rate
            ,j.allowance1
            ,j.allowance2
            ,j.allowance3
            ,j.allowance4
            ,j.allowance5
            ,j.allowance6
            ,j.deduction1
            ,j.deduction2
            ,j.deduction3
            ,j.deduction4
            ,j.levy_amount
            ,j.cpf_applicable
            ,j.govt_donation
            ,j.income_tax_id
            ,j.income_tax_amount
            ,j.cpf_account_no
            ,j.mode_of_payment
            ,j.account_no
            ,j.bank_name
            ,j.bank_code
            ,j.branch_code
            ,j.notice_period_for_termination
            ,j.resignation_notice_date
            ,j.termination_date
            ,j.termination_reason
            ,j.departure_date
            ,j.pay_cdac
            ,j.pay_eucf
            ,j.pay_mbmf
            ,j.pay_sinda
            ,j.length_of_probation
            ,j.probation_start_date
            ,j.probation_end_date
            ,e.emp_code
            ,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name
            ,e.first_name
            ,e.last_name
            ,e.phone
            ,e.email
            ,e.salary
            ,e.nric_no
            ,e.position
            ,e.date_of_expiry
            ,e.spass_no
            ,e.fin_no
            ,e.employee_work_type
            ,e.date_of_birth
            ,e.citizen
            ,e.employee_id
            FROM job_information j
            LEFT JOIN (employee e) ON (e.employee_id = j.employee_id)
            WHERE j.job_information_id !=''  AND j.status='Current'
            ORDER BY e.first_name ASC`,
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

app.post('/EditjobinformationById', (req, res, next) => {
  db.query(`SELECT j.act_join_date
             ,j.job_information_id
            ,j.duty_responsibility
            ,j.duration_of_employment
            ,j.place_of_work
            ,j.work_hour_details
            ,j.rest_day_per_week
            ,j.paid_annual_leave_per_year
            ,j.paid_outpatient_sick_leave_per_year
            ,j.paid_hospitalisation_leave_per_year
            ,j.paid_medical_examination_fee
            ,j.other_type_of_leave
            ,j.other_medical_benefits
            ,j.probationary
            ,j.emp_type
            ,j.designation
            ,j.department
            ,j.join_date
            ,j.status
            ,j.payment_type
            ,j.salary_payment_dates
            ,j.overtime_payment_dates
            ,j.working_days
            ,j.basic_pay
            ,j.overtime
            ,j.overtime_pay_rate
            ,j.allowance1
            ,j.allowance2
            ,j.allowance3
            ,j.allowance4
            ,j.allowance5
            ,j.deduction1
            ,j.deduction2
            ,j.deduction3
            ,j.levy_amount
            ,j.cpf_applicable
            ,j.govt_donation
            ,j.income_tax_id
            ,j.income_tax_amount
            ,j.cpf_account_no
            ,j.mode_of_payment
            ,j.account_no
            ,j.bank_name
            ,j.bank_code
            ,j.branch_code
            ,j.notice_period_for_termination
            ,j.resignation_notice_date
            ,j.termination_date
            ,j.termination_reason
            ,j.departure_date
            ,j.pay_cdac
            ,j.pay_eucf
            ,j.pay_mbmf
            ,j.pay_sinda
            ,j.length_of_probation
            ,j.probation_start_date
            ,j.probation_end_date
            ,e.emp_code
            ,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name
            ,e.first_name
            ,e.last_name
            ,e.phone
            ,e.email
            ,e.salary
            ,e.nric_no
            ,e.position
            ,e.date_of_expiry
            ,e.spass_no
            ,e.fin_no
            ,e.employee_work_type
            ,e.date_of_birth
            ,e.citizen
            FROM job_information j
            LEFT JOIN (employee e) ON (e.employee_id = j.employee_id)
            WHERE j.job_information_id=${db.escape(req.body.job_information_id)}
            AND j.status='Current'
            ORDER BY e.first_name ASC`,
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
app.post('/edit-jobinformation', (req, res, next) => {
    db.query(`UPDATE job_information
              SET act_join_date=${db.escape(req.body.act_join_date)}
              ,duty_responsibility=${db.escape(req.body.duty_responsibility)}
              ,duration_of_employment=${db.escape(req.body.duration_of_employment)}
              ,place_of_work=${db.escape(req.body.place_of_work)}
              ,work_hour_details=${db.escape(req.body.work_hour_details)}
              ,rest_day_per_week=${db.escape(req.body.rest_day_per_week)}
              ,paid_annual_leave_per_year=${db.escape(req.body.paid_annual_leave_per_year)}
              ,paid_outpatient_sick_leave_per_year=${db.escape(req.body.paid_outpatient_sick_leave_per_year)}
              ,paid_hospitalisation_leave_per_year=${db.escape(req.body.paid_hospitalisation_leave_per_year)}
              ,other_type_of_leave=${db.escape(req.body.other_type_of_leave)}
              ,other_medical_benefits=${db.escape(req.body.other_medical_benefits)}
              ,probationary=${db.escape(req.body.probationary)}
              ,emp_type=${db.escape(req.body.emp_type)}
              ,designation=${db.escape(req.body.designation)}
              ,department=${db.escape(req.body.department)}
              ,join_date=${db.escape(req.body.join_date)}
              ,status=${db.escape(req.body.status)}
              ,payment_type=${db.escape(req.body.payment_type)}
              ,salary_payment_dates=${db.escape(req.body.salary_payment_dates)}
              ,overtime_payment_dates=${db.escape(req.body.overtime_payment_dates)}
              ,working_days=${db.escape(req.body.working_days)}
              ,basic_pay=${db.escape(req.body.basic_pay)}
              ,overtime=${db.escape(req.body.overtime)}
              ,overtime_pay_rate=${db.escape(req.body.overtime_pay_rate)}
              ,allowance1=${db.escape(req.body.allowance1)}
              ,allowance2=${db.escape(req.body.allowance2)}
              ,allowance3=${db.escape(req.body.allowance3)}
              ,allowance4=${db.escape(req.body.allowance4)}
              ,allowance5=${db.escape(req.body.allowance5)}
              ,deduction1=${db.escape(req.body.deduction1)}
              ,deduction2=${db.escape(req.body.deduction2)}
              ,deduction3=${db.escape(req.body.deduction3)}
              ,deduction4=${db.escape(req.body.deduction4)}
              ,levy_amount=${db.escape(req.body.levy_amount)}
              ,govt_donation=${db.escape(req.body.govt_donation)}
              ,income_tax_id=${db.escape(req.body.income_tax_id)}
              ,income_tax_amount=${db.escape(req.body.income_tax_amount)}
              ,cpf_account_no=${db.escape(req.body.cpf_account_no)}
              ,mode_of_payment=${db.escape(req.body.mode_of_payment)}
              ,account_no=${db.escape(req.body.account_no)}
              ,bank_name=${db.escape(req.body.bank_name)}
              ,bank_code=${db.escape(req.body.bank_code)}
              ,branch_code=${db.escape(req.body.branch_code)}
              ,notice_period_for_termination=${db.escape(req.body.notice_period_for_termination)}
              ,resignation_notice_date=${db.escape(req.body.resignation_notice_date)}
              ,termination_date=${db.escape(req.body.termination_date)}
              ,termination_reason=${db.escape(req.body.termination_reason)}
              ,departure_date=${db.escape(req.body.departure_date)}
              ,cpf_applicable=${db.escape(req.body.cpf_applicable)}
              ,probation_start_date=${db.escape(req.body.probation_start_date)}
              ,probation_end_date=${db.escape(req.body.probation_end_date)}
              ,pay_cdac=${db.escape(req.body.pay_cdac)}
              ,pay_sinda=${db.escape(req.body.pay_sinda)}
              ,pay_eucf=${db.escape(req.body.pay_eucf)}
              ,pay_mbmf=${db.escape(req.body.pay_mbmf)}
              ,length_of_probation=${db.escape(req.body.length_of_probation)}
              WHERE job_information_id  = ${db.escape(req.body.job_information_id )}`,
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
    
    
              app.post('/insertjob_information', (req, res, next) => {

                let data = {designation: req.body.designation,
                  probationary:'0',
                  emp_type: req.body.emp_type,
                  join_date: req.body.join_date,
                  act_join_date: req.body.act_join_date,
                  termination_date: req.body.termination_date,
                  termination_reason: req.body.termination_reason,
                  department: req.body.department,
                  basic_pay: req.body.basic_pay,
                  levy_amount: req.body.levy_amount,
                  working_days: req.body.working_days,
                  payment_type: req.body.payment_type,
                  overtime: '0',
                  overtime_pay_rate: req.body.overtime_pay_rate,
                  cpf_applicable: '0',
                  income_tax_id: req.body.income_tax_id,
                  pay_cdac: req.body.pay_cdac,
                  pay_sinda: req.body.pay_sinda,
                  pay_mbmf: req.body.pay_mbmf,
                  cpf_account_no: req.body.cpf_account_no,
                  pay_eucf: req.body.pay_eucf,
                  mode_of_payment: req.body.mode_of_payment,
                  account_no: req.body.account_no,
                  bank_name: req.body.bank_name,
                  bank_code: req.body.bank_code,
                  branch_code: req.body.branch_code,
                  creation_date: req.body.creation_date,
                  modification_date: req.body.modification_date,
                  created_by: req.body.created_by,
                  modified_by: req.body.modified_by,
                  flag: req.body.flag,
                  allowance1: req.body.allowance1,
                  status:  req.body.status,
                  income_tax_amount: req.body.income_tax_amount,
                  allowance2: req.body.allowance2,
                  allowance3: req.body.allowance3,
                  deduction1: req.body.deduction1,
                  deduction2: req.body.deduction2,
                  deduction3: req.body.deduction3,
                  deduction4: req.body.deduction4,
                  employee_id: req.body.employee_id,
                  govt_donation: req.body.govt_donation,
                  departure_date: req.body.departure_date,
                  resignation_notice_date: req.body.resignation_notice_date,
                  work_hour_details: req.body.work_hour_details,
                  duty_responsibility: req.body.duty_responsibility,
                  rest_day_per_week: req.body.rest_day_per_week,
                  probation_start_date: req.body.probation_start_date,
                  probation_end_date: req.body.probation_end_date,
                  length_of_probation: req.body.length_of_probation,
                  notice_period_for_termination: req.body.notice_period_for_termination,
                  duration_of_employment: req.body.duration_of_employment,
                  place_of_work: req.body.place_of_work,
                  salary_payment_dates : req.body. salary_payment_dates ,
                  overtime_payment_dates: req.body.overtime_payment_dates,
                  paid_annual_leave_per_year: req.body.paid_annual_leave_per_year,
                  paid_outpatient_sick_leave_per_year: req.body.paid_outpatient_sick_leave_per_year,
                  paid_hospitalisation_leave_per_year: req.body.paid_hospitalisation_leave_per_year,
                  other_type_of_leave: req.body.other_type_of_leave,
                  paid_medical_examination_fee: '0',
                  other_medical_benefits: req.body.other_medical_benefits,
                  allowance4: req.body.allowance4,
                  allowance5: req.body.allowance5,
                  allowance6: req.body.allowance6,
                  site_id: req.body.site_id,
                  cpf_applicable: req.body.cpf_applicable,
                  over_time_rate: req.body.over_time_rate};
                let sql = "INSERT INTO job_information SET ?";
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
              
              app.post('/deletejob_information', (req, res, next) => {

                let data = {job_information_id : req.body.job_information_id };
                let sql = "DELETE FROM job_information WHERE ?";
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
              app.get('/getEmployee', (req, res, next) => {
                db.query(`SELECT 
                e.employee_id
               ,e.first_name
               ,e.nric_no
               ,e.fin_no
               ,(SELECT COUNT(*) FROM job_information ji WHERE ji.employee_id=e.employee_id AND ji.status='current') AS e_count
                FROM employee e 
                `,
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
                      
app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
  });
  
  module.exports = app;