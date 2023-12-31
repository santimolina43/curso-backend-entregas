import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/public/imgs/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }                              
})

export const uploader = multer({storage})

export const uploaderThumbnail = uploader.single('thumbnail')