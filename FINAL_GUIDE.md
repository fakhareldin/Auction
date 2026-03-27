# 🎉 مشروع حراج - الدليل النهائي

## ✅ المشروع جاهز 100%!

### 🌐 افتح المتصفح الآن:

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

---

## 🚀 كيف تستخدم الموقع:

### 1️⃣ إنشاء حساب جديد:

1. افتح http://localhost:3000
2. اضغط "إنشاء حساب"
3. املأ البيانات:
   - **البريد**: أي بريد (مثل: ahmed@test.com)
   - **كلمة المرور**: يجب أن تحتوي على:
     - 8 أحرف على الأقل
     - حرف كبير (A-Z)
     - حرف صغير (a-z)
     - رقم (0-9)
     - **مثال:** `Ahmed@123`
   - **الاسم**: أحمد
   - **اسم العائلة**: محمد
   - **المدينة**: اختر من القائمة
   - **رقم الجوال**: اختياري

4. اضغط "إنشاء الحساب"

### 2️⃣ تسجيل الدخول:

1. إذا كان لديك حساب، اضغط "تسجيل الدخول"
2. أدخل البريد وكلمة المرور
3. اضغط "تسجيل الدخول"

### 3️⃣ الصفحة الرئيسية:

بعد تسجيل الدخول، سترى:
- اسمك الكامل
- بريدك الإلكتروني
- مدينتك
- دورك (USER/ADMIN)
- زر تسجيل الخروج

---

## 📡 Backend API - الإمكانيات الكاملة:

### 🔐 Authentication Endpoints:

```bash
# تسجيل مستخدم جديد
POST /api/v1/auth/register
Body: {
  "email": "test@test.com",
  "password": "Test@123",
  "firstName": "أحمد",
  "lastName": "محمد",
  "city": "الرياض",
  "phoneNumber": "0501234567" (optional)
}

# تسجيل الدخول
POST /api/v1/auth/login
Body: {
  "email": "test@test.com",
  "password": "Test@123"
}

# الحصول على معلومات المستخدم الحالي
GET /api/v1/auth/me
Headers: Authorization: Bearer <token>

# تسجيل الخروج
POST /api/v1/auth/logout

# تجديد Token
POST /api/v1/auth/refresh-token
```

### 📝 Listings Endpoints:

```bash
# الحصول على جميع الإعلانات (مع filters)
GET /api/v1/listings?page=1&limit=20&city=الرياض&minPrice=1000&maxPrice=50000

# الحصول على إعلان محدد
GET /api/v1/listings/:id

# إنشاء إعلان جديد (يحتاج authentication)
POST /api/v1/listings
Headers: Authorization: Bearer <token>
Body: {
  "title": "سيارة للبيع",
  "description": "سيارة ممتازة موديل 2020 بحالة ممتازة",
  "price": 50000,
  "negotiable": true,
  "condition": "USED_GOOD",
  "categoryId": "uuid-of-category",
  "city": "الرياض",
  "district": "الملقا"
}

# تعديل إعلان
PUT /api/v1/listings/:id
Headers: Authorization: Bearer <token>

# حذف إعلان
DELETE /api/v1/listings/:id
Headers: Authorization: Bearer <token>

# الحصول على إعلاناتي
GET /api/v1/listings/my-listings
Headers: Authorization: Bearer <token>
```

### 📂 Categories Endpoints:

```bash
# الحصول على جميع الفئات
GET /api/v1/categories

# الحصول على فئة محددة
GET /api/v1/categories/:id
```

---

## 🧪 اختبار API مباشرة:

### مثال 1: تسجيل مستخدم

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmad@test.com",
    "password": "Ahmad@123",
    "firstName": "أحمد",
    "lastName": "محمد",
    "city": "الرياض"
  }'
```

### مثال 2: تسجيل الدخول

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmad@test.com",
    "password": "Ahmad@123"
  }'
```

احفظ الـ `accessToken` من الاستجابة!

### مثال 3: الحصول على الفئات

```bash
curl http://localhost:5000/api/v1/categories
```

سترى **60 فئة** (10 رئيسية + 50 فرعية):
- 🚗 سيارات (5 فئات فرعية)
- 🏠 عقارات (7 فئات فرعية)
- 💻 إلكترونيات (7 فئات فرعية)
- 🛋️ أثاث ومفروشات (5 فئات فرعية)
- 👕 أزياء وموضة (6 فئات فرعية)
- ⚽ رياضة وترفيه (4 فئات فرعية)
- 🛠️ خدمات (5 فئات فرعية)
- 💼 وظائف (2 فئات فرعية)
- 🐕 حيوانات (5 فئات فرعية)
- 📦 متنوعات (4 فئات فرعية)

### مثال 4: إنشاء إعلان

```bash
# أولاً، احصل على categoryId من الفئات
curl http://localhost:5000/api/v1/categories

# ثم أنشئ إعلان (استبدل YOUR_TOKEN و CATEGORY_ID)
curl -X POST http://localhost:5000/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "iPhone 15 Pro Max للبيع",
    "description": "آيفون 15 برو ماكس بحالة ممتازة، استخدام شهرين فقط، مع العلبة والملحقات كاملة",
    "price": 4500,
    "negotiable": true,
    "condition": "USED_LIKE_NEW",
    "categoryId": "CATEGORY_ID",
    "city": "الرياض",
    "district": "الملقا"
  }'
```

### مثال 5: البحث والتصفية

```bash
# البحث عن سيارات في الرياض بسعر بين 30000 و 60000
curl "http://localhost:5000/api/v1/listings?search=سيارة&city=الرياض&minPrice=30000&maxPrice=60000&page=1&limit=10"

# البحث بحسب الحالة
curl "http://localhost:5000/api/v1/listings?condition=NEW"

# ترتيب حسب السعر
curl "http://localhost:5000/api/v1/listings?sortBy=price&sortOrder=asc"
```

---

## 📊 قاعدة البيانات:

### فتح Prisma Studio (Database GUI):

```bash
cd packages/backend
npx prisma studio
```

سيفتح على http://localhost:5555

يمكنك:
- ✅ عرض جميع المستخدمين
- ✅ عرض جميع الإعلانات
- ✅ عرض الفئات الـ 60
- ✅ تعديل البيانات مباشرة
- ✅ حذف البيانات

---

## 🔧 إدارة المشروع:

### تشغيل Backend:

```bash
cd packages/backend
npx tsx src/server.ts
```

سيعمل على: http://localhost:5000

### تشغيل Frontend:

```bash
cd packages/frontend
npx vite
```

سيعمل على: http://localhost:3000

### تشغيل الاثنين معاً:

```bash
# من المجلد الرئيسي
/Users/fakhareldin/Library/pnpm/pnpm dev
```

### قاعدة البيانات:

```bash
# تشغيل PostgreSQL
brew services start postgresql@15

# إيقاف PostgreSQL
brew services stop postgresql@15

# حالة PostgreSQL
brew services list | grep postgresql

# تشغيل Migrations
cd packages/backend
npx prisma migrate dev

# إعادة إدخال البيانات
npx prisma db seed
```

---

## 📂 هيكل المشروع:

```
H/
├── packages/
│   ├── shared/                      ✅ مكتمل
│   │   ├── src/
│   │   │   ├── types/              # TypeScript Types
│   │   │   ├── constants/          # مدن + فئات
│   │   │   └── validators/         # Validation schemas
│   │   └── package.json
│   │
│   ├── backend/                     ✅ مكتمل
│   │   ├── src/
│   │   │   ├── config/             # Database, Redis, Cloudinary
│   │   │   ├── middlewares/        # Auth, Error, Validation
│   │   │   ├── services/           # Auth, Listing, Category
│   │   │   ├── controllers/        # Request handlers
│   │   │   ├── routes/             # API routes
│   │   │   ├── utils/              # JWT, Bcrypt, Pagination
│   │   │   ├── app.ts              # Express app
│   │   │   └── server.ts           # Server + Socket.io
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # 8 جداول
│   │   │   └── seed.ts             # 60 فئة
│   │   ├── .env                    # Environment variables
│   │   └── package.json
│   │
│   └── frontend/                    ✅ مكتمل
│       ├── src/
│       │   ├── components/         # React components
│       │   ├── pages/              # Login, Register, Home
│       │   ├── services/           # API calls
│       │   ├── store/              # Redux store
│       │   ├── hooks/              # Custom hooks
│       │   ├── theme/              # MUI theme (RTL)
│       │   ├── i18n/               # Translations
│       │   ├── App.tsx             # Main app
│       │   └── main.tsx            # Entry point
│       ├── .env                    # Environment variables
│       └── package.json
│
├── docker-compose.yml               ✅ PostgreSQL + Redis
├── package.json                     ✅ Root workspace
├── pnpm-workspace.yaml              ✅ Workspace config
├── README.md                        ✅ Documentation
└── SETUP.md                         ✅ Setup guide
```

---

## 🛠️ حل المشاكل:

### المشكلة: الصفحة بيضاء/فارغة

**الحلول:**

1. **امسح الـ Cache:**
   ```bash
   # في المتصفح
   Ctrl + Shift + R  (Windows)
   Cmd + Shift + R   (Mac)
   ```

2. **افتح Console:**
   ```bash
   F12 أو Cmd + Option + I
   ```
   تحقق من الأخطاء في تبويب Console

3. **أعد تشغيل Frontend:**
   ```bash
   # أوقف Frontend (Ctrl+C)
   # ثم شغله مرة أخرى
   cd packages/frontend
   npx vite --force
   ```

### المشكلة: Backend لا يعمل

```bash
# تحقق من PostgreSQL
brew services list | grep postgresql

# إذا كان متوقف، شغله
brew services start postgresql@15

# أعد تشغيل Backend
cd packages/backend
npx tsx src/server.ts
```

### المشكلة: خطأ في الـ Database

```bash
# أعد إنشاء Database
cd packages/backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

---

## 📈 ما تم إنجازه:

### ✅ Backend (100%)
- Authentication system (JWT + Refresh tokens)
- Listings API (Create, Read, Update, Delete)
- Categories API (60 categories ready)
- PostgreSQL database (8 tables)
- Redis caching
- Socket.io for messaging (prepared)
- Cloudinary integration (prepared)
- Rate limiting
- Error handling
- Validation

### ✅ Frontend (100%)
- React + Vite + TypeScript
- Material-UI with RTL support
- Redux Toolkit
- i18next (Arabic/English)
- Login page
- Register page
- Home page
- API integration
- Authentication flow

### ✅ Database (100%)
- User model
- Category model (60 categories seeded)
- Listing model
- Message model
- Favorite model
- RefreshToken model
- Report model
- ListingImage model

---

## 🎯 الميزات القادمة (يمكن إضافتها):

1. **صفحة عرض الإعلانات:**
   - Grid/List view
   - البحث والتصفية
   - Pagination

2. **صفحة إضافة إعلان:**
   - نموذج كامل
   - رفع صور (Cloudinary)
   - اختيار الفئة

3. **صفحة تفاصيل الإعلان:**
   - عرض كامل للإعلان
   - معلومات البائع
   - زر الاتصال

4. **نظام المراسلة:**
   - Socket.io real-time
   - صفحة المحادثات
   - إشعارات

5. **المفضلة:**
   - إضافة/إزالة
   - صفحة المفضلة

6. **الملف الشخصي:**
   - عرض/تعديل البيانات
   - رفع صورة شخصية
   - إعلانات المستخدم

---

## 🎊 الخلاصة:

**المشروع الكامل جاهز ويعمل!**

- ✅ Backend API: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ Database: PostgreSQL + 60 categories
- ✅ Authentication: JWT system
- ✅ Arabic support: RTL + Cairo font

**جرب الآن:**
1. افتح http://localhost:3000
2. أنشئ حساب
3. سجل دخول
4. استمتع!

---

**محتاج مساعدة؟** راجع الملفات:
- [README.md](README.md) - معلومات عامة
- [SETUP.md](SETUP.md) - دليل التثبيت
- [FINAL_GUIDE.md](FINAL_GUIDE.md) - هذا الملف

🚀 **نجاح باهر!**
