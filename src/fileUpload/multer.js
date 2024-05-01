const multer = require('multer')

const uploadProfilePhoto = (req, res, next) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/profile-photos');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);             // failsafe to ensure files are not overwritten
          }});
    {
    const upload = multer({ storage: storage,}).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error(err);
            return res.status(500).json({ message: 'File upload error' });
        } else if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Unknown error' });
        }
        
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        res.status(200).json({ imagePath: file.path });
    });
    
};
};
module.exports = {uploadProfilePhoto};
