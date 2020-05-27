# AWS Amplify React Tutorial

This walkthrough expands on the [AWS Amplify Getting Started tutorial for ReactJS](https://docs.amplify.aws/start/q/integration/react). 

## 0. Verify prereqs.

Same prereqs as listed in the official docs. Briefly:
* Node.js v10.x or later
* npm v5.x or later
* git v2.14.1 or later
* AWS Account
* AWS Amplify CLI

## 1. Initialize project

1. Create a React project
```bash
YOUR_PROJECT_NAME=amplify02
npx create-react-app $YOUR_PROJECT_NAME
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
```

Add amplify libraries to the app, edit *src/index.js*

```js
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);
```

## 2. Create a simple API and database app

This is a TODO list using GraphQL and a DynamoDB table.

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
npm start
```
Create a few TODO tasks. You can verify the items are added to the DynamoDB table:
```sh

```

## 3. Deploy app to hosted website.

1. Add Hosting.

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
    See code in this repo:
    1. *src/App.js*: implement router
    2. *src/components/Menubar.js* implement menubar
    3. *src/components/*.js* implement individual pages

3. Publish website to Amplify hosting
```sh
amplify publish
```

4. Enable Redirects for Single Page Web Apps (SPA) 

This step is necessary to enable the Amplify hosted website to support SPA frameworks such as ReactJS. This fixes "AccessDenied" errors during navigation. 

*Amplify Console -> App settings -> Rewrites and redirects*

Add the following rule:

* Source address: 
```</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>```
* Target address: ```/index.html```
* Type: ```200 (Rewrite)```

See: 
["Redirects for Single Page Web Apps (SPA)"](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) 
in the Amplify docs.


## 6. Add storage. 

1. add storage
```
amplify add storage
amplify push
```

2. implement *src/components/Upload.js*

Uploads will now appear in the S3 bucket.
