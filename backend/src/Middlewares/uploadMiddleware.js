import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
destination: (request, file, callback) => {
    callback(null, 'uploads/images'); 
},
filename: (request, file, callback) => {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
    callback(null, fileName);
},
});

const fileFilter = (request, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error('Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos.'));
    }
    callback(null, true);    
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

export default upload;