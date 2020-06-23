# AWS Amplify React Tutorial

This walkthrough expands on the [AWS Amplify Getting Started tutorial for ReactJS](https://docs.amplify.aws/start/q/integration/react). 

> My detailed notes on building the demo from scratch is in [README-BUILD.md](./README-BUILD.md)

## 0. Verify developer workstation prereqs.

Same prereqs as listed in the official docs. Briefly:
* Node.js v10.x or later
* npm v5.x or later
* git v2.14.1 or later
* AWS Account
* AWS Amplify CLI

## 1. Initialize project

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

## Enable Redirects for Single Page Web Apps (SPA) to fix "Access Denied" 

This step is necessary to enable the Amplify hosted website to support SPA frameworks such as ReactJS react-router-dom. This fixes "AccessDenied" errors during navigation. 

```
amplify console
```
*Amplify Console -> App settings -> Rewrites and redirects*

Add the following rule:

* Source address: 
    ```
    </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>
    ```
* Target address: 
    ```/index.html```
* Type: 
    ```200 (Rewrite)```

See: 
["Redirects for Single Page Web Apps (SPA)"](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) 
in the Amplify docs.

Verify the amplify website is serving. Create an account and login.

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

Depending on the availability of particular AI/ML services in the AWS Region you are deploying, you may need to update the region. E.g. Amazon Transcribe (Speech to text) is not available in ap-southeast-1 at the time of writing. To fix, we point to ap-southeast-2 endpoint instead:
    
 Edit: *amplify/backend/predictions/transcription[ID]/transcription[ID]-template.json*, update RegionMapping accordingly, e.g. "ap-southeast-2"

Publish the changes
```
amplify publish
```

View the *Predictions Examples* page. Try the AI/ML samples.


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

Workaround to fix a bug, somehow add/removing the storage trigger function.
```sh
amplify storage update
# in the wizard, make the following changes...
? Please select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Who should have access: Auth and guest users
? What kind of access do you want for Authenticated users? create/update, read, delete
? What kind of access do you want for Guest users? read
? Select from the following options Update the Trigger
? Select from the following options Choose an existing function from the project
? Select from the following options RekognitionIndexFacesTrigger12345678
```

Deploy.
```amplify push```

In the AWS Console for Lambda, manually narrow down the Lambda function's S3 trigger paths. 
* Keep Enabled the 2 triggers for ObjectCreated and ObjectRemoved at S3 path *protected/predictions/index-faces/* * Disable all other triggers.

Test the face registration and Rekognition feature!

