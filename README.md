<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PLAMA - Personalized Learning AI Mathematics Assistant

PLAMA คือแอปพลิเคชัน AI Tutor สำหรับสอนคณิตศาสตร์ ที่ปรับเปลี่ยนตามระดับชั้นและหัวข้อที่เรียน พัฒนาด้วย React, TypeScript และ Google Gemini AI

## ✨ คุณสมบัติ

- 🎓 **โหมดติวเตอร์**: AI จะช่วยสอนและอธิบายแนวคิดทีละขั้นตอน
- 📝 **โหมดติวสอบ**: AI จะถามคำถามเพื่อทดสอบความเข้าใจ
- 🌙 **Dark/Light Mode**: รองรับทั้งธีมสว่างและมืด
- 💾 **บันทึกประวัติการแชท**: เก็บประวัติการสนทนาของแต่ละผู้ใช้
- 📥 **ส่งออกประวัติ**: ส่งออกบทสนทนาเป็นไฟล์ JSON
- ➗ **LaTeX/KaTeX Support**: แสดงสมการทางคณิตศาสตร์สวยงาม

## 🚀 การติดตั้งและรันแอปพลิเคชัน

### ข้อกำหนดเบื้องต้น
- Node.js (เวอร์ชัน 18 ขึ้นไป)
- Gemini API Key จาก [Google AI Studio](https://aistudio.google.com/app/apikey)

### ขั้นตอนการติดตั้ง

1. **Clone repository และติดตั้ง dependencies**
   ```bash
   git clone <repository-url>
   cd plama-math-tutor-chat-app
   npm install
   ```

2. **ตั้งค่า Gemini API Key**

   สร้างไฟล์ `.env.local` ในโฟลเดอร์ root และเพิ่ม API key ของคุณ:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   > 💡 **วิธีรับ API Key**: ไปที่ https://aistudio.google.com/app/apikey เพื่อสร้าง API key ฟรี

3. **รันแอปพลิเคชัน**
   ```bash
   npm run dev
   ```

   แอปจะเปิดที่ http://localhost:3000

## 🔑 การ Login

ใช้ username และ password ต่อไปนี้เพื่อทดสอบ:

- **Admin**: username: `admin`, password: `password1234`
- **Demo User**: username: `demo`, password: `password`

## 📦 Build สำหรับ Production

```bash
npm run build
npm run preview
```

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI**: Google Gemini AI (via @google/genai)
- **Styling**: Tailwind CSS (via CDN)
- **Math Rendering**: KaTeX

## 📝 โครงสร้างโปรเจกต์

```
├── components/        # React components
├── contexts/          # React contexts (Auth, Theme, Config)
├── hooks/            # Custom React hooks
├── services/         # API services (Gemini)
├── public/           # Static files
├── App.tsx           # Main app component
├── index.tsx         # Entry point
└── types.ts          # TypeScript types
```

## 🔧 การแก้ไขปัญหา

### แอปไม่ทำงาน?
1. ตรวจสอบว่าติดตั้ง dependencies แล้ว: `npm install`
2. ตรวจสอบว่ามี `.env.local` และใส่ API key ที่ถูกต้อง
3. ตรวจสอบ console เพื่อดู error messages

### Build ไม่ผ่าน?
```bash
# ลองลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is part of Google AI Studio

---

View your app in AI Studio: https://ai.studio/apps/drive/1YJQlruJvB2yQURbhA3cxUXOgxoL4ABCa
