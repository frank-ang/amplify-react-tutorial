# My Notes

This project is from amplify getting started React tutorial
https://docs.amplify.aws/start/q/integration/react

## 1. setup project

1. create React project
```
npx create-react-app amplify02
cd amplify02
npm start
```
2. init Amplify backend.
```
amplify init
```
3. setup frontend

Install Amplify libraries 
```
npm install aws-amplify @aws-amplify/ui-react
```

Edit *src/index.js*, add amplify libraries.

## 2. Add GraphQL API

1. Add API for GraphQL. Follow the prompts. Push to backend.
```
amplify add api
amplify push
amplify status
```

2. local mock testing
```
amplify mock api
```

3. Edit App.js to connect frontend to API
Edit *App.js* (see tutorial for code)
```npm start```
New tasks created from local will appear in DynamoDB!

## 3. Add Authentication

1. Add Auth.
```
amplify add auth
amplify push
```

2. Create login UI
Edit *src/App.js* (see tutorial)
```npm start```
create new user (check spam folder for auth code from verificationemail.com)

## 4. Deploy and host app

1. Add Hosting.
```
amplify add hosting
```



# Auto generated notes below
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

