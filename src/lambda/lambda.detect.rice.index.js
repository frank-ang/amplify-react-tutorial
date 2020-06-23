var AWS = require('aws-sdk');

// Hardcoded values, TODO replace with your values.
const PROJECT_VERSION_ARN = 'arn:aws:rekognition:us-east-1:450428438179:project/rice-iad/version/rice-iad.2020-02-02T15.54.48/1580630090445';
const TARGET_BUCKET_NAME = "sandbox00-aiml-iad";
const SOURCE_BUCKET_NAME = process.env.STORAGE_S3AC8D3362_BUCKETNAME;

// function scope
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const rekognition = new AWS.Rekognition({region: 'us-east-1'});

// function handler
exports.handler = async (event) => {    
    console.log("Event query string parameters: " + JSON.stringify(event.queryStringParameters));
    console.log("sourceBucketName: " + SOURCE_BUCKET_NAME);
    var image = event.queryStringParameters.image;
    const targetKey = "unknown/" + image.substring(image.lastIndexOf('/')+1);
    const source = `/${SOURCE_BUCKET_NAME}${image}`;
    console.log(`Source: ${source}`)
    var s3params = {
      Bucket: TARGET_BUCKET_NAME, 
      CopySource: source,  
      Key: targetKey
    };
    await s3.copyObject(s3params).promise();
    console.log("S3 object copied.");

    var rekognitionParams = {
      Image: {
        S3Object: {
          Bucket: TARGET_BUCKET_NAME,
          Name: targetKey,
        }
      },
      ProjectVersionArn: PROJECT_VERSION_ARN,
      MaxResults: '1',
      MinConfidence: '60'
    };
    const customLabelsResponse = await rekognition.detectCustomLabels(rekognitionParams).promise();
    console.log("detectCustomLabels returned: " + JSON.stringify(customLabelsResponse));

    const response = {
        headers: {
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin": "*",
        },
    };
    response.statusCode=200;
    response.body = JSON.stringify(customLabelsResponse);
    return response;
};
