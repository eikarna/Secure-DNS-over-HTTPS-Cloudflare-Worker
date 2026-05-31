# 🛡️ سرویس امن DNS بر روی HTTPS (DoH) نسخه 2.2.0

### **ریزولور DoH روی Cloudflare Worker با حالت Full-Pool، پروفایل‌های جدا، اعتبارسنجی امن‌تر و موتور مسابقه‌ای**

[![Cloudflare Workers](https://img.shields.io/badge/Platform-Cloudflare_Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com)
[![Architecture](https://img.shields.io/badge/Architecture-Parallel_Racing_v7.0-emerald)](https://github.com/TheGreatAzizi/Secure-DNS-over-HTTPS-Cloudflare-Worker)
[![Security](https://img.shields.io/badge/Privacy-DNS_Encryption-teal)](https://x.com/the_azzi)
[![Interface](https://img.shields.io/badge/UI-English_Persian_Chinese-0ea5e9)](https://github.com/TheGreatAzizi/Secure-DNS-over-HTTPS-Cloudflare-Worker)

[![English](https://img.shields.io/badge/Readme-English-blue)](./README.md)
[![中文](https://img.shields.io/badge/Readme-中文-red)](./README-Zh.md)
![Repository Views](https://komarev.com/ghpvc/?username=TheGreatAzizi&repo=Secure-DNS-over-HTTPS-Cloudflare-Worker&color=red)

این پروژه یک Cloudflare Worker پرسرعت است که یک **اندپوینت اختصاصی DNS-over-HTTPS** همراه با داشبورد چندزبانه ارائه می‌دهد. نسخه **2.2.0** ظاهر اولیه پروژه را حفظ می‌کند، اما بک‌اند را با validation امن‌تر، timeout برای upstreamها، cache محدود، rate-limit محدود، امتیازدهی resolverها و حالت پیش‌فرض **Full-Pool** ارتقا می‌دهد.

**دمو:** [dns.theazizi.ir](https://dns.theazizi.ir)  
**اندپوینت پیش‌فرض:** `https://dns.theazizi.ir/dns-query`

---

## ✨ تغییرات جدید در V2.2.0

- **حالت Full-Pool پیش‌فرض:** مسیر `/dns-query` به‌صورت پیش‌فرض از کل pool resolverها استفاده می‌کند.
- **پروفایل‌های اختیاری:** پروفایل‌های `default`، `security`، `family`، `adblock` و `dns64` هنوز موجودند.
- **Decode امن‌تر برای GET:** پردازش base64url در درخواست‌های GET امن‌تر و دقیق‌تر شده است.
- **اعتبارسنجی Method و Content-Type:** فقط `GET` و `POST` مجازند و POST باید `application/dns-message` باشد.
- **اعتبارسنجی اندازه Body:** پیام‌های DNS بیش از حد بزرگ رد می‌شوند.
- **اعتبارسنجی DNS Packet:** ساختار query بررسی می‌شود و فقط یک question مجاز است.
- **Timeout برای هر upstream:** درخواست‌های کند با `AbortController` قطع می‌شوند.
- **Cache محدود:** اندازه cache با `MAX_CACHE_ENTRIES` محدود شده است.
- **Throttle Map محدود:** حافظه rate-limit با `MAX_THROTTLE_ENTRIES` کنترل می‌شود.
- **Cache Key با SHA-256**
- **رندر امن‌تر HTML:** مقدار host قبل از نمایش در داشبورد escape می‌شود.
- **JS تمیزتر در UI:** حذف وابستگی به global event و استفاده از Clipboard API با fallback.
- **متن دقیق‌تر درباره امنیت و حریم خصوصی:** توضیح داده شده که DoH فقط DNS را رمزنگاری می‌کند و VPN نیست.

---

## ⚠ نکات مهم

### ۱. احتمال فیلتر بودن سابدامین پیش‌فرض Worker

دامنه پیش‌فرض Cloudflare Worker یعنی `*.workers.dev` ممکن است در بعضی شبکه‌ها فیلتر یا ناپایدار باشد. بهتر است Worker را به یک **دامنه یا سابدامین شخصی** وصل کنید:

```txt
dns.yourdomain.com
```

در پنل DNS کلودفلر، وضعیت دامنه باید **Proxied** باشد و ابر نارنجی فعال باشد.

### ۲. فقط DNS، نه VPN

این سرویس فقط **درخواست‌های DNS** را بین کلاینت و Worker رمزنگاری می‌کند. این پروژه آی‌پی عمومی شما را تغییر نمی‌دهد، IP مقصد را از شبکه مخفی نمی‌کند و جایگزین VPN یا Proxy کامل نیست.

برای تونل کامل ترافیک یا تغییر IP باید آن را کنار VPN، Proxy، v2rayN، Hiddify، Nekoray، Clash یا ابزارهای مشابه استفاده کنید.

### ۳. چه چیزی را حل می‌کند و چه چیزی را نه

این سرویس برای DNS Poisoning، DNS Hijacking، دستکاری DNS توسط ISP و فیلترینگ مبتنی بر DNS مفید است.

اما به‌تنهایی تضمین عبور از مسدودسازی IP، فیلترینگ SNI، بلاک TLS/HTTPS، بلاک QUIC، DPI یا اختلال‌های سطح شبکه را ندارد.

---

## 🚀 معماری: موتور مسابقه‌ای Parallel Racing

DoH تک‌سروری اگر کند، فیلتر یا ناپایدار شود، کل سرویس را کند می‌کند. این Worker از موتور مسابقه‌ای استفاده می‌کند:

- **مسابقه resolverها:** برای هر query بهترین resolverهای دارای score بالا انتخاب می‌شوند.
- **درخواست همزمان:** چند upstream همزمان تست می‌شوند.
- **سریع‌ترین پاسخ معتبر برنده است:** اولین DNS response معتبر به کاربر برگردانده می‌شود.
- **امتیازدهی خودکار:** resolverهای موفق امتیاز می‌گیرند و resolverهای خراب یا timeout شده جریمه می‌شوند.
- **محافظت با timeout:** upstreamهای کند با `AbortController` قطع می‌شوند.
- **Cache امن و محدود:** queryهای پرتکرار از cache محدود پاسخ داده می‌شوند.

مقادیر مهم نسخه فعلی:

```js
DEFAULT_PROFILE: 'all'
CACHE_TTL_SECONDS: 300
MAX_CACHE_ENTRIES: 5000
MAX_THROTTLE_ENTRIES: 20000
MAX_DNS_MESSAGE_BYTES: 4096
RATE_LIMIT_MAX_REQUESTS: 250
UPSTREAM_TIMEOUT_MS: 1800
RACE_COUNT: 4
```

---

## 🌐 اندپوینت‌ها و پروفایل‌ها

### اندپوینت پیش‌فرض Full-Pool

```txt
https://dns.theazizi.ir/dns-query
```

در نسخه جدید مقدار پیش‌فرض این است:

```js
DEFAULT_PROFILE: 'all'
```

یعنی مسیر ساده `/dns-query` بدون نیاز به query parameter از کل pool استفاده می‌کند.

### پروفایل‌های اختیاری

```txt
https://dns.theazizi.ir/dns-query?profile=default
https://dns.theazizi.ir/dns-query?profile=security
https://dns.theazizi.ir/dns-query?profile=family
https://dns.theazizi.ir/dns-query?profile=adblock
https://dns.theazizi.ir/dns-query?profile=dns64
```

| Profile | کاربرد |
|---|---|
| `all` | کل pool مخلوط resolverها. حالت پیش‌فرض است. |
| `default` | resolverهای عمومی و متعادل، بدون مخلوط کردن family/adblock/DNS64. |
| `security` | resolverهای امنیتی و ضدبدافزار. |
| `family` | resolverهای مناسب خانواده. |
| `adblock` | resolverهای ضد تبلیغ و ضد tracker. |
| `dns64` | مناسب شبکه‌های IPv6-only/NAT64. |

> [!WARNING]
> حالت `all` عمداً resolverهایی با policyهای مختلف را مخلوط می‌کند. این کار پوشش بیشتری می‌دهد، اما ممکن است پاسخ برخی دامنه‌ها بسته به resolver برنده متفاوت باشد. برای رفتار قابل پیش‌بینی‌تر از profile مشخص استفاده کنید.

---

## 📋 قابلیت‌ها

- **✅ اجرای کامل روی Cloudflare Worker**
- **✅ pool بزرگ resolverها**
- **✅ مسیر پیش‌فرض کلی بدون تفکیک:** `/dns-query`
- **✅ پروفایل‌های جدا برای نیازهای خاص**
- **✅ پشتیبانی از GET و POST در DoH**
- **✅ decode امن base64url برای GET**
- **✅ validation برای method، content-type، اندازه packet و ساختار DNS**
- **✅ validation پاسخ upstream با بررسی transaction ID و response flag**
- **✅ timeout برای upstreamها**
- **✅ امتیازدهی خودکار resolverها**
- **✅ cache و throttle map با اندازه محدود**
- **✅ rate limit پایه: ۲۵۰ درخواست در دقیقه برای هر IP**
- **✅ داشبورد چندزبانه انگلیسی، فارسی و چینی**
- **✅ endpoint سلامت:** `/health`

---

## 📖 راه‌اندازی

۱. در Cloudflare یک Worker جدید بسازید.  
۲. کد `worker.js` پروژه را داخل Worker قرار دهید.  
۳. Worker را Deploy کنید.  
۴. از مسیر `Settings -> Domains & Routes` یک سابدامین شخصی اضافه کنید.  
۵. در Cloudflare DNS مطمئن شوید ابر نارنجی Proxied فعال است.  
۶. از اندپوینت خود استفاده کنید:

```txt
https://dns.yourdomain.com/dns-query
```

---

## 🔧 راهنمای استفاده

### Chrome / Edge / Brave

۱. به `Settings -> Privacy and security -> Security` بروید.  
۲. گزینه **Use Secure DNS** را فعال کنید.  
۳. حالت **Custom** را انتخاب کنید.  
۴. اندپوینت خود را وارد کنید:

```txt
https://dns.yourdomain.com/dns-query
```

اگر مرورگر پیام invalid provider داد، ابتدا endpoint را با DoH GET تست کنید. گاهی validation داخلی مرورگر یا DNS فعلی سیستم باعث خطا می‌شود، حتی اگر Worker سالم باشد.

### Firefox

۱. به `Settings -> Privacy & Security` بروید.  
۲. بخش **DNS over HTTPS** را پیدا کنید.  
۳. حالت **Max Protection** یا **Custom** را انتخاب کنید.  
۴. لینک DoH خود را وارد کنید.

### Android / iOS

Private DNS اندروید معمولاً **DoT** می‌خواهد، نه URL کامل DoH. برای این Worker از کلاینت‌هایی استفاده کنید که Custom DoH URL قبول می‌کنند:

- Intra
- RethinkDNS
- Firefox Mobile
- Brave Mobile

### Windows

تنظیمات بومی ویندوز معمولاً URL کامل DoH مثل این Worker را مستقیم قبول نمی‌کند. گزینه‌های پیشنهادی:

- Secure DNS داخل مرورگر
- YogaDNS
- dnscrypt-proxy
- v2rayN / Xray DNS
- هر کلاینتی که Custom DoH URL را پشتیبانی کند

---

## 🧪 تست سریع

یک درخواست GET سالم باید این خروجی را داشته باشد:

```txt
HTTP 200
Content-Type: application/dns-message
```

پاسخ ممکن است این headerها را هم داشته باشد:

```txt
x-cache: HIT / MISS
x-profile: all
x-winner: <upstream-url>
x-winner-lat: <latency>
```

---

## 🧩 نکته درباره YouTube و سرویس‌های مشابه

YouTube فقط یک دامنه نیست و به چندین دامنه وابسته است:

```txt
youtube.com
www.youtube.com
youtubei.googleapis.com
youtube.googleapis.com
googlevideo.com
ytimg.com
i.ytimg.com
ggpht.com
```

اگر همه این دامنه‌ها resolve می‌شوند ولی سایت باز نمی‌شود، مشکل احتمالاً فقط DNS نیست و باید ترافیک HTTPS هم با VPN/Proxy/TUN عبور کند.

---

## 👤 Credits & Links

Developer: **TheGreatAzizi**  
Twitter/X: [@the_azzi](https://x.com/the_azzi)
