# AWS Amplify React Tutorial Build notes.

This walkthrough expands on the [AWS Amplify Getting Started tutorial for ReactJS](https://docs.amplify.aws/start/q/integration/react). 

> This README describes the process I took to build the demo.
> If you have cloned the git repo and just want to build and deploy. see the main [README.md](./README.md) instead.

## 0. Verify developer workstation prereqs.

## 1. Initialize project

1. Create a React project
    ```sh
    YOUR_PROJECT_NAME=amplifytutorial
    
    npx create-react-app $YOUR_PROJECT_NAME
    # or [ time: ~47s ]
    yarn create react-app $YOUR_PROJECT_NAME 
    
    cd $YOUR_PROJECT_NAME
    npm start
    ```
    A browser window opens to display the boilerplate React welcome message.

2. Initialize Amplify backend into the project
    ```bash
    amplify init
    ```
    Step through the prompts.

3. Setup frontend

    Install Amplify libraries.

    ```sh
    npm install aws-amplify @aws-amplify/ui-react
    # or yarn, Done in 15.87s.
    yarn add aws-amplify @aws-amplify/ui-react
    ```

    Add amplify libraries to the app, edit *src/index.js*

    ```js
    import Amplify from "aws-amplify";
    import awsExports from "./aws-exports";
    Amplify.configure(awsExports);
    ```

## 2. Create a simple API and database app

This app is the example TODO list using GraphQL and the backing DynamoDB table.

1. Add API for GraphQL. 

    Follow the prompts.
    ```sh
    amplify add api
    ```

    Push to backend.
    ```sh
    amplify push
    amplify status
    ```

    (Optional) Test a local mock of the GraphQL API.

    ```sh
    amplify mock api
    ```

2. Connect the frontend UI to the backend API.

    Edit *src/App.js* 
    (see [tutorial](https://docs.amplify.aws/start/getting-started/data-model/q/integration/react#connect-frontend-to-api) for the code snippet)

3. Test locally

    ```sh
    npm start.
    ```
    Create a few TODO tasks. You can verify the items are added to the DynamoDB table, from the AWS Console.

## 3. Deploy app to hosted website.

1. Add Manual deployment hosting.

    ```sh
    amplify add hosting
    ```

    select:
    > *Managed hosting with custom domains, Continuous deployment*
    >  -> *Manual deployment*

    ```
    amplify publish
    ```

    The hosted website should now be online. Test in a web browser.

## 4. Add Authentication

1. Add Auth.
    ```sh
    amplify add auth
    amplify push
    ```

2. Create login UI
    Edit *src/App.js* 

    Code from the [Amplify tutorial](https://docs.amplify.aws/start/getting-started/auth/q/integration/react#create-login-ui)

    Import the withAuthenticator component:
    ```js
    import { withAuthenticator } from '@aws-amplify/ui-react'
    ```
    Change the default export to be the withAuthenticator wrapping the main component:
    ```js
    export default withAuthenticator(App)
    ```
    Run the app to see the new Authentication flow protecting the app:
    ```sh
    npm start
    ```
    Create new user, await verification email and use the verification code. 

    You might need to check your spam folder. The verification email is from *no-reply@verificationemail.com*. This can be customized. To find out more (outside the scope of this tutorial), see [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-email-address-customization.html)

3. Publish UI to the hosted website.
    ```sh
    amplify publish
    ```
    Test the web page.


## 5. Restructure app with navigation and routing.

Refactor the app with navigation and react-router into sub-components.

1. Install react bootstrap and router
    ```sh
    npm install react-router-dom
    npm install react-bootstrap bootstrap
    ```

2. Refactor UI into ReactJS components.
    Code is in this repo.
    1. *src/App.js*: implement router
    2. *src/components/Menubar.js* implement menubar
    3. *src/components/*.js* implement individual pages

3. Publish website to Amplify hosting
    ```sh
    amplify publish
    ```

4. Fix "Access Denied" by Enable Redirects for Single Page Web Apps (SPA) 

    This step is necessary to enable the Amplify hosted website to support SPA frameworks such as ReactJS react-router-dom. This fixes "AccessDenied" errors during navigation. 

    *Amplify Console -> App settings -> Rewrites and redirects*

    Add the following rule:

    * Source address: 
    ```</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>```
    * Target address: ```/index.html```
    * Type: ```200 (Rewrite)```

    See: 
    ["Redirects for Single Page Web Apps (SPA)"](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) 
    in the Amplify docs.

## 6. Create an upload feature. 

1. Add storage
    ```
    amplify add storage
    amplify push
    ```

2. Implement component, see *src/components/Upload.js*.
    
    Integrate the new component into the Menubar *src/App.js*, 
    and React Router *src/components/Menubar.js*.

    Uploads will now appear in the S3 bucket.

## 7. Setup Amplify Continual Deployment.

1. Change frontend deployments from Amplfify manual hosting, into automated Continual Deployment from the git repo.
    First, remove manual hosting.
    ```sh
    amplify remove hosting
    amplify push
    amplify status
    git add .
    git commit -m "Replace amplify manual hosting into CD"
    git push
    ```
    The manually deployed hosting website is now removed. 

    From the AWS Console, configure Amplify CD to deploy from your git repo. The first automated deployment kicks off, pulling the latest commit from the git repo. Verify the new CD hosted website.

## 8. Team development with feature branch and a sandbox environment (Optional).

In this scenario, a 2nd team developer sets up a feature branch with a sandbox environment within the same AWS Account. (Its also possible to have either shared or separate Amplify Environments and even AWS Environments)

1. Clone the project code repo.

    The 2nd developer can be simulated simply by using a fresh local directory. 
    
    Clone the repo, fork a new *experiment* code branch off from the *dev* branch.

    ```sh
    cd ..
    mkdir amplify-react-tutorial-experiment
    cd amplify-react-tutorial-experiment
    git clone YOUR_GIT_REPO_URL .
    git checkout -b dev remotes/origin/dev
    git checkout -b experiment
    git push --set-upstream origin experiment
    ```
2. Next, add the add the *experiment* Amplify environment. Try to choose the branch name same as the environment name to avoid confusion.

    ```sh
    amplify env add
    # complete the wizard questions...
    amplify push
    ```
    We now have a new Amplify backend environment, lets create the matching frontend environment.
    From the Amplify console -> frontend, Connect to this repository branch. 
    When the CD deployment completes, you should have a new sandbox frontend and backend. 

    > Tips:
    > Switch branches by running _both_ ```git checkout BRANCH_NAME``` _and_ ```amplify env checkout ENV_NAME``` 
    > Pull other team-member changes by running _both_ ```git pull``` _and_ ```amplify pull``` for the other branches, you should pull changes periodically to keep up with team development.

3. Cleanup the feature environment when no longer required.

    Ensure any work have been pull-request merged into the master branch.

    * Disconnect front-end

        Amplify console -> YOUR_APP -> App settings -> General -> Branches

        Disconnect the branch.

    * Remove back-end

        ```
        amplify env checkout <any-other-env>
        amplify env remove experiment
        ```

# 9. Create a predictions-based feature.

Example based on [AWS Amplify predictions library example](https://docs.amplify.aws/lib/predictions/sample/q/platform/js)

1. Setup the backend environment.
    ```sh
    git checkout -b prediction
    amplify add predictions # Convert, Translate Text
    amplify add predictions # Convert, Generate speech audio from text
    amplify add predictions # Convert, Transcribe text from audio
    amplify add predictions # Identify Text, select "Yes" to also identify documents.
    amplify add predictions # Identify Entities
    amplify add predictions # Interpret, Interpret Text, All
    amplify add predictions # Identify Labels
    amplify push
    # add the microphone module
    yarn add microphone-stream
    ```

2. Update the app code with the example.
    
    See Example code in *src/components/Predict.js* , which is from the Amplify docs example.
    
    Depending on the availability of particular AI/ML services in the AWS Region you are deploying, you may need to update the region. E.g. Amazon Transcribe (Speech to text) is not available in ap-southeast-1 at the time of writing. To fix, we point to ap-southeast-2 endpoint instead:
        
    Edit: *amplify/backend/predictions/transcription[ID]/transcription[ID]-template.json*, update RegionMapping accordingly, e.g. "ap-southeast-2"

    Test locally. ```npm start```
    The demo */predict* page shows demonstrations of the various prediction functions.
    
3. Update Identify Entities (Advanced) for self-trained face collection

    >Update amplify predictions module "Identify" 
    Workaround required due to S3 stack update error. Bug encountered inAmplify CLI 4.21.0.
    
    ```sh
    amplify update predictions
    ? Please select from one of the categories below Identify
    ? Which identify resource would you like to update? identifyEntitiesd1234567
    ? Would you like use the default configuration? Advanced Configuration
    ? Would you like to enable celebrity detection? Yes
    ? Would you like to identify entities from a collection of images? Yes
    ? How many entities would you like to identify? 50
    ? Would you like to allow users to add images to this collection? Yes
    ? Who should have access? Auth users only
    ```

    A new function is created, in: 
    *amplify/backend/function/RekognitionIndexFacesTrigger12345678/src/index.js*

    > Workaround: somehow add/removing the storage trigger function fixes a bug with cloudformation.
    ```sh
    amplify storage update
    ? Please select from one of the below mentioned services: Content (Images, audio, video, etc.)
    ? Who should have access: Auth and guest users
    ? What kind of access do you want for Authenticated users? create/update, read, delete
    ? What kind of access do you want for Guest users? read
    ? Select from the following options Update the Trigger
    ? Select from the following options Choose an existing function from the project
    ? Select from the following options RekognitionIndexFacesTrigger6394f3f5
    ```

    After ```amplify push``` deployment, in the AWS Console for Lambda, manually narrow down the Lambda function's S3 trigger paths. 

    Keep Enabled the 2 triggers for ObjectCreated and ObjectRemoved on S3 path *protected/predictions/index-faces/* , and Disable all other triggers.

    To List faces in the collection
    ```
    COLLECTION_ID=`aws rekognition list-collections | jq -r  ".CollectionIds[]" | grep identify`
    aws rekognition describe-collection --collection-id $COLLECTION_ID
    aws rekognition list-faces --collection-id $COLLECTION_ID
    ```

    To reset faces 
    ```
    FACEIDS=`aws rekognition list-faces --collection-id $COLLECTION_ID --query "Faces[].FaceId" --output text`
    aws rekognition delete-faces --collection-id $COLLECTION_ID --face-ids $FACEIDS
    ```

    Test the face registration and Rekognition feature!


# 10. Detect Leaf disease with an Amazon Rekognition Custom Labels model.

1. Create an Amazon Rekognition Custom Labels model. E.g. See my [Detect Rice Leaf Disease exmaple](https://github.com/frank-ang/rice-disease-rekognition) for an Agritech example to detect disease in rice crop through visual rice leaf image. 

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
Please edit the file in your editor: /Users/frankang/lab/Playground/amplify-react-tutorial/amplify/backend/function/DetectRiceLabels/src/index.js
? Press enter to continue 
Succesfully added the Lambda function locally
? Restrict API access Yes
? Who should have access? Authenticated users only
? What kind of access do you want for Authenticated users? read, update
? Do you want to add another path? No
Successfully added resource detect locally
```
It creates an API ```detect``` that calls a NodeJS Lambda Function ```DetectRiceLabels```. 

Test the dummy function
```
amplify mock function DetectRiceLabels
```

Implement the code
This function should make a cross-region call to the Amazon Rekognition Custom Labels model
Replace the function code with the code provided at [./src/lambda/lambda.detect.rice.index.js](./src/lambda/lambda.detect.rice.index.js) and update the hardcoded values in it to your environment.

Grant the Lambda function permissions to: 
* copy the image for detection, from the source bucket into, copy cross-region into the bucket where the Rekognition model lives.
* call the Rekognition custom labels model.

On the AWS console, update the Lambda function Execution role:

**Lambda->DetectRiceLabels function -> Permissions Tab -> Execution Role (opens IAM console)**

Allow these actions on the Role IAM Action: 
* "rekognition:DetectCustomLabels",
* "s3:PutObject",
* "s3:GetObject",
* "s3:ListBucket"

Test by opening the browser page to the Detect Rice Disease page. Upload a sample rice leaf image. A successful call should display the disease detection results.

# TODO:

* Bounding box in image viewer.
* Amplify Analytics


