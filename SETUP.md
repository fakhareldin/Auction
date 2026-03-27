# دليل التثبيت والتشغيل - Haraj Marketplace

## ✅ ما تم إنجازه حتى الآن

تم إنشاء البنية الكاملة للمشروع:

### 📦 Shared Package
- ✅ جميع الأنواع المشتركة (Types)
- ✅ الثوابت (المدن السعودية والفئات)
- ✅ Validation schemas

### 🔧 Backend Package (كامل)
- ✅ Express + TypeScript setup
- ✅ Prisma Schema (8 جداول رئيسية)
- ✅ قاعدة البيانات PostgreSQL
- ✅ Redis للتخزين المؤقت
- ✅ نظام المصادقة الكامل (JWT + Refresh Tokens)
- ✅ Auth Endpoints (register, login, logout, refresh)
- ✅ Middlewares (auth, error handling, validation, rate limiting)
- ✅ Docker Compose (PostgreSQL + Redis)

---

## 🚀 خطوات التشغيل

### 1️⃣ تثبيت pnpm

```bash
# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# أو باستخدام npm (قد تحتاج sudo)
sudo npm install -g pnpm

# تحقق من التثبيت
pnpm --version
```

### 2️⃣ تثبيت المكتبات

```bash
# من المجلد الرئيسي
pnpm install
```

### 3️⃣ تشغيل PostgreSQL و Redis

```bash
# تأكد أن Docker مثبت ومشغل
docker --version

# شغل قاعدة البيانات
pnpm docker:up

# للتحقق من أن الـ containers شغالة
docker ps
```

### 4️⃣ إعداد ملفات البيئة (.env)

الملف موجود بالفعل في `packages/backend/.env` - تحقق من القيم التالية:

**ملحوظة هامة:** لتشغيل المشروع بسرعة، يمكنك استخدام القيم الافتراضية الموجودة في `.env` ما عدا **Cloudinary** (اتركه كما هو مؤقتاً، ستحتاجه لاحقاً عند رفع الصور).

```bash
# معلومات قاعدة البيانات (تطابق docker-compose.yml)
DATABASE_URL=postgresql://haraj_user:haraj_password@localhost:5432/haraj_db

# Redis (افتراضي)
REDIS_URL=redis://localhost:6379

# JWT Secrets - مهم: غيّر هذه القيم في الإنتاج!
JWT_ACCESS_SECRET=super-secret-access-key-please-change-in-production-min-32-chars
JWT_REFRESH_SECRET=super-secret-refresh-key-please-change-in-production-min-32-chars
```

### 5️⃣ إنشاء قاعدة البيانات وإدخال البيانات الأولية

```bash
# إنشاء الجداول (migrations)
pnpm db:migrate

# إدخال الفئات الأولية (seed)
pnpm db:seed
```

### 6️⃣ تشغيل Backend Server

```bash
# تشغيل Backend في وضع التطوير
pnpm dev:backend

# يجب أن ترى:
# ✅ Redis connected successfully
# ✅ Cloudinary configured successfully
# 🚀 Server is running!
# 📡 Environment: development
# 🌐 Server URL: http://localhost:5000
```

### 7️⃣ اختبار API

افتح المتصفح أو استخدم Postman/Thunder Client:

```
GET http://localhost:5000/
GET http://localhost:5000/api/v1/health
```

---

## 🧪 اختبار نظام المصادقة

### 1. تسجيل مستخدم جديد

```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@1234",
  "firstName": "أحمد",
  "lastName": "محمد",
  "city": "الرياض",
  "phoneNumber": "0501234567"
}
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid...",
      "email": "test@example.com",
      "firstName": "أحمد",
      "lastName": "محمد",
      "city": "الرياض",
      "role": "USER",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

### 2. تسجيل الدخول

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@1234"
}
```

### 3. الحصول على معلومات المستخدم الحالي

```bash
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer <accessToken>
```

### 4. تجديد الـ Token

```bash
POST http://localhost:5000/api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<your-refresh-token>"
}
```

### 5. تسجيل الخروج

```bash
POST http://localhost:5000/api/v1/auth/logout
Content-Type: application/json

{
  "refreshToken": "<your-refresh-token>"
}
```

---

## 📊 استعراض قاعدة البيانات

لفتح Prisma Studio لاستعراض البيانات:

```bash
pnpm db:studio
```

سيفتح على `http://localhost:5555`

---

## 🛠️ أوامر مفيدة

```bash
# تشغيل Backend فقط
pnpm dev:backend

# تشغيل Frontend فقط (عندما ننشئه)
pnpm dev:frontend

# تشغيل الاثنين معاً
pnpm dev

# بناء المشروع للإنتاج
pnpm build

# إيقاف Docker containers
pnpm docker:down

# تشغيل Docker containers
pnpm docker:up

# عرض logs قاعدة البيانات
docker logs haraj-postgres

# عرض logs Redis
docker logs haraj-redis
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: pnpm: command not found
```bash
# ثبت pnpm عن طريق npm
sudo npm install -g pnpm
```

### المشكلة: Docker containers لا تعمل
```bash
# تأكد أن Docker مشغل
docker ps

# أعد تشغيل containers
pnpm docker:down
pnpm docker:up
```

### المشكلة: Prisma migration fails
```bash
# امسح قاعدة البيانات وأعد إنشائها
pnpm docker:down
pnpm docker:up
sleep 5  # انتظر حتى تبدأ قاعدة البيانات
pnpm db:migrate
pnpm db:seed
```

### المشكلة: Port 5000 مستخدم
```bash
# غيّر PORT في .env
PORT=5001
```

---

## 📁 هيكل المشروع

```
H/
├── packages/
│   ├── shared/                 # ✅ جاهز
│   │   ├── src/
│   │   │   ├── types/         # جميع الأنواع المشتركة
│   │   │   └── constants/     # المدن والفئات
│   │   └── package.json
│   │
│   ├── backend/                # ✅ جاهز
│   │   ├── src/
│   │   │   ├── config/        # Database, Redis, Cloudinary, Env
│   │   │   ├── middlewares/   # Auth, Error, Validation, Rate Limit
│   │   │   ├── services/      # Auth Service
│   │   │   ├── controllers/   # Auth Controller
│   │   │   ├── routes/        # Auth Routes
│   │   │   ├── utils/         # JWT, Bcrypt, Pagination
│   │   │   ├── app.ts         # Express app setup
│   │   │   └── server.ts      # Server entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── seed.ts        # Seed data
│   │   ├── .env               # Environment variables
│   │   └── package.json
│   │
│   └── frontend/               # ⏳ القادم
│
├── docker-compose.yml          # ✅ PostgreSQL + Redis
├── package.json                # ✅ Root workspace
├── pnpm-workspace.yaml         # ✅ Workspace config
└── README.md                   # ✅ Documentation
```

---

## 🎯 الخطوات القادمة

1. ✅ **Backend جاهز تماماً!** - يمكنك البدء في استخدام API الآن
2. ⏳ **Frontend** - سنبدأ في إنشائه بعد أن نتأكد أن Backend يعمل
3. ⏳ **Listings API** - سنضيف endpoints الإعلانات
4. ⏳ **Messaging System** - نظام المراسلة الفورية
5. ⏳ **Deployment** - النشر على الإنتاج

---

## ❓ هل أكمل Frontend الآن؟

بمجرد أن تتأكد أن Backend يعمل بشكل صحيح، يمكننا البدء في Frontend:
- React + Vite + TypeScript
- Material-UI (دعم RTL للعربية)
- Redux Toolkit + React Query
- i18next (عربي/إنجليزي)
- صفحات Login & Register

أخبرني عندما تكون مستعداً! 🚀
