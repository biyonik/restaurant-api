import {S3} from "aws-sdk";

export default class UploadFileUtil {
    static uploadToS3(files: Array<Express.Multer.File>) {
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        let images = [];
        return new Promise(async (resolve, reject) => {
            for (const file of files) {
                const imgKey = `${file.originalname.split('.')[0]}-${Date.now()}.${file.originalname.split('.')[1]}`;
                const params = {
                    Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
                    Key: imgKey,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };

                const image = await s3.upload(params).promise();

                if (!image) {
                    reject('Error 1 - Restaurant image not uploaded!');
                }

                images.push(image);
                if (images.length === files.length) {
                    resolve(images);
                }
            }
        });
    }

    static deleteFromS3(key: string): Promise<any> {
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        return new Promise((resolve, reject) => {
            s3.deleteObject({
                Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
                Key: key,
            }, (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }
}
