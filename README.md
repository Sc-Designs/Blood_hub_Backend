# 📌 Blood_Hub API Documentation

## Project Overview
Blood_Hub is a platform that connects blood donors with recipients. This API allows users to register, login, and manage their profiles. It also includes admin functionalities and Google authentication.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Passport.js (for Google Authentication)
- bcrypt (for password hashing)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Blood_Hub.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Blood_Hub
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints 🏗️
<br>

## 1. **_REGISTER A NEW USER IN OUR SYSTEM WITH THIS API_** 🪧
#### 📫POST 🙎🏽‍♀️ `/user/register` 🙎🏽‍♂️

**Request Body:**

`Required Field`

| ***Field*** | 🚦***Rules*** 🚦 |
|-------|--------|
| **Name** | - Required |
| **Email** | - Required<br>- Valid email format<br>- Must be unique |
| **Password** | - Required<br>- Minimum 8 characters<br>- At least one uppercase letter<br>- At least one lowercase letter<br>- At least one number<br>- At least one special character |

<br><br>

# LIKE This object ✅

```js
  name: "John Doe",
  email: "user@example.com",
  password: "StrongPass123!"
```
<br>

## Response Code
```diff
+ Response Code Success Response (201) ✅
- Response Code Error Response (500) ❌
```
<br><br>

# ***Sending OTP in Mail***

`We Send OTP in Mail`

After OTP verification, the data will be saved in the Database. 

<br><br>

#  MONGOOSE SAVED DATA 📑

```js
    userId: mongoose.Schema.Types.ObjectId,  // mongoose object id
    email: String,  // string containing email
    name: String,  // string containing name
    password: String  // hashed password
```
<br>

## ***Validation Rules***
- **`Fullname`**: 
  - Required
  - Alphanumeric characters and no underscores

- **`Email`**:
  - Required
  - Must be a valid email format
  - Must be unique
- **`Password`**:
  - Required
  - Minimum 8 characters
  - Maximum 25 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character
---
<br><br>

## 2. **_LOGIN THE USER IN OUR SYSTEM WITH THIS API_** 🪧
<br>

#### 📫POST 🙎🏽‍♀️ `/user/login` 🙎🏽‍♂️

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|Email| String("example@example.com") |
|Password| String|

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (406) ❌
```

## Sending Things in Frontend 

- User Token: String (In Cookie section with hashed format) 

<br>
<br>
<br>

## 3. **_USER PROFILE_** 🪧

#### 📫 GET `/user/profile`

> ## _Token in Cookie Section_

- **Available**
  - User Redirected to his/her profile.
- **Not Available** 
  - User Redirected to the login Page!
- **If Not Match**
  - User Redirected to the login Page!
## Response Code
```diff
+ if the User profile found (302) ✅
- if the User profile Not found (404) ❌
```

<br>

## 4. **_REGISTER A NEW ADMIN IN OUR SYSTEM WITH THIS API_** 🪧

<br>

> ##  **This is only used in Development Phase** 

#### 📫POST 👦🏽 `/admin/register` 👦🏽

**Request Body:**

`Required Field`

|***Field***|***Rules***|
|-----|-----|
|**Fullname**| - Object<br>- FirstName<br>- MiddleName<br>- LastName |
|**Email**|- String<br>- Must be verified email|
|**Password**|- String<br>- Minimum 08 and Maximum 25|

## Response Code
```diff
+ if Admin register Successfully (201) ✅
- if Admin register Not Successfully (500) ❌
```
<br><br>

## 5. **_LOGIN THE ADMIN IN OUR SYSTEM WITH THIS API_** 🪧

#### 📫POST 👦🏽 `/admin/login` 👦🏽

**Request Body:**

`Required Field`

|***Field***|***Rules***|
|-----|-----|
|**Email**|- String("example@example.com")|
|**Password**|- String|

## Response Code
```diff
+ if Admin Successfully Login (200) ✅
- if Admin Not Successfully Login (406) ❌
```
<br>

## 6. **_ADMIN PROFILE_** 🪧

#### 📫 GET `/admin/admin-profile`

> ## _adminToken in Cookie Section_

- **Available**
  - User Redirected to his/her profile.
- **Not Available** 
  - User Redirected to the login Page!
- **If Not Match**
  - User Redirected to the login Page!

## Response Code
```diff
+ if the Admin profile found (302) ✅
- if the Admin profile Not found (404) ❌
```
<br>
<br>

## 7. **_GOOGLE AUTHENTICATION ROUTE_** 🪧

### Authentication Route

#### 📫 GET `/google-auth/auth/google`

---

### This is Callback URL for Google

#### 📫 GET `/google-auth/auth/google/callback`

```javascript
  {
    Scope: ["Profile", "Email"]
  }
```
### Success Route And Failure Route

```diff
+ /users/profile ✅
- /users/login ❌
```
---
<br>

> # 🛑 Important Notice :

### If User does <i><b><u>"Signin with Google"</u></b></i> they will not require the password section, it will be redirected by Google ID.

## 8. **_UPDATE USER PROFILE_** 🪧

#### 📫 PUT `/user/update-profile`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|Name| String |
|Email| String("example@example.com") |
|Password| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 9. **_DELETE USER ACCOUNT_** 🪧

#### 📫 DELETE `/user/delete-account`

**Request Body:**

#### see the token and find the user in database and delete the account 

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 10. **_UPLOAD USER PROFILE PICTURE_** 🪧

#### 📫 POST `/user/picture-upload`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|profilepic| File |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 11. **_OTP VERIFICATION_** 🪧

#### 📫 GET `/user/otp-verification/:id`

**Request Params:**

| ***Field*** | ***Rules*** |
|------|-------|
|id| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 12. **_RESEND OTP_** 🪧

#### 📫 POST `/user/resend-otp`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|email| String("example@example.com") |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 13. **_DELETE BLOOD REQUEST_** 🪧

#### 📫 POST `/user/deletePost`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|postId| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 14. **_ADD BLOOD GROUP_** 🪧

#### 📫 POST `/user/add_blood_group`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|bloodGroup| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (400) ❌
```

## 15. **_HOME PAGE_** 🪧

#### 📫 GET `/`

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (500) ❌
```

## 16. **_MAP PAGE_** 🪧

#### 📫 GET `/maps`

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (500) ❌
```

## 17. **_ERROR PAGE_** 🪧

#### 📫 GET `/:anything`

## Response Code

```diff
+ if Successful then status code (200) ✅
```

## 18. **_SEE ALL BLOOD REQUESTS_** 🪧

#### 📫 GET `/donar/request-list`

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (500) ❌
```

## 19. **_DONATE FORM_** 🪧

#### 📫 GET `/donar/donate_from/:id`

**Request Params:**

| ***Field*** | ***Rules*** |
|------|-------|
|id| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (500) ❌
```

## 20. **_ACCEPT DONATION_** 🪧

#### 📫 POST `/donar/accept`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|requestId| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (500) ❌
```

## 21. **_REQUEST BLOOD_** 🪧

#### 📫 POST `/blood/blood-request`

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|bloodType| String |

## Response Code

```diff
+ if Successful then status code (200) ✅
- if Not Successful then status code (500) ❌
```

## 22. **_ADMIN LOGIN PAGE_** 🪧

#### 📫 GET `/admin/login`

## Response Code

```diff
+ if Successful then status code (200) ✅
```

## Contributors
- [Your Name](https://github.com/yourusername)
- [Contributor Name](https://github.com/contributorusername)

