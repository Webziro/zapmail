# Email to WhatsApp Forwarder - Full Stack Application

Complete web application for managing email-to-WhatsApp forwarding rules with user authentication and dashboard.

## 🚀 Features

- 👤 User authentication (register/login)
- 📧 Multiple email account support per user
- 📱 WhatsApp integration via Twilio
- 🔍 Advanced email filtering (subject, sender, time)
- 📊 Real-time statistics and logs
- ⚙️ Individual rule management (create, edit, delete, toggle)
- 🔐 Encrypted credentials storage
- ⏰ Customizable scheduling per rule
- 🎨 Modern React frontend
- 🔒 JWT-based authentication

## 📋 Prerequisites

1. **Node.js** (v14+)
2. **PostgreSQL** (v12+)
3. **Gmail App Password** ([Generate here](https://myaccount.google.com/apppasswords))
4. **Twilio Account** ([Sign up here](https://www.twilio.com/try-twilio))

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd email-whatsapp-forwarder
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/email_whatsapp_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
WORKER_CRON_SCHEDULE=*/5 * * * *
ENCRYPTION_KEY=your-32-character-encryption-key
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Background Worker:**
```bash
cd backend
npm run worker
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

### Production Mode

**Build Backend:**
```bash
cd backend
npm run build
```

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Run with PM2:**
```bash
# Install PM2
npm install -g pm2

# Start API server
pm2 start dist/server.js --name api

# Start worker
pm2 start dist/worker.js --name worker

# Serve frontend (using a static server)
pm2 start npx --name frontend -- serve -s dist -l 3000

# Save configuration
pm2 save
pm2 startup
```

## 📦 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `createdAt`, `updatedAt`

### ForwardingRules Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → Users)
- `name`
- `isActive` (Boolean)
- Email config: `emailUser`, `emailPassword` (encrypted), `emailHost`, `emailPort`, `emailTls`
- Filters: `filterSubjects[]`, `filterSenders[]`, `filterHours`
- Twilio config: `twilioAccountSid`, `twilioAuthToken` (encrypted), `whatsappSender`, `whatsappRecipient`
- `cronSchedule`
- `createdAt`, `updatedAt`

### ForwardingLogs Table
- `id` (UUID, Primary Key)
- `userId`, `ruleId` (Foreign Keys)
- `emailSubject`, `emailFrom`, `emailDate`
- `status` ('success' | 'failed')
- `error` (nullable)
- `createdAt`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

### Forwarding Rules
- `POST /api/rules` - Create rule (protected)
- `GET /api/rules` - Get all user's rules (protected)
- `GET /api/rules/:id` - Get specific rule (protected)
- `PUT /api/rules/:id` - Update rule (protected)
- `DELETE /api/rules/:id` - Delete rule (protected)
- `PATCH /api/rules/:id/toggle` - Toggle active status (protected)

### Logs
- `GET /api/logs` - Get forwarding logs (protected)
- `GET /api/logs/stats` - Get statistics (protected)
- `DELETE /api/logs` - Clear logs (protected)

## 🔧 Configuration Guide

### Gmail Setup

1. **Enable IMAP:**
   - Gmail Settings → Forwarding and POP/IMAP
   - Enable IMAP

2. **Generate App Password:**
   - Google Account → Security → 2-Step Verification (enable)
   - App Passwords → Generate password
   - Use this 16-character password in the form

### Twilio WhatsApp Setup

1. **Activate Sandbox:**
   - Twilio Console → Messaging → Try it out → WhatsApp
   - Send join message to Twilio number from your WhatsApp

2. **Get Credentials:**
   - Account SID: Dashboard
   - Auth Token: Dashboard (click "Show")
   - Sender: `whatsapp:+14155238886`
   - Recipient: `whatsapp:+[your number with country code]`

### Creating Your First Rule

1. Register/Login
2. Click "New Rule"
3. Fill in all fields:
   - **Name**: "Work Emails"
   - **Email**: your-email@gmail.com
   - **App Password**: 16-char Gmail app password
   - **Filter Subjects**: urgent,important
   - **Filter Senders**: boss@company.com
   - **Twilio SID**: AC...
   - **Twilio Token**: your auth token
   - **WhatsApp Sender**: whatsapp:+14155238886
   - **Your WhatsApp**: whatsapp:+1234567890
4. Click "Save Rule"

The worker will automatically start checking this email account!

## 🚀 Deployment

### Heroku Deployment

**1. Prepare for Deployment:**

Create `Procfile` in root:
```
web: cd backend && npm start
worker: cd backend && node dist/worker.js
```

**2. Deploy:**

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set ENCRYPTION_KEY=your-key
heroku config:set FRONTEND_URL=https://your-app.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Scale dynos
heroku ps:scale web=1 worker=1

# View logs
heroku logs --tail
```

**3. Deploy Frontend:**

Option A - Same Heroku app:
```bash
# Build frontend and serve from backend
cd frontend
npm run build
# Copy dist/ to backend/public/
```

Option B - Separate deployment (Vercel/Netlify):
```bash
cd frontend
npm run build
# Deploy dist/ folder
# Update FRONTEND_URL in backend
```

### AWS Deployment

**1. EC2 Setup:**

```bash
# Launch Ubuntu instance
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql

# Setup PostgreSQL
sudo -u postgres createdb email_whatsapp_db
sudo -u postgres psql -c "CREATE USER dbuser WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE email_whatsapp_db TO dbuser;"
```

**2. Deploy Application:**

```bash
# Clone and setup
git clone <repo>
cd email-whatsapp-forwarder

# Backend
cd backend
npm install
npm run build
npx prisma migrate deploy

# Frontend
cd ../frontend
npm install
npm run build

# Install PM2
sudo npm install -g pm2

# Start services
cd ../backend
pm2 start dist/server.js --name api
pm2 start dist/worker.js --name worker

# Nginx for frontend
sudo apt install nginx
# Configure nginx to serve frontend/dist
```

### Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: email_whatsapp_db
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://dbuser:password@postgres:5432/email_whatsapp_db
      JWT_SECRET: your-secret
      ENCRYPTION_KEY: your-key
    depends_on:
      - postgres

  worker:
    build: ./backend
    command: node dist/worker.js
    environment:
      DATABASE_URL: postgresql://dbuser:password@postgres:5432/email_whatsapp_db
      ENCRYPTION_KEY: your-key
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run: `docker-compose up -d`

## 🔍 Troubleshooting

### Email Connection Issues
- Verify IMAP is enabled
- Check app password (not regular password)
- Ensure less secure apps is enabled (if needed)
- Check firewall settings

### WhatsApp Not Receiving
- Verify Twilio sandbox activation
- Check phone number format: `whatsapp:+[country][number]`
- Ensure you've sent the join message

### Database Connection Failed
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check firewall/security groups

### Worker Not Processing Rules
- Check worker logs: `pm2 logs worker`
- Verify cron schedule format
- Ensure rules are set to "Active"

## 📊 Monitoring

```bash
# View all processes
pm2 list

# View logs
pm2 logs api
pm2 logs worker

# Monitor resources
pm2 monit

# Restart services
pm2 restart api
pm2 restart worker
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Passwords**: Use strong, unique passwords
3. **JWT Secret**: Use a long, random string
4. **Encryption Key**: Generate with `openssl rand -hex 32`
5. **HTTPS**: Always use HTTPS in production
6. **Rate Limiting**: Add rate limiting to API endpoints
7. **Input Validation**: All inputs are validated
8. **SQL Injection**: Prisma provides protection
9. **XSS Protection**: React provides automatic escaping

## 📈 Scaling Considerations

1. **Database**: Use connection pooling
2. **Worker**: Can run multiple instances with different rule batches
3. **Caching**: Add Redis for session management
4. **Load Balancing**: Use nginx for multiple backend instances
5. **Monitoring**: Add Sentry or similar for error tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - free to use for personal or commercial projects.

## 🆘 Support

- Check troubleshooting section
- Review API documentation
- Open GitHub issue
- Check Twilio/Gmail documentation

## 🎉 Acknowledgments

- React + TypeScript
- Express.js
- Prisma ORM
- Twilio API
- node-imap