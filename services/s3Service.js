const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Fungsi untuk mendapatkan daftar file rekaman dari S3
exports.listRecordings = async () => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Prefix: "recordings/"
        };

        const data = await s3.listObjectsV2(params).promise();
        console.log("Data from S3:", data);  // Log data dari S3 untuk debugging

        const files = data.Contents.map(file => ({
            name: file.Key,
            lastModified: file.LastModified,
            size: file.Size,
            url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
        }));

        return files;
    } catch (error) {
        console.error("Error listing S3 files:", error);
        throw error;
    }
};


// Fungsi untuk mendapatkan Signed URL agar user bisa streaming tanpa download
exports.getSignedUrl = (fileName) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Expires: 3600  // URL berlaku selama 1 jam
    };

    return s3.getSignedUrl('getObject', params);
};
