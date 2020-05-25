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

select:
> *Managed hosting with custom domains, Continuous deployment*
>  -> *Manual deployment*

```
amplify publish
```

The hosted website should now be online.

## 5. Scale the app with navigation.

1. Install react bootstrap and router
```
npm install react-router-dom
npm install react-bootstrap bootstrap
```

2. Refactor app, add components.

## 6. Add storage. (do this later, after app navigation)

1. add storage
```
amplify add storage
```

