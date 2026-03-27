import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      common: {
        appName: 'حراج',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        logout: 'تسجيل الخروج',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        city: 'المدينة',
        phoneNumber: 'رقم الجوال',
      },
      auth: {
        welcomeBack: 'مرحباً بعودتك',
        createAccount: 'إنشاء حساب جديد',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        passwordPlaceholder: 'أدخل كلمة المرور',
        firstNamePlaceholder: 'أدخل اسمك الأول',
        lastNamePlaceholder: 'أدخل اسم العائلة',
        phonePlaceholder: '05xxxxxxxx',
        selectCity: 'اختر المدينة',
        loginButton: 'تسجيل الدخول',
        registerButton: 'إنشاء الحساب',
        haveAccount: 'لديك حساب بالفعل؟',
        noAccount: 'ليس لديك حساب؟',
        loginHere: 'سجل دخول هنا',
        registerHere: 'أنشئ حساب هنا',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'البريد الإلكتروني غير صحيح',
        passwordRequired: 'كلمة المرور مطلوبة',
        passwordMinLength: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        passwordRequirements: 'يجب أن تحتوي على حرف كبير وحرف صغير ورقم',
        firstNameRequired: 'الاسم الأول مطلوب',
        lastNameRequired: 'اسم العائلة مطلوب',
        cityRequired: 'المدينة مطلوبة',
      },
    },
  },
  en: {
    translation: {
      common: {
        appName: 'Haraj',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        city: 'City',
        phoneNumber: 'Phone Number',
      },
      auth: {
        welcomeBack: 'Welcome Back',
        createAccount: 'Create New Account',
        loginButton: 'Login',
        registerButton: 'Create Account',
        haveAccount: 'Already have an account?',
        noAccount: "Don't have an account?",
        loginHere: 'Login here',
        registerHere: 'Register here',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 8 characters',
        passwordRequirements: 'Must contain uppercase, lowercase, and number',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        cityRequired: 'City is required',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
