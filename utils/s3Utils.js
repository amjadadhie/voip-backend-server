const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Fungsi untuk mendapatkan daftar file rekaman dari S3
const listRecordings = async () => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME, // Nama S3 Bucket Anda
        Prefix: 'recordings/', // Folder tempat rekaman disimpan
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.map(item => item.Key);
    } catch (error) {
        throw new Error('Error fetching recordings from S3: ' + error.message);
    }
};

module.exports = { listRecordings };
