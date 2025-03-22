# **Backend API for OMPOI**  

## **🚀 Getting Started**  

### **🛠️ Running the Server**  
Start the development server:  
```bash
npm run db:server
```
For Live Drizzle Preview:  
```bash
npm run db:studio
```
For Updating Drizzle Schemas:  
```bash
npm run db:push
```

---

## **📂 Project Structure**  

```
\---src
    |   app.js
    |   server.js
    |
    +---config
    |       db.js
    |
    +---controller
    |   |   merchant.controller.js
    |   |   otp.controller.js
    |   |   payment.controller.js
    |   |   register.controller.js
    |   |
    |   +---admin.controller
    |   |       admin.controller.js
    |   |
    |   +---agent.controller
    |   |       agent_register.controller.js
    |   |
    |   +---auth.controller
    |   |       merchant.auth.controller.js
    |   |
    |   \---buyer.controller
    |           buyer.controller.js
    |           buyerOrders.controller.js
    |           product.controller.js
    |
    +---db
    |       schema.js
    |
    +---middleware
    |       Cloudinary_Upload.js
    |       protectRoute.js
    |
    +---model
    |   |   merchant.model.js
    |   |   payment.model.js
    |   |   register.model.js
    |   |
    |   +---admin.model
    |   |       admin.model.js
    |   |
    |   +---agent.model
    |   |       agentRegister.model.js
    |   |
    |   \---buyer.model
    |           buyer.model.js
    |           product.model.js
    |
    +---routes
    |   |   auth.route.js
    |   |   merchant.route.js
    |   |   otp.route.js
    |   |   payment.route.js
    |   |   register.route.js
    |   |
    |   +---auth.routes
    |   |       admin.route.js
    |   |
    |   +---buyer.routes
    |   |       buyer.route.js
    |   |
    |   \---routers.agent
    |           agent_registration.route.js
    |
    \---utils
            BodyValidation.js
            generateToken.js
```

---

## **🔧 Installation**  
Clone the repository and install dependencies:  
```bash
git clone https://git.selfmade.ninja/karthi582002/backend
cd backend
npm install
```

---

## **🔐 Environment Variables**  
Create a `.env` file in the root directory and add the following fields:

```plaintext
# Database Configuration
DATABASE_URL=

# JWT Secrets
JWT_SECRET=
JWT_AGENT_SECRET=
JWT_MERCHANT_SECRET=
JWT_ADMIN_SECRET=
JWT_BUYER_SECRET=

# Twilio API Keys (For OTP Verification)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_SERVICE_ID=

# Razorpay API Keys
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# SQL Database Credentials
SQL_USERNAME=
SQL_DATABASE=
SQL_PASSWORD=

# Node Environment
NODE_ENV=development

# Cloudinary API Keys
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
```
> **Note:** Obtain these keys from the respective service providers.

---

## **🔗 API Routes**  

### **Authentication - Admin**
- `POST /admin/register` - Register a Master Admin (Access Only For Developers)  
- `POST /admin/login` - Master Admin Login  

### **Admin - Controllers**
- `POST /admin/assign-agent-seller` - Assign an Agent to a Merchant for Background Checks  
- `POST /admin/assign-agent-order` - Assign an Agent to a Specific Order for Background Checks  

### **Authentication - Agent**
- `POST /agent/registration` - Only Master Admin Can Add a New Agent  
- `POST /agent/login` - Agent Login  

### **Agent - Controllers**
- `POST /agent/verify-merchant` - Agent Can Approve the Merchant (Only if Assigned by Admin)  
- `POST /agent/verify-order` - Agent Can Approve the Order (Only if Assigned by Admin)  

### **OTP - Routes**
- `POST /otp` - Send OTP to a Given Number  
- `POST /otp/verify-otp` - Verify the OTP Sent Previously  

---

## **👤 Developed By**  
### **Karthikeyan M**  
*Full Stack Developer | Passionate about Building Scalable Applications*  

Connect with me on:  
- 💼 [LinkedIn](https://www.linkedin.com/in/karthikeyan582002)  
- 📧 [Email](mailto:karthi582002@gmail.com)
- 🌐 [Portfolio](https://karthikeyanm.tech/) 

---

## **📜 License**  
This project is licensed under the **MIT License**.  

---

