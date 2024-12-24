import fs from 'fs'
import multer from "multer"
import AWS from 'aws-sdk'
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  })

const Fileupload=(path)=>{
    const storage=multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,path)
        },
        filename:function(req,file,callback){
            const uploadname=file.originalname.split(".");
            const extension="."+uploadname[uploadname.length-1];
            const fileuploadname= Date.now().toString();
            fs.readFile(path+file.originalname,(err)=>{
                if(!err){
                    callback(null,fileuploadname+extension)
                }
                else{
                    req.body.image = fileuploadname+extension;
                    callback(null,fileuploadname+extension)
                }
            })
        }
    })
    const uploaded=multer({storage:storage});
    return uploaded;
}
const s3fileupload = async(res) => {
    try{
        const blob = res.buffer
        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key:  Date.now().toString()+'__'+res.originalname,
            Body: blob,
            ACL: 'public-read'
          }).promise()
          return uploadedImage.Location
    }catch(e){
        console.log(e)
        return false
    }   
}
export default {Fileupload,s3fileupload}