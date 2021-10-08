# Node SSO

One-stop solution for handling a comprehensive number of node SSO

## Prerequisites
1. Client ID and Client Secret key/file from SSO service

## Usage

### 1. Initialize NodeSSO
```js
import NodeSSO from 'NodeSSO';

const ssoType = 'GOOGLE';
const config = {
  clientId: 'XXXXX',
  clientSecret: 'XXXXX',
  redirectURI: 'https://example.com/auth/google'
}

const nodeSSO = new NodeSSO(ssoType, config);
```

### 2. Generate Authorization URL
```js
 const authorizationUrl = nodeSSO.generateAuthorizationUrl(config);
```

### 3. Login
This method will acquire necessary access token from SSO service and fetch user info
```js
 const userInfo = nodeSSO.login(code, config);
  // return
  // {
  //     firstname,
  //     lastname,
  //     email,
  //     picture,
  //     token,
  //     userInfo
  // };
```
