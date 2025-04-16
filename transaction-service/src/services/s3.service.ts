// import { Injectable } from '@nestjs/common';
// import * as AWS from 'aws-sdk';

// @Injectable()
// export class S3Service {
//   private s3: AWS.S3;

//   constructor() {
//     this.s3 = new AWS.S3({
//       accessKeyId: process.env.AWS_ACCESS_KEY || 'your-access-key',
//       secretAccessKey: process.env.AWS_SECRET_KEY || 'your-secret-key',
//       region: process.env.AWS_REGION || 'us-east-1',
//     });
//   }

//   async uploadReceipt(
//     userId: string,
//     transactionId: string,
//     base64Data: string,
//   ): Promise<string> {
//     const buffer = Buffer.from(
//       base64Data.replace(/^data:image\/\w+;base64,/, ''),
//       'base64',
//     );

//     const fileType = base64Data.split(';')[0].split('/')[1];
//     const key = `receipts/${userId}/${transactionId}.${fileType}`;

//     const params = {
//       Bucket: process.env.S3_BUCKET || 'financial-app-receipts',
//       Key: key,
//       Body: buffer,
//       ContentEncoding: 'base64',
//       ContentType: `image/${fileType}`,
//     };

//     const { Location } = await this.s3.upload(params).promise();
//     return Location;
//   }
// }
