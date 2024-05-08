require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_SECRET_KEY   
  });

  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, '../profile-photos')
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname)
      }
  });
  const upload = multer({ storage: storage });

  
  async function uploadToCloudinary(localFilePath) {
      const mainFolderName = "profile-photos";
      const filePathOnCloudinary = mainFolderName + "/" + localFilePath;
  
      try {
          const result = await cloudinary.uploader.upload(localFilePath, { "public_id": filePathOnCloudinary });
          fs.unlinkSync(localFilePath);
          return {
              message: "Success",
              url: result.url
          };
      } catch (error) {
          fs.unlinkSync(localFilePath);
          return { message: "Fail" };
      }
  }
  
  module.exports = {
    onlineUpload: async (req, res, next) => {
          try {
              const localFilePath = req.body.file.path;
              const result = await uploadToCloudinary(localFilePath);
              const response = buildSuccessMsg([result.url]);
              res.send(response);
          } catch (error) {
              res.status(500).send({ error});
          }
      }
  };
  

