const error = require("../helpers/errorhandles")
// const nodemailer=require('nodemailer')

// const MAIL_USER = process.env.MAIL_USER
// const MAIL_PASS = process.env.MAIL_PASS
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     auth: {
//       user: MAIL_USER,
//       pass: MAIL_PASS
//     }
// })

exports.sendmail =   async (req, res, next) => {   
    try{
        
        if(req.params.apikey == process.env.APP_KEY)
        {
            // await Mailjob.findAll({ 
            //     where:{ email:{ [Op.ne]: ''  } },
            //     include:[Emailtemplate],
            //     }).then(mailjobs =>{    
            //             mailjobs.forEach(mailjob =>{
            //                 const values = mailjob.respval.split(',')
            //                 const params = mailjob.emailtemplate.respval.split(',')
            //                 let content=mailjob.emailtemplate.content
            //                 values.forEach((value,index)=>{
            //                     content = content.replace(params[index],value)
            //                 })
            //                 const mailOptions = {
            //                     from: mailjob.emailtemplate.fromemail,
            //                     to: mailjob.email,
            //                     subject: "Faraday Credential",
            //                     html: content
            //                 }
            //                 transporter.sendMail(mailOptions).then(Mailjob.destroy({ where: {id:mailjob.id} })).catch(err => { next(new error(err,500)) })
            //             })
            //             res.send({status:"success",message:"Mail sent successfully."})
            //         }).catch(err => { 
            //             next(new error(err, 500));
            //         })
        }
        else{
            next(new error('Not a valid API key',500))
        }
        
    } 
    catch(err){  
        next(new error(err, 500));
    } 
}

exports.sendsms =   async (req, res, next) => {   
    try{
        if(req.params.apikey == process.env.APP_KEY)
        {
            // await Mailjob.findAll({ 
            //     where:{ phone:{ [Op.ne]: ''  } },
            //     include:[Emailtemplate],
            //     }).then(mailjobs =>{    
            //         const smsOptions =[]
            //             mailjobs.forEach(mailjob =>{
            //                 const values = mailjob.respval.split(',')
            //                 const params = mailjob.emailtemplate.respval.split(',')
            //                 let content=mailjob.emailtemplate.content
            //                 values.forEach((value,index)=>{
            //                     content = content.replace(params[index],value)
            //                 })
            //                smsOptions.push(mailjob.emailtemplate.fromemail,mailjob.phone,content)
            //             })
            //             res.send({status:"success",message:"SMS sent successfully."})
            //         }).catch(err => { 
            //             next(new error(err, 500));
            //         })
        }
        else{
            next(new error('Not a valid API key',500))
        }
        
    } 
    catch(err){  
        next(new error(err, 500));
    } 
}