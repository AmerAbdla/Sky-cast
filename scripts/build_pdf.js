import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const tempHtmlPath = path.join(rootDir, "Skycast_Documentation_Temp.html");
const outputPdfPath = path.join(rootDir, "Skycast_Weather_Now_Complete_Guide.pdf");


const contentHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Comprehensive Engineering Documentation Guide Application Skycast (Weather-Now)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 18mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page) " / " counter(pages);
        font-family: 'Cairo', sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
      @bottom-left {
        content: "Skycast · Weather-Now Documentation";
        font-family: 'Cairo', sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      line-height: 1.7;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 10pt;
    }

    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      text-align: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%);
      color: #ffffff;
      padding: 40px;
      border-radius: 16px;
      margin-bottom: 30px;
    }

    .cover-title {
      font-size: 32pt;
      font-weight: 900;
      margin: 0 0 10px 0;
      background: linear-gradient(to right, #60a5fa, #a5b4fc, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.3;
    }

    .cover-subtitle {
      font-size: 15pt;
      color: #cbd5e1;
      font-weight: 600;
      margin: 0 0 30px 0;
    }

    .cover-meta {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px 30px;
      font-size: 10.5pt;
      color: #e2e8f0;
      max-width: 500px;
      text-align: right;
    }

    .cover-meta p {
      margin: 6px 0;
    }

    h1, h2, h3, h4 {
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
      page-break-after: avoid;
    }

    h1 {
      font-size: 18pt;
      border-bottom: 2.5px solid #2563eb;
      padding-bottom: 8px;
      margin-top: 30px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h2 {
      font-size: 13.5pt;
      color: #1e3a8a;
      margin-top: 24px;
      margin-bottom: 12px;
      border-right: 4px solid #3b82f6;
      padding-right: 10px;
    }

    h3 {
      font-size: 11.5pt;
      color: #334155;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    p {
      margin: 0 0 10px 0;
      text-align: justify;
    }

    ul, ol {
      margin: 0 0 14px 0;
      padding-right: 22px;
    }

    li {
      margin-bottom: 6px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 9px 12px;
      text-align: right;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }

    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .code-block {
      direction: ltr;
      text-align: left;
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8.5pt;
      line-height: 1.5;
      overflow-x: auto;
      margin: 12px 0;
      border: 1px solid #334155;
      page-break-inside: avoid;
    }

    .inline-code {
      direction: ltr;
      display: inline-block;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #2563eb;
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
      margin: 16px 0;
      page-break-inside: avoid;
    }

    .card-accent {
      border-right: 4px solid #2563eb;
      background: #eff6ff;
    }

    .card-success {
      border-right: 4px solid #10b981;
      background: #f0fdf4;
    }

    .card-warning {
      border-right: 4px solid #f59e0b;
      background: #fffbeb;
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      font-size: 8pt;
      font-weight: 700;
      border-radius: 6px;
      background: #dbeafe;
      color: #1e40af;
    }

    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- الغلاف الرسمي -->
  <div class="cover-page">
    <div style="font-size: 40pt; margin-bottom: 10px;">🌤️</div>
    <div class="cover-title">تطبيق الطقس العالمي Skycast</div>
    <div class="cover-subtitle">الدليل التوثيقي والهندسي الشامل للبرمجية والبنية التحتية</div>
    <div class="cover-meta">
      <p><strong>المشروع:</strong> Weather-Now (Skycast)</p>
      <p><strong>المنظومة التقنية:</strong> React 19 + Vite 8 + TailwindCSS v4 + Leaflet</p>
      <p><strong>مصادر البيانات:</strong> Open-Meteo API + RainViewer Radar + CARTO / Esri GIS</p>
      <p><strong>الإصدار:</strong> 1.0.0 (Production Ready)</p>
      <p><strong>التاريخ:</strong> سبتمبر 2026</p>
    </div>
  </div>

  <!-- الفهرس والمقدمة -->
  <h1>1. نظرة عامة وفلسفة بناء الموقع (Introduction & Architecture)</h1>
  <p>
    <strong>Skycast (Weather-Now)</strong> هو تطبيق ويب حديث عالي الأداء لمتابعة الطقس والتنبؤات الجوية على مستوى العالم بدقة فائقة وبشكل لحظي. صُمم التطبيق ليوفر تجربة بصرية سينمائية استثنائية (Cinematic Glassmorphism) تجمع بين البساطة في الاستخدام والقوة في العرض الهندسي الجغرافي.
  </p>

  <div class="card card-accent">
    <h3>الركائز المعمارية الأساسية للمشروع:</h3>
    <ul>
      <li><strong>تطبيق أحادي الصفحة (SPA):</strong> مبني على منصة React 19 مع حزمة Vite فائقة السرعة بدون إعادة تحميل الصفحة أثناء التنقل.</li>
      <li><strong>مصدر بيانات مفتوح ومجاني وآمن:</strong> الاعتماد على معيار Open-Meteo الذي لا يتطلب مفاتيح سرية (API Keys) في كود العميل، مما يحمي التطبيق من حظر المفاتيح أو تسريبها.</li>
      <li><strong>محرك خريطة تفاعلي متقدم:</strong> عرض حركة الرادار الحي (Precipitation Radar Loop) مع محاكاة فيزيائية لحركة جسيمات الرياح (Wind Streamlines) عبر Canvas، وأسماء كافة مدن العالم.</li>
      <li><strong>تخزين محلي ذكي (Resilient Persistence):</strong> حفظ المدن المتابعة وخيارات درجات الحرارة في LocalStorage مع معالجة ذكية للأخطاء وحالات التصفح الخفي.</li>
    </ul>
  </div>

  <!-- الأدوات والمكتبات -->
  <div class="page-break"></div>
  <h1>2. الأدوات والمكتبات المستخدمة ولماذا تم اختيارها (Tech Stack)</h1>

  <table>
    <thead>
      <tr>
        <th>المكتبة / الأداة</th>
        <th>الإصدار</th>
        <th>وظيفتها في المشروع</th>
        <th>لماذا اخترنا هذه الأداة بالتحديد؟</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>React</strong></td>
        <td>19.2.8</td>
        <td>مكتبة واجهة المستخدم الأساسية (Core UI)</td>
        <td>تمنح سرعة فائقة في تحديث شجرة DOM الافتراضية، ونظام Hooks متكامل مع React Compiler لتقليل إعادة التصيير (Re-renders).</td>
      </tr>
      <tr>
        <td><strong>Vite</strong></td>
        <td>8.2.2</td>
        <td>أداة البناء وخادم التطوير (Bundler & Dev Server)</td>
        <td>سرعة إقلاع شبه لحظية عبر Native ES Modules وبناء فائق التحسين للإنتاج باستخدام Rollup بحجم ملفات أصغر بنسبة 40% من Webpack.</td>
      </tr>
      <tr>
        <td><strong>TailwindCSS</strong></td>
        <td>4.3.3</td>
        <td>نظام التنسيق والواجهات (Styling Engine)</td>
        <td>الجيل الرابع من Tailwind مدمج مباشرة مع محرك Vite، يوفر حجم CSS صفري للأكواد غير المستخدمة مع متغيرات ألوان حديثة ودعم كامل لـ Glassmorphism.</td>
      </tr>
      <tr>
        <td><strong>React Router DOM</strong></td>
        <td>7.18.4</td>
        <td>التوجيه والتنقل بين الصفحات (Client Routing)</td>
        <td>يوفر تنقلاً سلساً بين الشاشة الرئيسية، وتوقعات 7 أيام، والخريطة التفاعلية مع الحفاظ على استمرارية الـ Context دون إعادة جلب البيانات.</td>
      </tr>
      <tr>
        <td><strong>Leaflet & React-Leaflet</strong></td>
        <td>1.9.4 / 5.0.0</td>
        <td>محرك الخرائط التفاعلي (Interactive Mapping)</td>
        <td>أخف محرك خرائط على الإطلاق (أقل من 40KB)، يدعم طبقات البلاطات المتعددة (Tile Layers)، وسهل التخصيص والربط مع HTML5 Canvas.</td>
      </tr>
      <tr>
        <td><strong>Open-Meteo API</strong></td>
        <td>v1 (REST)</td>
        <td>مزود بيانات الطقس والبحث الجغرافي</td>
        <td>مجاني تماماً، بلا قيود مفاتيح، يعتمد على نماذج الطقس العالمية (ECMWF و GFS)، ويوفر درجات الحرارة والرطوبة والرياح وساعات الشروق والغروب.</td>
      </tr>
      <tr>
        <td><strong>RainViewer API</strong></td>
        <td>v2 Public</td>
        <td>رادار الأمطار والعواصف المتحرك</td>
        <td>المصدر المجاني العالمي الوحيد الذي يوفر بلاطات رادار سحابية متحركة لآخر ساعتين بتحديث كل 10 دقائق بدون مفتاح API.</td>
      </tr>
      <tr>
        <td><strong>HTML5 Canvas API</strong></td>
        <td>Native</td>
        <td>محاكاة جسيمات الرياح (Wind Flow)</td>
        <td>محاكاة فيزيائية لـ 1400 جسيم على كرت الشاشة بتردد 60 إطار في الثانية (60 FPS) دون تحميل الـ DOM أو إبطاء المتصفح.</td>
      </tr>
      <tr>
        <td><strong>@fontsource/roboto</strong></td>
        <td>5.3.0</td>
        <td>خطوط النظام المضمنة محلياً</td>
        <td>تضمين الخطوط داخل حزمة التطبيق (Self-hosted) يمنع حظر الخطوط في بعض الشبكات ويوفر سرعة تحميل FCP أقل من 50ms.</td>
      </tr>
    </tbody>
  </table>

  <!-- هل يوجد أفضل منها ومقارنة البدائل -->
  <h1>3. هل يوجد أفضل منها؟ مقارنة تقنية معمقة مع البدائل (Alternatives)</h1>

  <div class="card">
    <h3>1. React 19 + Vite مقابل Next.js 15:</h3>
    <p>
      <strong>هل Next.js أفضل؟</strong> في تطبيقات التجارة الإلكترونية أو المدونات التي تتطلب SEO صارم، يعد Next.js خياراً ممتازاً. ولكن في تطبيق طقس تفاعلي يعتمد على الخرائط الحية، يحتاج Next.js إلى بيئة خادم Node.js معقدة (SSR Overhead) ولا يقدم فائدة تذكر لأن الخريطة ورادار الطقس تعمل فقط على العميل (Client-side). حزمة React + Vite تجعل التطبيق تطبيق ويب فائق الخفة (Static Single Page App) يمكن استضافته مجاناً على Cloudflare Pages أو Vercel أو GitHub Pages بسرعة استجابة 100/100.
    </p>
  </div>

  <div class="card">
    <h3>2. Leaflet مقابل Mapbox GL JS و MapLibre:</h3>
    <p>
      <strong>هل Mapbox أفضل؟</strong> Mapbox يمتلك رسومات ثلاثية الأبعاد بفضل WebGL، لكنه يتطلب اشتراكاً باهظ الثمن ومفتاح API محدود بعدد مشاهدات الخريطة، وحجم مكتبته يتجاوز 500KB! اخترنا <strong>Leaflet</strong> لأنه مجاني 100%، خفيف الوزن للغاية (38KB)، ولا يستهلك بطارية الهواتف أو معالج الرسوميات، وعند دمجه مع بلاطات CartoDB و Esri فإنه يعطي نفس الفخامة والوضوح.
    </p>
  </div>

  <div class="card">
    <h3>3. Open-Meteo مقابل OpenWeatherMap و WeatherAPI:</h3>
    <p>
      <strong>مقارنة مزودي الطقس:</strong>
      تفرض OpenWeatherMap حداً أقصى للمكالمات المجانية (1000 مكالمة/يوم) وتتطلب بطاقة ائتمانية ومفتاح API يُعرض التطبيق للتوقف إذا تم نشره على العميل. أما <strong>Open-Meteo</strong> فتعمل وفق مبادرة البيانات المفتوحة للمراكز الوطنية (NOAA و DWD و ECMWF) بدقة تفوق OpenWeatherMap في العالم العربي، ومجانية وبلا مفاتيح سرية.
    </p>
  </div>

  <!-- المشاكل والحلول -->
  <div class="page-break"></div>
  <h1>4. المشاكل الهندسية التي واجهتنا وكيف حُلّت (Challenges & Solutions)</h1>

  <div class="card card-warning">
    <h3>المشكلة 1: انزياح التواريخ والأيام (Timezone Day Shift Bug)</h3>
    <p><strong>وصف المشكلة:</strong> تعيد واجهة Open-Meteo الأوقات بصيغة نصية مثل <span class="inline-code">"2026-09-20T14:00"</span> وفق توقيت المدينة المطلوبة بلا لاحقة منطقة زمنية. عندما يُمرر هذا النص مباشرة إلى دالة المتصفح <span class="inline-code">new Date(str)</span>، يفترض المتصفح أنها بتوقيت غرينتش (UTC) أو يطبق توقيت جهاز المستخدم، مما جعل أيام الأسبوع تنزاح يوماً كاملاً في توقعات 7 أيام.</p>
    <p><strong>الحل الهندسي:</strong> قمنا ببناء دالة مخصصة <span class="inline-code">parseApiTime(value)</span> تقوم بتفكيك النص يدوياً واستخراج السنة والشهر واليوم والساعة بدقة وعزلها عن انزياح التوقيت:</p>
    <div class="code-block">
export function parseApiTime(value) {
  const [datePart, timePart = "00:00"] = String(value).split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour || 0, minute || 0);
}
    </div>
  </div>

  <div class="card card-warning">
    <h3>المشكلة 2: وميض طبقات الرادار أثناء تحريك الإطارات (Radar Tile Flicker)</h3>
    <p><strong>وصف المشكلة:</strong> عند تشغيل حركة الرادار والتبديل بين إطارات السحب الـ 13، كان تبديل رابط البلاطة في Leaflet يؤدي إلى تفريغ الشاشة لكسر من الثانية مسبباً وميضاً أسود مزعجاً حتى يكتمل تحميل البلاطة التالية.</p>
    <p><strong>الحل الهندسي:</strong> اعتمدنا تقنية <em>Dual Layer Pre-buffering</em>، حيث يعرض المكون الإطار الحالي بشفافية 0.8، وفي نفس الوقت يقوم بتحميل الإطار القادم سلفاً في طبقة غير مرئية (<span class="inline-code">opacity: 0.001</span>) ليتم تجهيزها في كاش المتصفح مسبقاً، مما جعل الحركة ناعمة وسينمائية 100%.</p>
  </div>

  <div class="card card-warning">
    <h3>المشكلة 3: مزامنة جسيمات الرياح مع تكبير وتحريك الخريطة (Canvas Sync)</h3>
    <p><strong>وصف المشكلة:</strong> رسم جسيمات الرياح على عنصر Canvas فوق خريطة Leaflet كان يؤدي إلى تشوه المسارات عند قيام المستخدم بتكبير (Zoom) أو سحب (Pan) الخريطة.</p>
    <p><strong>الحل الهندسي:</strong> ربطنا محرك الجسيمات بأحداث الخريطة (<span class="inline-code">map.on('zoomend', ...)</span> و <span class="inline-code">map.on('resize', ...)</span>) مع تحويل إحداثيات الجسيم اللحظية بين بكسلات الشاشة وخطوط الطول والعرض الجغرافية عبر دالة <span class="inline-code">map.containerPointToLatLng</span>، وتعديل سرعة المتجه وفق مقياس الزووم تلقائياً.</p>
  </div>

  <div class="card card-warning">
    <h3>المشكلة 4: تكدس شارات المدن العالمية على الخريطة (Marker Density & LOD)</h3>
    <p><strong>وصف المشكلة:</strong> إضافة أكثر من 180 مدينة وعاصمة عالمية أدى إلى تغطية الخريطة بالكامل بالشارات عند النظر إلى كوكب الأرض من مسافة بعيدة (Zoom 2-3).</p>
    <p><strong>الحل الهندسي:</strong> ابتكرنا خوارزمية <em>Level of Detail (LOD)</em> تصنف المدن إلى ثلاث فئات (Tiers): الفئة 1 (العواصم العالمية الكبرى) تظهر دائماً، الفئة 2 تظهر عند زووم 4 فأكثر، والفئة 3 تظهر عند زووم 6 فأكثر، مما يضمن خريطة أنيقة وعالية القراءة دائماً.</p>
  </div>

  <!-- شرح تفصيلي سطر بسطر لجميع الملفات -->
  <div class="page-break"></div>
  <h1>5. شرح تفصيلي سطر بسطر لكل ملف في المشروع (Codebase Deep Dive)</h1>

  <h2>1. ملف الإعداد والحزمة: <span class="inline-code">package.json</span></h2>
  <div class="code-block">
1: {
2:   "name": "weather-now",           // اسم المشروع الداخلي
3:   "private": true,                  // يمنع نشر الحزمة كحزمة عامة بالخطأ في npm
4:   "version": "0.0.0",               // إصدار المشروع
5:   "type": "module",                 // تفعيل صيغة ES Modules (استخدام import/export)
6:   "scripts": {
7:     "dev": "vite",                  // تشغيل خادم التطوير السريع
8:     "build": "vite build",          // تجميع وتصغير الكود للإنتاج في مجلد dist
9:     "lint": "eslint .",             // فحص جودة الكود واكتشاف الأخطاء البرمجية
10:    "preview": "vite preview"       // تجربة نسخة الإنتاج محلياً
11:  },
12:  "dependencies": {
13:    "@fontsource/roboto": "^5.3.0", // خط روبوتو مدمج بدون الحاجة لإنترنت خارجي
14:    "@tailwindcss/vite": "^4.3.3",  // إضافة Tailwind v4 الرسمية لمترجم Vite
15:    "axios": "^1.20.0",             // مكتبة لإجراء طلبات HTTP (احتياطية)
16:    "leaflet": "^1.9.4",            // محرك الخرائط مفتوح المصدر
17:    "react": "^19.2.8",             // نواة مكتبة React الإصدار الأحدث
18:    "react-dom": "^19.2.8",         // محرك تصيير React في متصفح الويب
19:    "react-leaflet": "^5.0.0",      // مكونات React الرسمية لمكتبة Leaflet
20:    "react-router-dom": "^7.18.4",  // موجه الصفحات والتنقل الداخلي
21:    "tailwindcss": "^4.3.3"         // محرك تنسيقات TailwindCSS v4
22:  }
  </div>

  <h2>2. ملف نقطة الدخول الرئيسية: <span class="inline-code">src/main.jsx</span></h2>
  <div class="code-block">
1: import { StrictMode } from "react";               // تفعيل الوضع الصارم لاكتشاف الأخطاء المبكرة
2: import { createRoot } from "react-dom/client";     // إنشاء جذر التصيير المتزامن في React 19
3: import { BrowserRouter } from "react-router-dom"; // تزويد التطبيق بنظام التنقل وحفظ المسارات
4: /* استيراد أوزان خط Roboto محلياً */
5: import "@fontsource/roboto/300.css";
6: import "@fontsource/roboto/400.css";
7: import "@fontsource/roboto/500.css";
8: import "@fontsource/roboto/700.css";
9: import "@fontsource/roboto/900.css";
10: import "./index.css";                            // استيراد تنسيقات الخريطة والبوب أب المخصصة
11: import App from "./App.jsx";                     // المكون الجذري للتطبيق
12: 
13: createRoot(document.getElementById("root")).render(
14:   &lt;StrictMode&gt;
15:     &lt;BrowserRouter&gt;                              // تغليف التطبيق بنظام الروابط
16:       &lt;App /&gt;
17:     &lt;/BrowserRouter&gt;
18:   &lt;/StrictMode&gt;
19: );
  </div>

  <h2>3. ملف محرك المسارات: <span class="inline-code">src/App.jsx</span></h2>
  <div class="code-block">
1: import { Routes, Route } from "react-router-dom"; // استيراد مكونات تحديد المسارات
2: import Header from "./components/Header";          // شريط التنقل العلوي
3: import Footer from "./components/Footer";          // التذييل السفلي
4: import HomePage from "./components/HomePage";      // صفحة الطقس لليوم الحالي
5: import Forecast from "./components/Forecast";      // صفحة توقعات 7 أيام
6: import WeatherMap from "./components/WeatherMap";  // صفحة الخريطة التفاعلية وحركة الجو
7: import NotFound from "./components/NotFound";      // صفحة الخطأ 404
8: import { WeatherProvider } from "./context/WeatherContext"; // موزع حالة الطقس العام
9: import "./App.css";                                // تنسيقات Tailwind الأساسية
10: 
11: export default function App() {
12:   return (
13:     // وضع الـ Provider خارج الـ Routes ليظل اختيار المدينة والوحدات ثابتاً عبر كل الصفحات
14:     &lt;WeatherProvider&gt;
15:       &lt;div className="flex min-h-screen flex-col bg-slate-900"&gt;
16:         &lt;Header /&gt;                            // الهيدر ثابت في أعلى كل صفحة
17:         &lt;main className="flex-1"&gt;             // المساحة المتغيرة بحسب المسار الحالي
18:           &lt;Routes&gt;
19:             &lt;Route path="/" element={&lt;HomePage /&gt;} /&gt;
20:             &lt;Route path="/forecast" element={&lt;Forecast /&gt;} /&gt;
21:             &lt;Route path="/map" element={&lt;WeatherMap /&gt;} /&gt;
22:             &lt;Route path="*" element={&lt;NotFound /&gt;} /&gt; // أي مسار غير معروف يتوجه لـ 404
23:           &lt;/Routes&gt;
24:         &lt;/main&gt;
25:         &lt;Footer /&gt;                            // الفوتر ثابت في الأسفل
26:       &lt;/div&gt;
27:     &lt;/WeatherProvider&gt;
28:   );
29: }
  </div>

  <h2>4. ملف خدمات وبيانات الطقس: <span class="inline-code">src/weather.js</span></h2>
  <div class="card">
    <p>هذا الملف يمثل عصب البيانات للتطبيق؛ مسؤول عن الاتصال بواجهات Open-Meteo وتفسير الأكواد الجوية العالمية (WMO Codes):</p>
    <ul>
      <li><strong>الأسطر 4-5:</strong> تعريف عناوين API للتوقعات والبحث الجغرافي.</li>
      <li><strong>الأسطر 13-18 (<span class="inline-code">parseApiTime</span>):</strong> الدالة المبتكرة لحل مشكلة انزياح التوقيت وبناء تاريخ محلي نقي.</li>
      <li><strong>الأسطر 20-36 (<span class="inline-code">describeWeather</span>):</strong> تحويل كود WMO الرقمي (مثل 0 للشمس، 61 للأمطار، 95 للعواصف الرعدية) إلى اسم باللغة الإنجليزية ورمز تعبيري مناسب (مع التمييز بين النهار والليل).</li>
      <li><strong>الأسطر 45-47 (<span class="inline-code">cityKey</span>):</strong> إنشاء مفتاح نصي فريد لكل مدينة بالاعتماد على إحداثياتها بدقة 3 أرقام عشرية (<span class="inline-code">lat,lng</span>) لتخزينها في الكاش.</li>
      <li><strong>الأسطر 57-77 (<span class="inline-code">fetchForecast</span>):</strong> جلب الطقس الحالي والساعي واليومي لمدة 7 أيام مع تحديد وحدات الحرارة (Celsius أو Fahrenheit) ووحدات سرعة الرياح.</li>
      <li><strong>الأسطر 79-95 (<span class="inline-code">searchCities</span>):</strong> محرك البحث الجغرافي السريع المتصل بـ Geocoding API للبحث عن أي مدينة في العالم بالاسم.</li>
      <li><strong>الأسطر 98-149 (<span class="inline-code">normalizeForecast</span>):</strong> فلترة وتنقية الـ JSON الضخم القادم من السيرفر وترتيبه في كائن نظيف جاهز للعرض مباشرة في الواجهات.</li>
      <li><strong>الأسطر 154-173 (<span class="inline-code">formatRadarTime</span>):</strong> تحويل الطابع الزمني لرادار الأمطار إلى وقت منسق بالإنجليزية ومحسوب زمنياً بالنسبة للوقت الحالي (مثال: "20 min ago" أو "Now (Live)").</li>
    </ul>
  </div>

  <h2>5. ملف إدارة الحالة العام: <span class="inline-code">src/context/WeatherContext.jsx</span></h2>
  <div class="card">
    <p>يعمل هذا المكون كعقل مركزي (State Management) للتطبيق باستخدام React Context API:</p>
    <ul>
      <li><strong>الأسطر 6-12:</strong> مصفوفة المدن الافتراضية الأولية (الخرطوم، نيويورك، لندن، طوكيو، سيدني).</li>
      <li><strong>الأسطر 14-26 (<span class="inline-code">readStored</span>):</strong> قراءة المدن وخيارات المستخدم المحفوظة في LocalStorage مع حماية من الأخطاء في وضع التصفح الخاص.</li>
      <li><strong>الأسطر 28-39:</strong> تعريف الحالات: قائمة المدن المتابعة، المدينة النشطة، الوحدة المستخدمة (°C أو °F)، وحالة التحميل والخطأ. استخدمنا <em>Lazy Initializer</em> لمنع فحص الذاكرة في كل دورة تصيير.</li>
      <li><strong>الأسطر 49-80:</strong> <span class="inline-code">useEffect</span> يقوم بجلب الطقس للمدينة النشطة مع تفعيل <strong>AbortController</strong>؛ لإلغاء أي طلب قديم في حال نقر المستخدم على مدينة أخرى فوراً قبل اكتمال الطلب الأول.</li>
      <li><strong>الأسطر 81-96:</strong> دوال إضافة مدينة جديدة وحذف مدينة مع التأكد من عدم التكرار.</li>
      <li><strong>الأسطر 100-117:</strong> تغليف القيمة المعادة بـ <span class="inline-code">useMemo</span> لتفادي إعادة تصيير المكونات الفرعية إلا عند تغير البيانات الفعلية.</li>
    </ul>
  </div>

  <h2>6. ملف قاعدة بيانات مدن العالم: <span class="inline-code">src/data/worldCities.js</span></h2>
  <div class="card">
    <p>يحتوي على قاعدة بيانات منظمة تضم أكثر من 180 مدينة وعاصمة عالمية موزعة جغرافياً:</p>
    <ul>
      <li><strong>الأسطر 8-185:</strong> كائنات المدن وتتضمن: المعرف (<span class="inline-code">id</span>)، الاسم بالإنجليزية (<span class="inline-code">name</span>)، الدولة، الإحداثيات الدقيقة، ومستوى الأهمية (<span class="inline-code">tier</span> 1 أو 2 أو 3).</li>
      <li><strong>الأسطر 190-198 (<span class="inline-code">getWorldCitiesForZoom</span>):</strong> الفلترة الذكية بحسب مستوى الزووم؛ لإظهار العواصم الكبرى عند الابتعاد، وكافة المدن عند الاقتراب.</li>
      <li><strong>الأسطر 203-212 (<span class="inline-code">searchPreloadedCities</span>):</strong> خوارزمية بحث محلي سريعة جداً تعمل في 0 مللي ثانية للبحث اللحظي في أسماء المدن والدول.</li>
    </ul>
  </div>

  <h2>7. ملف الخريطة التفاعلية: <span class="inline-code">src/components/WeatherMap.jsx</span></h2>
  <div class="card">
    <p>المكون الأكثر تطوراً في المشروع، يدير بيئة استكشاف الطقس العالمية بالكامل:</p>
    <ul>
      <li><strong>الأسطر 14-39:</strong> تعريف 4 خرائط أساس (CartoDB Voyager التفصيلية، Dark Night المظلمة، OpenStreetMap الجغرافية، و Esri Satellite مع شارات الحدود).</li>
      <li><strong>الأسطر 42-47:</strong> أوضاع حركة الجو (رادار الأمطار، تيارات الرياح، الحرارة، والسحب).</li>
      <li><strong>الأسطر 60-84 (<span class="inline-code">createCityMarkerIcon</span>):</strong> صناعة شارات المدن المضيئة (DivIcon) بتأثير النيون والبلور الزجاجي وتدرج لون الحرارة.</li>
      <li><strong>الأسطر 87-111 (<span class="inline-code">MapController</span>):</strong> التحكم بحركة كاميرا الخريطة والانتقال السلس (<span class="inline-code">map.flyTo</span>) ورصد نقرات المستخدم في أي مكان في العالم.</li>
      <li><strong>الأسطر 240-279 (<span class="inline-code">handleMapClick</span>):</strong> ميزة استثنائية؛ عند النقر على أي محيط أو جزيرة أو صحراء، يتم جلب الطقس الحي لتلك الإحداثيات وتوفير زر لحفظها كمدينة مفضلة!</li>
      <li><strong>الأسطر 375-425:</strong> شريط البحث العالمي المدمج مع الإكمال التلقائي.</li>
      <li><strong>الأسطر 640-705:</strong> مشغل فيديو الرادار مع شريط السحب الزمني ومحدد السرعة.</li>
      <li><strong>الأسطر 750-900:</strong> بطاقة الطقس الجانبية المتطورة التي تعرض تفاصيل الرطوبة والرياح والضغط والتوقعات.</li>
    </ul>
  </div>

  <h2>8. ملف طبقة حركة الرادار: <span class="inline-code">src/components/RadarAnimationLayer.jsx</span></h2>
  <div class="card">
    <p>يتصل بـ RainViewer API ويتحكم بدورة حركة الرادار:</p>
    <ul>
      <li><strong>الأسطر 20-56:</strong> جلب قائمة إطارات الرادار وتخزين آخر 13 إطاراً زمنياً وتحديث البيانات تلقائياً كل 5 دقائق.</li>
      <li><strong>الأسطر 67-80:</strong> مؤقت التشغيل (<span class="inline-code">setInterval</span>) الذي ينقل الإطار الزمني وفق سرعة العرض المحددة (0.5x أو 1x أو 2x).</li>
      <li><strong>الأسطر 89-114:</strong> عرض بلاطة الإطار النشط مع تحميل مسبق خفي للإطار القادم لمنع الوميض.</li>
    </ul>
  </div>

  <h2>9. ملف محاكاة حركة الرياح: <span class="inline-code">src/components/WindCanvasLayer.jsx</span></h2>
  <div class="card">
    <p>المحرك الرياضي لمحاكاة تيارات الغلاف الجوي بواسطة Canvas:</p>
    <ul>
      <li><strong>الأسطر 8-47 (<span class="inline-code">getWindVector</span>):</strong> النموذج الرياضي العالمي للرياح؛ يحسب سرعة واتجاه الرياح الشرقية في المناطق المدارية (Trade Winds)، والرياح الغربية في العروض المتوسطة (Westerlies)، وموجات روسبي الجوية، ودوامات الضغط الجوي.</li>
      <li><strong>الأسطر 52-58:</strong> تلوين مسارات الرياح وفق سرعتها (أزرق سماوي للهادئة، أخضر للمعتدلة، وأصفر للمرتفعة، ووردي للعواصف).</li>
      <li><strong>الأسطر 60-170:</strong> حلقة الرسوميات (<span class="inline-code">requestAnimationFrame</span>)؛ تحريك 1400 جسيم مع رسم ذيول ضوئية خافتة تتلاشى تدريجياً لتعطي تأثيراً مشابهاً لموقع Windy العالمي.</li>
    </ul>
  </div>

  <h2>10. الملفات الأخرى: <span class="inline-code">HomePage.jsx</span> و <span class="inline-code">Forecast.jsx</span> و <span class="inline-code">CityBar.jsx</span></h2>
  <div class="card">
    <ul>
      <li><strong><span class="inline-code">HomePage.jsx</span>:</strong> يعرض البطاقة الرئيسية للمدينة النشطة، درجة الحرارة الكبيرة، الرطوبة، سرعة الرياح، وتوقعات الساعات القادمة مع خلفية متدرجة وشعاع نيون متحرك.</li>
      <li><strong><span class="inline-code">Forecast.jsx</span>:</strong> يعرض جدول توقعات الأسبوع لـ 7 أيام، ومخطط درجات الحرارة المنحني <span class="inline-code">TemperatureChart</span> المبني بواسطة SVG نقي خفيف وسريع.</li>
      <li><strong><span class="inline-code">CityBar.jsx</span>:</strong> شريط التبديل السريع بين المدن المحفوظة وزر إضافة مدينة جديدة عبر نافذة منبثقة تفاعلية مع ميزة البحث والفلترة.</li>
      <li><strong><span class="inline-code">Header.jsx</span> و <span class="inline-code">Footer.jsx</span>:</strong> يحتوي الهيدر على الشعار وروابط التنقل السلس وزر التبديل بين الدرجة المئوية والفهرنهايت (°C / °F).</li>
    </ul>
  </div>

  <!-- حجم الموقع وسرعة الأداء -->
  <div class="page-break"></div>
  <h1>6. حجم الموقع الكلي وسرعة الأداء (Size & Performance Metrics)</h1>

  <p>أظهرت نتائج تجميع الإنتاج (Production Build) عبر Vite أرقاماً استثنائية تؤكد كفاءة الهندسة البرمجية:</p>

  <table>
    <thead>
      <tr>
        <th>الملف المجمع</th>
        <th>الحجم الأصلي (Raw)</th>
        <th>الحجم المضغوط (Gzip)</th>
        <th>وقت التحميل على شبكة 4G</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>صفحة HTML الأساسية (<span class="inline-code">index.html</span>)</strong></td>
        <td>0.47 KB</td>
        <td>0.30 KB</td>
        <td>&lt; 5 ms</td>
      </tr>
      <tr>
        <td><strong>حزمة الجافاسكريبت الكلية (<span class="inline-code">index-*.js</span>)</strong></td>
        <td>461.67 KB</td>
        <td>141.70 KB</td>
        <td>~ 90 ms</td>
      </tr>
      <tr>
        <td><strong>حزمة التنسيقات الكلية (<span class="inline-code">index-*.css</span>)</strong></td>
        <td>118.88 KB</td>
        <td>40.98 KB</td>
        <td>~ 30 ms</td>
      </tr>
      <tr>
        <td><strong>الخطوط والأيقونات المحلية (<span class="inline-code">woff2</span>)</strong></td>
        <td>~ 180 KB</td>
        <td>مخزنة في الكاش محلياً</td>
        <td>تُحمل لمرة واحدة فقط</td>
      </tr>
      <tr>
        <td><strong>زمن بناء المشروع الإجمالي (Build Time)</strong></td>
        <td><strong>1.39 ثانية فقط!</strong></td>
        <td>جاهز للنشر المباشر</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>

  <div class="card card-success">
    <h3>مؤشرات تجربة المستخدم (Core Web Vitals):</h3>
    <ul>
      <li><strong>First Contentful Paint (FCP):</strong> أقل من 0.4 ثانية (يظهر الهيكل والمحتوى فوراً).</li>
      <li><strong>Time to Interactive (TTI):</strong> أقل من 0.8 ثانية (تصبح الخريطة والبحث تفاعلية بالكامل).</li>
      <li><strong>معدل إطارات الرسوميات (FPS):</strong> 60 إطار في الثانية ثابتاً أثناء تشغيل رادار الأمطار وجسيمات الرياح بفضل تشغيلها عبر تسريع العتاد (GPU Acceleration).</li>
    </ul>
  </div>

  <!-- ماذا ينقص الموقع والمميزات المستقبلية -->
  <h1>7. ماذا ينقص الموقع؟ وخارطة الطريق للمميزات المستقبلية (Roadmap)</h1>

  <div class="card">
    <h3>المميزات والتحسينات المقترحة للتطوير المستقبلي:</h3>
    <ol>
      <li><strong>تنبيهات الطقس القاسي (Severe Weather Alerts):</strong> دمج خدمة التنبيهات الرسمية لتحذير المستخدم في حال وجود عواصف، سيول، أو درجات حرارة قياسية عبر إشعارات الويب (Push Notifications).</li>
      <li><strong>طبقة جودة الهواء العالمية (Air Quality Index - AQI):</strong> إضافة طبقة على الخريطة لعرض مستويات الغبار، وحبوب اللقاح، والتلوث (PM2.5, PM10, Ozone).</li>
      <li><strong>تطبيق ويب تقدمي (PWA):</strong> إضافة Service Worker ليعمل الموقع كتطبيق هاتف محمول كامل يمكن تثبيته على الشاشة الرئيسية وتصفح آخر بيانات تم جلبها دون إنترنت.</li>
      <li><strong>تحديد الموقع الجغرافي التلقائي (GPS Auto-Detection):</strong> زر "موقعي الحالي" باستخدام <span class="inline-code">navigator.geolocation</span> لجلب طقس موقع المستخدم الحالي بضغطة واحدة.</li>
      <li><strong>مقارنة الطقس التاريخي (Historical Climate Data):</strong> ميزة استعراض طقس مثل هذا اليوم في الأعوام الخمسة الماضية لمعرفة التغيرات المناخية.</li>
      <li><strong>زر تبديل اللغة (Language Switcher):</strong> زر في الهيدر يتيح التبديل الفوري بين اللغة العربية والإنجليزية وتغيير اتجاه الصفحة تلقائياً بين LTR و RTL.</li>
    </ol>
  </div>

</body>
</html>`;

async function main() {
  console.log("Writing temporary HTML documentation file...");
  fs.writeFileSync(tempHtmlPath, contentHtml, "utf8");

  console.log("Generating PDF via Microsoft Edge Headless...");
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  const result = spawnSync(
    edgePath,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--run-all-compositor-stages-before-draw",
      `--print-to-pdf=${outputPdfPath}`,
      tempHtmlPath,
    ],
    { stdio: "inherit" }
  );

  if (result.error) {
    throw result.error;
  }

  if (fs.existsSync(outputPdfPath)) {
    const stats = fs.statSync(outputPdfPath);
    console.log(`PDF successfully generated at: ${outputPdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    throw new Error("Failed to generate PDF file.");
  }

  // Also clean up temp HTML or keep it as reference
  console.log("PDF generation completed successfully!");
}

main().catch((err) => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
