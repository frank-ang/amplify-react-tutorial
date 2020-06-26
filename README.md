# Build AI/ML Apps with React and AWS Amplify.

This walkthrough expands on the [AWS Amplify Getting Started tutorial for ReactJS](https://docs.amplify.aws/start/q/integration/react). 

> My detailed notes on building the demo from scratch is in [README-BUILD.md](./README-BUILD.md)

## Verify developer workstation prereqs.

Same prereqs as listed in the official docs. Briefly:
* Node.js v10.x or later
* npm v5.x or later
* git v2.14.1 or later
* AWS Account
* AWS Amplify CLI

## Initialize project

Clone this repo, cd into the repo directory, and initialize the project.

```sh
# install Node packages (yarn or npm)
yarn install
```

Initialize Amplify into the project using the wizard.
```sh
amplify init
# ... the output shows successful with:
Using default provider  awscloudformation
✔ Initialized provider successfully.
Initialized your environment successfully.
```

Add Amplify modules
```sh
# Hosting with Amplify Console, Manual deployment
amplify add hosting

# Auth with: Default configuration
amplify add auth

# Storage for Content (Images, audio, video, etc.), Auth users, no Lambda Trigger.
amplify add storage

# API for GraphQL, authorized using Cognito, guided schema creation for "Todo" type 
amplify add api
```

Publish the changes.
```
amplify publish
```

## Enable Redirects on the hosting website.

This step is necessary to enable the Amplify hosted website to support SPA frameworks such as ReactJS react-router-dom. This fixes "AccessDenied" errors on the browser when using ```react-router```.

```
amplify console
```
*Amplify Console -> App settings -> Rewrites and redirects*

Add the following rule:

* Source address: 

    ```</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>```

* Target address: 
    
    ```/index.html```

* Type: 
    
    ```200 (Rewrite)```

Ref: Amplify docs ["Redirects for Single Page Web Apps (SPA)"](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) 

Verify the amplify website is serving. Create an account, verification code sent to email, and login. Navigation pages should work now.

## Install Amplify Predictions modules into the project.

```
amplify add predictions # Convert, Translate Text
amplify add predictions # Convert, Generate speech audio from text
amplify add predictions # Convert, Transcribe text from audio
amplify add predictions # Identify Text. NOTE: Would you also like to identify documents? Yes.
amplify add predictions # Identify Entities
amplify add predictions # Interpret, Interpret Text, All
amplify add predictions # Identify Labels
```

Depending on the availability of particular AI/ML services in the AWS Region you are deploying to, you may need to update the region to where the service exists. E.g. at the time of writing, Amazon Transcribe (Speech to text) is not available in ap-southeast-1, to fix, we point to ap-southeast-2 endpoint instead:
    
Edit: **amplify/backend/predictions/transcription[ID]/transcription[ID]-template.json**, update RegionMapping accordingly, e.g. "ap-southeast-2"

Publish the changes
```sh
amplify publish
```

View the **Predictions Examples** page. Try the AI/ML samples. 

> Samples are from the Amplify docs, Predictions Example https://docs.amplify.aws/lib/predictions/sample/q/platform/js#sample-react-app


## Enable Entity Identification using custom collection for advanced face detection example

Update Identify Entities (Advanced) for self-trained face collection. Update amplify predictions module "Identify" 
    
```sh
amplify update predictions
# in the wizard, make the following changes...
? Please select from one of the categories below Identify
? Which identify resource would you like to update? identifyEntities12345678
? Would you like use the default configuration? Advanced Configuration
? Would you like to enable celebrity detection? Yes
? Would you like to identify entities from a collection of images? Yes
? How many entities would you like to identify? 50
? Would you like to allow users to add images to this collection? Yes
? Who should have access? Auth users only
```

When done, a new function is created: 
*amplify/backend/function/RekognitionIndexFacesTrigger12345678/src/index.js*

This is the Lambda Function to index new face images into Rekognition. The Node implementation code is auto-generated.

Now, we need to setup S3 events to trigger this Lambda Function so that new faces are indexed. 
```sh
amplify storage update
# in the wizard, make the following selections...
? Please select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Who should have access: Auth and guest users
? What kind of access do you want for Authenticated users? create/update, read, delete
? What kind of access do you want for Guest users? read
? Select from the following options Update the Trigger
? Select from the following options Choose an existing function from the project
? Select from the following options RekognitionIndexFacesTrigger12345678
```
> I think the above step was a workaround to fix an Amplify bug. Amplify should really automate this step.

Deploy.

```sh
amplify push
```

In the AWS Console for Lambda, manually _narrow down_ the Lambda function's S3 trigger paths. 
* Keep Enabled the 2 triggers for ObjectCreated and ObjectRemoved at S3 path 
    ```protected/predictions/index-faces/```
* Disable all other triggers.

Test the face registration and Rekognition feature!

# Detect Crop Disease

Early detection of crop disease is essential for planetary food sustainability. 
This concept of uses machine vision through a mobile web app to infer rice leaf health using an Amazon Rekognition Custom Labels model. 

1. Create an Amazon Rekognition Custom Labels model. E.g. See my notes about the data sources to train and test a rice disease image recognition model: [https://github.com/frank-ang/rice-disease-rekognition](https://github.com/frank-ang/rice-disease-rekognition) for an Agritech example to detect disease in rice leaf images. 

2. Create a REST API to call a NodeJS function, which will call your Amazon Rekognition Custom Labels model.

    ```sh
    amplify add api
    ? Please select from one of the below mentioned services: REST
    ? Provide a friendly name for your resource to be used as a label for this category in the project: detect
    ? Provide a path (e.g., /book/{isbn}): /rice
    ? Choose a Lambda source Create a new Lambda function
    ? Provide a friendly name for your resource to be used as a label for this category in the project: DetectRiceLabe
    ls
    ? Provide the AWS Lambda function name: DetectRiceLabels
    ? Choose the function runtime that you want to use: NodeJS
    ? Choose the function template that you want to use: Hello World
    ? Do you want to access other resources created in this project from your Lambda function? Yes
    ? Select the category storage
    ? Storage has 2 resources in this project. Select the one you would like your Lambda to access s3ac8d3362
    ? Select the operations you want to permit for s3ac8d3362 read

    You can access the following resource attributes as environment variables from your Lambda function
        ENV
        REGION
        STORAGE_S3AC8D3362_BUCKETNAME
    ? Do you want to invoke this function on a recurring schedule? No
    ? Do you want to edit the local lambda function now? Yes
    Please edit the file in your editor: /YOUR_PROJECTS_PATH/amplify-react-tutorial/amplify/backend/function/DetectRiceLabels/src/index.js
    ? Press enter to continue 
    Succesfully added the Lambda function locally
    ? Restrict API access Yes
    ? Who should have access? Authenticated users only
    ? What kind of access do you want for Authenticated users? read, update
    ? Do you want to add another path? No
    Successfully added resource detect locally
    ```
    
    It creates an API ```detect``` that calls a NodeJS Lambda Function ```DetectRiceLabels```. 

    Test the dummy function (optional), it just displays a greeting message.
    ```
    amplify mock function DetectRiceLabels
    ```

3. Implement the Function code
    
    This function will make a cross-region call to the Amazon Rekognition Custom Labels model. 
    
    > At the time of this writing, Amazon Rekognition Custom Labels is available in a few regions, just not yet available in my preferred region of ap-southeast-1 (Singapore).

    The Lambda Function is deployed in the same region as the other Amplify resourcesand will call the Amazon Rekognition Custom Labels model deployed in a supported region,in this case, I have chosen us-east-1 (N. Virginia).
    
    Replace the generated function code with the completed code provided at [./src/lambda/lambda.detect.rice.index.js](./src/lambda/lambda.detect.rice.index.js) and update the hardcoded values in it to your environment.

4. Grant the Lambda function permissions to: 
    * copy the image for detection, from the source bucket into, copy cross-region into the bucket where the Rekognition model lives.
    * call the Rekognition custom labels model.

    On the AWS console, update the Lambda function Execution role:

    **Lambda->DetectRiceLabels function -> Permissions Tab -> Execution Role (opens IAM console)**

    Allow these actions on the Role IAM Action: 
    * "rekognition:DetectCustomLabels",
    * "s3:PutObject",
    * "s3:GetObject",
    * "s3:ListBucket"

5. Test by opening the browser page to the Detect Rice Disease page. Upload a sample rice leaf image. A successful call should display the disease detection results.

# License

This tutorial app is licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE.txt) for the full license text.