# AuthenticationServerNodeJS #

A ready to use authentication server using NodeJS written in TypeScript.

It provides all necessary REST APIs and server rendered pages for user account authentication and basic user managements.
This server can be used as your application authentication server.

### Sample App Link ###


### Technologies Used ###

* TypeScript
* NodeJS
* Express
* MongoDB
* Mongoose
* JWT (Json Web Token)
* Passport JS
* EJS
* AWS SES
* Google OAuth2 API
* Facebook OAuth2 API

### How to deploy ###

Will be added later

### Authentication REST APIs ###

1. `POST /signup`
2. `POST /login`
3. `POST /login/google`
4. `POST /login/facebook`
5. `GET /auth/google/callback`
6. `GET /auth/facebook/callback`
7. `POST /token`
8. `POST /confirmEmail`
9. `POST /sendResetPasswordEmail`
10. `POST /resetPassword`
11. `POST /changePassword`
12. `POST /activateAccount`
13. `POST /deactivateAccount`
14. `POST /deleteAccount`
15. `GET /profile`  - Deprecated
16. `GET /roles`
17. `GET /permissions`
18. `GET /user/:userId`
19. `PUT /user/:userId`
20. `DELETE /user/:userId`
21. `GET /user/:userId/profilePictures`
22. `GET /user/:userId/coverPictures`
23. `GET /user/:userId/loginSessions`
24. `GET /users`
25. `POST /uploadRequest`
26. `POST /uploadSuccess`
---


**1. ENDPOINT:** `/signup`

* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```
{
    email: The email for the user to create.
    password: The password for the user to create.
    firstName: First name of the user to create.
    middleName: First name of the user to create.
    lastName: First name of the user to create.
}
```
* Response Payload:
```
{
    idToken: An Auth ID token for the newly created user.
    email: The email for the newly created user.
    refreshToken: An Auth refresh token for the newly created user.
    expiresIn: The number of seconds in which the ID token expires.
    localId: The uid of the newly created user.
}
```
* Common Errors:
```
1. 422 - errorMessage: 'User already exist with this email'
2. 500 - errorMessage: 'Internal server error'
```
---


**2. ENDPOINT:** `/login`

* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```
{
    email: The email the user is signing in with.
    password: The password for the account.
}
```
* Response Payload:
```
{
    idToken: An Auth ID token for the newly created user.
    email: The email for the newly created user.
    refreshToken: An Auth refresh token for the newly created user.
    expiresIn: The number of seconds in which the ID token expires.
    localId: The uid of the newly created user.
}
```
* Common Errors:
```
1. 401 - errorMessage: 'Incorrect password'
2. 422 - errorMessage: [Any message]
2. 500 - errorMessage: 'Internal server error'
```
---


**3. ENDPOINT:** `/login/google`

* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```
{
    appReturnUrl: Return URL of application after successful login
}
```
* Response Payload:
```
N/A
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**4. ENDPOINT:** `/login/facebook`
* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```
{
    appReturnUrl: Return URL of application after successful login
}
```
* Response Payload:
```
N/A
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**5. ENDPOINT:** `/auth/google/callback`

* Method: `GET`
* Content-Type: `application/json`
* Request Query Parameters:
```
Request query parameters will be provided Google
```
* Response Payload:
```
N/A. Redirect to application return URL after successful login
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**6. ENDPOINT:** `/auth/facebook/callback`

* Method: `GET`
* Content-Type: `application/json`
* Request Query Parameters:
```
Request query parameters will be provided Facebook
```
* Response Payload:
```
N/A. Redirect to application return URL after successful login
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**7. ENDPOINT:** `/token`

* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```

```
* Response Payload:
```

```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**8. ENDPOINT:** `/confirmEmail`

* Method: `GET`
* Content-Type: `application/json`
* Request Body Payload:
```

```
* Response Payload:
```

```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**9. ENDPOINT:** `/sendResetPasswordEmail`

* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```
{
    email: The email of the account.
}
```
* Response Payload:
```
{
    email: The email of the account.
}
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**10. ENDPOINT:** `/resetPassword`

* Method: `POST`
* Content-Type: `application/json`
* Request Body Payload:
```
{
    email: The email of the account.
    recoveryHash: The recovery hash sent to the user's email for resetting the password.
    newPassword: The user's new password.
}
```
* Response Payload:
```
{
    email: The email of the account.
}
```
* Common Errors:
```
1. 422 - errorMessage: 'User doesn't exist with this email'
2. 400 - errorMessage: 'Bad request'
3. 500 - errorMessage: 'Internal server error'
```
---


**11. ENDPOINT:** `/changePassword`

* Method: `POST`
* Content-Type: `application/json`
* Header Payload:
```
{
    Authorization: Bearer JWT Token
}
```
* Request Body Payload:
```
{
    newPassword: The user's new password.
}
```
* Response Payload:
```
{
    idToken: An Auth ID token for the newly created user.
    email: The email for the newly created user.
    refreshToken: An Auth refresh token for the newly created user.
    expiresIn: The number of seconds in which the ID token expires.
    localId: The uid of the newly created user.
}
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---


**12. ENDPOINT:** `/activateAccount`

* Method: `GET`
* Content-Type: `application/json`
* Request Query Parameters:
```
{
    email: The email of the account.
    activationHash: Account activation hash code.
    appReturnUrl: Return URL of application after successful activation.
}
```
* Response Payload:
```
N/A. Redirect to URL of application after successful activation.
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**13. ENDPOINT:** `/deactivateAccount`

* Method: `GET`
* Content-Type: `application/json`
* Request Query Parameters:
```
{
    email: The email of the account.
    activationHash: Account activation hash code.
    appReturnUrl: Return URL of application after successful activation.
}
```
* Response Payload:
```
N/A. Redirect to URL of application after successful activation.
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad Request'
2. 500 - errorMessage: 'Internal server error'
```
---


**14. ENDPOINT:** `/deleteAccount`

* Method: `POST`
* Content-Type: `application/json`
* Header Payload:
```
{
    Authorization: Bearer JWT Token
}
```
* Request Body Payload:
```
{
    newPassword: The user's new password.
}
```
* Response Payload:
```
Empty. Check only http status code
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---


**15. ENDPOINT:** `/profile`

* Method: `POST`
* Content-Type: `application/json`
* Header Payload:
```
{
    Authorization: Bearer JWT Token
}
```
* Request Body Payload:
```
Empty
```
* Response Payload:
```
{
    localId:
    email:
    firstName:
    middleName:
    lastName:
    displayName: 
    photoUrl:
}
```
* Common Errors:
```
1. 400 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---


**16. ENDPOINT:** `/roles`

* Method: `GET`
* Content-Type: `application/json`
* Header Payload:
```
{
    Authorization: Bearer JWT Token
}
```
* Request Query Payload:
```

```
* Response Payload:
```json
[
    {
        "name": "USER",
        "code": 1001,
        "permissions": [
            "read:user:",
            "write:user:own",
            "delete:user:own",
            "activate:user:own",
            "deactivate:user:own"
        ]
    },
    {
        "name": "MODERATOR",
        "code": 1002,
        "permissions": [
            "read:user:any",
            "write:user:any",
            "delete:user:any",
            "activate:user:any",
            "deactivate:user:any"
        ]
    },
    {
        "name": "ADMIN",
        "code": 1003,
        "permissions": [
            "read:user:any",
            "write:user:any",
            "delete:user:any",
            "activate:user:any",
            "deactivate:user:any",
            "read:role:any",
            "write:role:any",
            "delete:role:any",
            "read:permission:any",
            "write:permission:any",
            "delete:permission:any"
        ]
    }
]
```
* Common Errors:
```
1. 422 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---


**16. ENDPOINT:** `/permissions`

* Method: `GET`
* Content-Type: `application/json`
* Header Payload:

```
{
    Authorization: Bearer JWT Token
}
```
* Request Query Payload:
```
N/A
```
* Response Payload:
```
Same as /roles
```

* Common Errors:
```
1. 422 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---


**18. ENDPOINT:** `/user/:userId`

* Method: `GET`
* Content-Type: `application/json`
* Header Payload:
```
{
    Authorization: Bearer JWT Token
}
```
* Request Query Payload:
```
userId
```
* Response Payload:
```
User Info Object
```
* Common Errors:
```
1. 422 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---



**19. ENDPOINT:** `/users`

* Method: `GET`
* Content-Type: `application/json`
* Header Payload:
```
{
    Authorization: Bearer JWT Token
}
```
* Request Query Payload:
```
sortBy, orderBy, after, before, limit
```
* Response Payload:
```
{

}
```
* Common Errors:
```
1. 422 - errorMessage: 'Bad request'
2. 500 - errorMessage: 'Internal server error'
```
---


