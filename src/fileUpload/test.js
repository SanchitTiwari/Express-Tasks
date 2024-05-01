// require('dotenv').config();
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret:process.env.CLOUDINARY_SECRET_KEY   
//   });

//   const uploadPhotoOnline = async(req, res) => {
//     const file =  req.body.file;
//     if (!file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     cloudinary.uploader.upload(file.path, (error, result) => {
//       if (error) {
//         return res.status(500).json({ error: 'Upload failed', message: error.message });
//       }
//       res.status(200).json({ url: result.secure_url });
//     });
// };


// module.exports = {uploadPhotoOnline};





// // const multer  = require('multer')
// // const cloudinary = require('cloudinary').v2;
// // const fs = require('fs');

// // var storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, './uploads')
// //     },
// //     filename: function (req, file, cb) {
// //       cb(null, file.originalname)
// //     }
// // })
// // var upload = multer({ storage: storage })

// // cloudinary.config({ 
// //     cloud_name: process.env.CLOUDINARY_NAME, 
// //     api_key: process.env.CLOUDINARY_API_KEY, 
// //     api_secret:process.env.CLOUDINARY_SECRET_KEY   
// //   });
// //   var locaFilePath = req.file.path;
// //   async function uploadToCloudinary(locaFilePath) {
// //     var mainFolderName = "profile-photos"

// //     var filePathOnCloudinary = mainFolderName + "/" + locaFilePath
// //     return cloudinary.uploader.upload(locaFilePath,{"public_id":filePathOnCloudinary})
// //     .then((result) => {
// //       fs.unlinkSync(locaFilePath)
      
// //       return {
// //         message: "Success",
// //         url:result.url
// //       };
// //     }).catch((error) => {
// //       fs.unlinkSync(locaFilePath)
// //       return {message: "Fail",};
// //     });
// //   }
  
// // module.exports = {uploadToCloudinary};