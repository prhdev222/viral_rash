# วิธี Deploy เว็บ สุขภาพดี สมณะมั่นคง

## การเชื่อมระหว่าง menu.html กับ index.html

- **ลิงก์เป็นแบบ relative** (`index.html`, `menu.html`) — ต้อง **deploy โฟลเดอร์ที่มีทั้งสองไฟล์ไว้ด้วยกัน** แล้วลิงก์จะใช้ได้
- **อย่าเปลี่ยน path** เป็น absolute (เช่น `/index.html`) เว้นแต่จะ deploy ที่ root ของโดเมน และรู้ว่า path ถูกต้อง
- โครงสร้างที่แนะนำบนเซิร์ฟเวอร์:
  ```
  /
  ├── index.html
  ├── menu.html
  └── (ไฟล์อื่น ถ้ามี)
  ```

---

## แนะนำที่ deploy (ฟรี)

### 1. **GitHub Pages** (เหมาะถ้าใช้ Git อยู่แล้ว)

1. สร้าง repo บน GitHub แล้ว push โฟลเดอร์โปรเจกต์ (มี `index.html`, `menu.html`)
2. ไปที่ repo → **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` (หรือ master) → Folder: **/ (root)** → Save
5. รอ 1–2 นาที แล้วเข้า `https://<username>.github.io/<repo-name>/`
   - หน้าแรก: `.../Viral_rash/` หรือ `.../Viral_rash/index.html`
   - เมนู: `.../Viral_rash/menu.html`

**หมายเหตุ:** ถ้า repo ชื่อ `Viral_rash` URL จะเป็น `https://username.github.io/Viral_rash/` — ลิงก์ relative ในไซต์จะทำงานได้อัตโนมัติ

---

### 2. **Netlify** (ไม่ต้องใช้ Git ก็ได้)

1. ไป [netlify.com](https://www.netlify.com) → Sign up
2. **Add new site** → **Deploy manually** (หรือเชื่อม Git)
3. ลากโฟลเดอร์ที่มี `index.html` + `menu.html` ไปวางในกล่อง Drag and drop
4. เสร็จแล้วจะได้ URL เช่น `random-name.netlify.app`
5. (ถ้าต้องการ) เปลี่ยนชื่อใน **Site settings** → **Domain management** → **Edit site name**

---

### 3. **Vercel**

1. ไป [vercel.com](https://vercel.com) → Sign up (ใช้ GitHub ได้)
2. **Add New** → **Project** → อัปโหลดโฟลเดอร์หรือเชื่อม Git
3. Root Directory: เลือกโฟลเดอร์ที่มี `index.html`, `menu.html`
4. Deploy แล้วจะได้ URL เช่น `project-name.vercel.app`

---

### 4. **Cloudflare Pages**

1. ไป [pages.cloudflare.com](https://pages.cloudflare.com)
2. **Create a project** → **Direct Upload**
3. อัปโหลดโฟลเดอร์ (มีทั้ง `index.html` และ `menu.html`)
4. จะได้ URL เช่น `project-name.pages.dev`

---

## สรุป

| บริการ         | ข้อดี              | เหมาะกับ                    |
|----------------|--------------------|-----------------------------|
| **GitHub Pages** | ฟรี, ผูกกับ Git   | มี repo อยู่แล้ว            |
| **Netlify**      | ลากวางได้, ฟรี   | ไม่อยากใช้ Git              |
| **Vercel**       | เร็ว, ฟรี         | ใช้ Git หรืออัปโหลด         |
| **Cloudflare Pages** | ฟรี, CDN เร็ว | อยากใช้ Cloudflare          |

หลัง deploy แล้ว ตรวจสอบว่า:
- เปิด `https://your-site.com/` หรือ `.../Viral_rash/` แล้วเห็นหน้า index
- คลิกไป **เมนู** (หรือ `menu.html`) แล้วกดการ์ดไปที่หัวข้อต่างๆ ใน index ได้ครบ

---

## ทำไมแบบทดสอบ (quiz) ส่งเข้า Google Sheet ไม่ได้?

### เช็กตามนี้

1. **Deploy Web App ต้องตั้ง "Who has access: Anyone"**
   - ถ้าเป็น "Only myself" หรือ "Anyone with Google account" บางครั้ง CORS จะบล็อกเมื่อเปิดเว็บจาก domain อื่น
   - ไปที่ Apps Script → Deploy → Manage deployments → Edit (ดินสอ) → เปลี่ยนเป็น **Anyone** แล้ว Save new version

2. **ต้องมีฟังก์ชัน doPost(e)**
   - หน้า quiz ส่งข้อมูลด้วย **POST** (ไม่ใช่ GET)
   - ใน Code.gs ต้องมี `function doPost(e)` ที่อ่าน `e.postData.contents` (เป็น JSON string) แล้วบันทึกลง Sheet

3. **ใช้ URL จาก Deploy ล่าสุด**
   - หลัง Deploy แต่ละครั้ง URL อาจเปลี่ยน (ถ้าเลือก "New deployment")
   - Copy URL จาก Deploy → Manage deployments → Web app → URL แล้วไปใส่ใน `quiz.html` ที่ตัวแปร `APPS_SCRIPT_URL`

4. **เปิดเว็บผ่าน HTTPS (ไม่ใช่ file://)**
   - ถ้าเปิด `index.html` แบบไฟล์ในเครื่อง (file://) บราว์เซอร์มักบล็อก request ไปต่างโดเมน (CORS)
   - ควร deploy เว็บขึ้นโฮสต์ (GitHub Pages / Netlify ฯลฯ) แล้วเปิด quiz ผ่าน https://.../quiz.html

5. **ดู error ในหน้าจอและใน Console**
   - หลังแก้ quiz แล้ว ถ้าส่งไม่เข้า จะมีข้อความ error ใต้ "กำลังบันทึกคะแนน..."
   - กด F12 → แท็บ Console จะเห็น error รายละเอียด (เช่น CORS, HTTP 404, 500)

### ตัวอย่างโค้ด Apps Script

ในโปรเจกต์มีไฟล์ **AppScript-Code.gs** — เปิดแล้ว copy ไปวางใน Google Apps Script (Extensions → Apps Script ของ Google Sheet) แล้ว Deploy เป็น Web app ตามขั้นตอนในคอมเมนต์ของไฟล์นั้น
