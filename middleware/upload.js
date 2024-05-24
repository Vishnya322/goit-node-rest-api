import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename(req, file, cb) {
    const extname = path.extname(file.originalname); //.png
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();

    console.log(`${basename}-${suffix}${extname}`);
    cb(null, `${basename}-${suffix}${extname}`);
  },
});

export default multer({ storage });
