/**
 * VERSION: 2.1.1
 * GITHUB: https://github.com/TheGreatAzizi/Secure-DNS-over-HTTPS-Cloudflare-Worker
 */

const DNS_UPSTREAMS = [
"https://cloudflare-dns.com/dns-query", "https://1.1.1.1/dns-query",
"https://1.0.0.1/dns-query", "https://mozilla.cloudflare-dns.com/dns-query",
"https://security.cloudflare-dns.com/dns-query", "https://family.cloudflare-dns.com/dns-query",
"https://dns64.cloudflare-dns.com/dns-query", "https://brave.cloudflare-dns.com/dns-query",
"https://dns.google/dns-query", "https://8888.google/dns-query",
"https://dns64.dns.google/dns-query", "https://dns.quad9.net/dns-query",
"https://dns9.quad9.net/dns-query", "https://dns10.quad9.net/dns-query",
"https://dns11.quad9.net/dns-query", "https://dns12.quad9.net/dns-query",
"https://dns.nextdns.io/dns-query", "https://doh.opendns.com/dns-query",
"https://doh.familyshield.opendns.com/dns-query", "https://doh.umbrella.com/dns-query",
"https://dns.adguard-dns.com/dns-query", "https://unfiltered.adguard-dns.com/dns-query",
"https://family.adguard-dns.com/dns-query", "https://doh.mullvad.net/dns-query",
"https://adblock.doh.mullvad.net/dns-query", "https://base.dns.mullvad.net/dns-query",
"https://extended.dns.mullvad.net/dns-query", "https://all.dns.mullvad.net/dns-query",
"https://family.dns.mullvad.net/dns-query", "https://freedns.controld.com/p0",
"https://freedns.controld.com/p1", "https://freedns.controld.com/p2",
"https://freedns.controld.com/p3", "https://freedns.controld.com/family",
"https://freedns.controld.com/uncensored", "https://sky.rethinkdns.com/dns-query",
"https://doh.cleanbrowsing.org/doh/security-filter/", "https://doh.cleanbrowsing.org/doh/adult-filter/",
"https://doh.cleanbrowsing.org/doh/family-filter/", "https://zero.dns0.eu/dns-query",
"https://kids.dns0.eu/dns-query", "https://private.canadianshield.cira.ca/dns-query",
"https://protected.canadianshield.cira.ca/dns-query", "https://family.canadianshield.cira.ca/dns-query",
"https://protective.joindns4.eu/dns-query", "https://child.joindns4.eu/dns-query",
"https://noads.joindns4.eu/dns-query", "https://child-noads.joindns4.eu/dns-query",
"https://unfiltered.joindns4.eu/dns-query", "https://wikimedia-dns.org/dns-query",
"https://doh.wikimedia.org/dns-query", "https://dns.switch.ch/dns-query",
"https://dns.digitale-gesellschaft.ch/dns-query", "https://doh.libredns.gr/dns-query",
"https://doh.libredns.gr/noads", "https://odvr.nic.cz/dns-query",
"https://doh.ffmuc.net/dns-query", "https://doh.applied-privacy.net/query",
"https://dns.aa.net.uk/dns-query", "https://dns.alidns.com/dns-query",
"https://dns.twnic.tw/dns-query", "https://dns.pub/dns-query",
"https://doh.360.cn/dns-query", "https://public.dns.iij.jp/dns-query",
"https://doh.dns.sb/dns-query", "https://doh.pub/dns-query",
"https://ordns.he.net/dns-query", "https://dns.brahma.world/dns-query",
"https://dns.cfiec.net/dns-query", "https://dns.dnshome.de/dns-query",
"https://dnsforge.de/dns-query", "https://clean.dnsforge.de/dns-query",
"https://hard.dnsforge.de/dns-query", "https://doh-fi.blahdns.com/dns-query",
"https://doh-jp.blahdns.com/dns-query", "https://doh-de.blahdns.com/dns-query",
"https://doh-sg.blahdns.com/dns-query", "https://doh.centraleu.pi-dns.com/dns-query",
"https://doh.westus.pi-dns.com/dns-query", "https://doh.eastus.pi-dns.com/dns-query",
"https://doh.northeu.pi-dns.com/dns-query", "https://doh.tiar.app/dns-query",
"https://doh.tiarap.org/dns-query", "https://jp.tiar.app/dns-query",
"https://jp.tiarap.org/dns-query", "https://dns.containerpi.com/dns-query",
"https://dns.rubyfish.cn/dns-query", "https://doh.armadillodns.net/dns-query",
"https://commons.host/dns-query", "https://doh.crypto.sx/dns-query",
"https://dns.dnswarden.com/uncensored", "https://resolver-eu.lelux.fi/dns-query",
"https://doh.bortzmeyer.fr/dns-query", "https://dns.oszx.co/dns-query",
"https://ada.openbld.net/dns-query", "https://ric.openbld.net/dns-query",
"https://luna.openbld.net/dns-query", "https://fra01.dnscry.pt/dns-query",
"https://lon01.dnscry.pt/dns-query", "https://nyc01.dnscry.pt/dns-query",
"https://par01.dnscry.pt/dns-query", "https://ams01.dnscry.pt/dns-query",
"https://sin01.dnscry.pt/dns-query", "https://syd01.dnscry.pt/dns-query",
"https://tok01.dnscry.pt/dns-query", "https://sea01.dnscry.pt/dns-query",
"https://lax01.dnscry.pt/dns-query", "https://anycast.uncensoreddns.org/dns-query",
"https://unicast.uncensoreddns.org/dns-query", "https://dns.njal.la/dns-query",
"https://freedom.mydns.network/dns-query", "https://paranoia.mydns.network/dns-query",
"https://adblock.mydns.network/dns-query", "https://family.mydns.network/dns-query",
"https://dns.comss.one/dns-query", "https://router.comss.one/dns-query",
"https://ca01.dns4me.net", "https://ca02.dns4me.net",
"https://us01.dns4me.net", "https://us02.dns4me.net",
"https://uk01.dns4me.net", "https://au01.dns4me.net",
"https://sg01.dns4me.net", "https://de01.dns4me.net",
"https://dnspub.restena.lu/dns-query", "https://safeservedns.com/dns-query",
"https://dns.rabbitdns.org/dns-query", "https://security.rabbitdns.org/dns-query",
"https://family.rabbitdns.org/dns-query", "https://v.recipes/dns-query",
"https://v.recipes/dns-adblock", "https://v.recipes/dns-ecs",
"https://dns.surfsharkdns.com/dns-query", "https://dns.blokada.org/dns-query",
"https://root.hagezi.org/dns-query", "https://wurzn.hagezi.org/dns-query",
"https://juuri.hagezi.org/dns-query", "https://eu1.dns.lavate.ch/dns-query",
"https://doh.seby.io/dns-query", "https://resolver1.absolight.net/dns-query",
"https://resolver2.absolight.net/dns-query", "https://per.adfilter.net/dns-query",
"https://syd.adfilter.net/dns-query", "https://adl.adfilter.net/dns-query",
"https://ns0.fdn.fr/dns-query", "https://ns1.fdn.fr/dns-query",
"https://dns.technitium.com/dns-query", "https://dns.telekom.de/dns-query",
"https://dns.aquilenet.fr/dns-query", "https://doh.lacontrevoie.fr/dns-query",
"https://dns.belnet.be/dns-query", "https://dns1.in-berlin.de/dns-query",
"https://dns2.in-berlin.de/dns-query", "https://resolver.dnsprivacy.org.uk/dns-query",
"https://resolver.sunet.se/dns-query", "https://ns1.opennameserver.org/dns-query",
"https://dns.froth.zone/dns-query", "https://dns.stormycloud.org/dns-query",
"https://adfree.usableprivacy.net/dns-query", "https://doh.dns4all.eu/dns-query",
"https://dns.smartguard.io/dns-query", "https://privacy.plumedns.com/dns-query",
"https://dns.bitdefender.net/dns-query", "https://dns.cctld.kg/dns-query",
"https://doh.lv/dns-query", "https://doh.nic.lv/dns-query",
"https://japan.dnsovertor.cc/dns-query", "https://chuncheon.dnsovertor.cc/dns-query",
"https://seoul.dnsovertor.cc/dns-query", "https://dns.cert.ee/dns-query",
"https://secure.hafnova.com/dns-query", "https://dns.kescher.at/dns-query",
"https://ibuki.cgnat.net/dns-query", "https://doh.li/dns-query",
"https://dns4eu.online/dns-query", "https://dns.elemental.software/dns-query",
"https://doth.huque.com/dns-query", "https://zdn.ro/dns-query",
"https://doh.zknt.org/dns-query", "https://ns2.4netguides.org/dns-query",
"https://dukun.de/dns-query", "https://dns.cynthialabs.net/dns-query"
];

const APP_STATE = {
  RESOLVERS: DNS_UPSTREAMS.map(u => ({ url: u, score: 100 })),
  CACHE_STORE: new Map(),
  THROTTLE: new Map(),
  TTL: 300 
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const clientIP = req.headers.get('CF-Connecting-IP') || 'unknown';

    if (this.checkSpam(clientIP)) return new Response('Rate Limit', { status: 429 });
    if (url.pathname === '/dns-query') return this.handleDNS(req);

    return this.renderUI(url.host);
  },

  checkSpam(ip) {
    const now = Date.now();
    let stats = APP_STATE.THROTTLE.get(ip) || { c: 0, ts: now };
    if (now - stats.ts > 60000) stats = { c: 0, ts: now };
    stats.c++;
    APP_STATE.THROTTLE.set(ip, stats);
    return stats.c > 250;
  },

  async handleDNS(req) {
    let payload;
    if (req.method === 'POST') payload = await req.arrayBuffer();
    else {
      const q = new URL(req.url).searchParams.get('dns');
      if (!q) return new Response('Empty query', { status: 400 });
      payload = Uint8Array.from(atob(q.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    }

    const key = await this.hash(payload);
    const hit = APP_STATE.CACHE_STORE.get(key);
    if (hit && (Date.now() - hit.ts < APP_STATE.TTL * 1000)) {
      return new Response(hit.body, { headers: { 'content-type': 'application/dns-message', 'x-cache': 'HIT' } });
    }

    const racers = APP_STATE.RESOLVERS.sort((a, b) => b.score - a.score).slice(0, 8);
    try {
      const win = await Promise.any(racers.map(node => this.relay(node, payload)));
      APP_STATE.CACHE_STORE.set(key, { body: win.body, ts: Date.now() });
      return new Response(win.body, { headers: { 'content-type': 'application/dns-message', 'x-winner-lat': win.t + 'ms' } });
    } catch (e) {
      return new Response('Global Resolving Failed', { status: 502 });
    }
  },

  async relay(node, packet) {
    const start = Date.now();
    const res = await fetch(node.url, {
      method: 'POST',
      headers: { 'content-type': 'application/dns-message', 'accept': 'application/dns-message' },
      body: packet
    });
    if (!res.ok) { node.score -= 20; throw 0; }
    node.score = Math.min(100, node.score + 1);
    return { body: await res.arrayBuffer(), t: Date.now() - start };
  },

  async hash(buf) {
    const h = await crypto.subtle.digest('SHA-1', buf);
    return Array.from(new Uint8Array(h)).map(x => x.toString(16).padStart(2, '0')).join('');
  },

  renderUI(host) {
    const endpoint = `https://${host}/dns-query`;
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure DNS over HTTPS (DoH) Pro</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Vazirmatn:wght@400;700;900&display=swap');
        body { background: #020617; color: #cbd5e1; font-family: 'Inter', 'Vazirmatn', sans-serif; overflow-x: hidden; }
        .cyber-glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(0, 243, 255, 0.08); }
        .lang-fa { direction: rtl; font-family: 'Vazirmatn', sans-serif; }
        .nav-active { background: #0ea5e9; color: white !important; border-color: #38bdf8 !important; box-shadow: 0 0 15px rgba(14, 165, 233, 0.3); }
        .panel { display: none; } .panel-active { display: block; animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        code { color: #22d3ee; font-family: monospace; background: #000; padding: 3px 7px; border-radius: 6px; }
        .btn-tab { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #1e293b; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="p-4 md:p-12">

    <!-- LANGUAGE SWITCHER -->
    <div class="fixed top-6 right-6 z-50">
        <button onclick="document.getElementById('langMenu').classList.toggle('hidden')" class="cyber-glass px-6 py-3 rounded-2xl flex items-center gap-4 text-xs font-bold border-cyan-500/20 hover:scale-105 transition-all shadow-2xl">
            🌐 <span id="currentLang">LANGUAGE</span>
        </button>
        <div id="langMenu" class="hidden absolute right-0 mt-3 cyber-glass p-2 rounded-2xl w-44 shadow-2xl border-slate-800">
            <button onclick="changeLang('en')" class="w-full text-left p-3 hover:bg-sky-600 rounded-xl text-xs mb-1">ENGLISH</button>
            <button onclick="changeLang('fa')" class="w-full text-right p-3 hover:bg-emerald-600 rounded-xl text-xs mb-1">فارسی</button>
            <button onclick="changeLang('zh')" class="w-full text-left p-3 hover:bg-teal-600 rounded-xl text-xs">简体中文</button>
        </div>
    </div>

    <div class="max-w-4xl mx-auto">
        <header class="text-center py-16 md:py-24">
            <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400" id="mainTitle">Secure DNS over HTTPS</h1>
            <p id="subTag" class="mt-8 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Edge Resolve Network • 8-Way Concurrent Racing</p>
        </header>

        <section class="cyber-glass rounded-[3rem] p-8 md:p-14 mb-10 text-center">
            <div class="mb-6">
                <span class="text-[11px] font-black text-cyan-500 tracking-widest uppercase mb-4 block" id="labelUrl">Endpoint URL</span>
                <input id="linkInp" value="${endpoint}" readonly class="w-full bg-black/40 border border-slate-800 p-5 rounded-2xl text-cyan-300 font-mono text-center text-sm outline-none focus:border-cyan-500/50 shadow-inner">
            </div>
            <button onclick="copyURL()" class="bg-cyan-600 hover:bg-cyan-400 text-black font-black px-12 py-5 rounded-2xl transition-all shadow-xl active:scale-95">
                <span id="txtCopy">COPY ENDPOINT</span>
            </button>
        </section>

        <!-- TUTORIAL SECTION -->
        <div class="mb-16">
            <nav id="tutorialNav" class="flex flex-wrap gap-3 justify-center mb-8">
                <button onclick="tab('chrome')" id="btnC" class="btn-tab px-6 py-3 rounded-2xl text-[11px] font-black uppercase text-slate-400 nav-active">Chrome / Brave / Edge</button>
                <button onclick="tab('firefox')" id="btnF" class="btn-tab px-6 py-3 rounded-2xl text-[11px] font-black uppercase text-slate-400">Firefox</button>
                <button onclick="tab('mobile')" id="btnM" class="btn-tab px-6 py-3 rounded-2xl text-[11px] font-black uppercase text-slate-400">Android / iOS</button>
            </nav>

            <section id="docPanels" class="min-h-[300px]">
                <!-- Chrome/Edge Panel -->
                <div id="chrome" class="panel panel-active cyber-glass p-10 md:p-14 rounded-[3rem]">
                    <h3 class="text-2xl font-black mb-8 text-cyan-100" id="cH">Setup for Chromium Browsers</h3>
                    <div class="space-y-6 text-slate-400 text-sm leading-relaxed" id="cL">
                        <p>1. Open Browser <b>Settings</b> and type "DNS" in the search box.</p>
                        <p>2. Select <b>Security</b> > Scroll to <b>Use Secure DNS</b>.</p>
                        <p>3. Choose <b>"With Custom"</b> provider.</p>
                        <p>4. Paste your Neptune URL from the copy-box above.</p>
                        <p>5. Test by visiting a DNS-restricted website.</p>
                    </div>
                </div>

                <!-- Firefox Panel -->
                <div id="firefox" class="panel cyber-glass p-10 md:p-14 rounded-[3rem]">
                    <h3 class="text-2xl font-black mb-8 text-emerald-100" id="fH">Setup for Firefox</h3>
                    <div class="space-y-6 text-slate-400 text-sm leading-relaxed" id="fL">
                        <p>1. Open Firefox <code>Settings</code> and scroll down to <b>Network Settings</b>.</p>
                        <p>2. Click <b>Settings...</b> and check <b>"Enable DNS over HTTPS"</b> at the bottom.</p>
                        <p>3. Set provider to <b>Custom</b> and paste your unique URL.</p>
                        <p>4. Select <b>"Max Protection"</b> for complete censorship bypass.</p>
                    </div>
                </div>

                <!-- Mobile/iOS Panel -->
                <div id="mobile" class="panel cyber-glass p-10 md:p-14 rounded-[3rem]">
                    <h3 class="text-2xl font-black mb-8 text-teal-100" id="mH">Android / iOS Logic</h3>
                    <p class="text-slate-500 text-sm mb-6 italic" id="mD">This resolver is a DoH (HTTPS-based) service, which modern phones handle differently than system-wide settings.</p>
                    <div class="space-y-6 text-slate-400 text-sm" id="mL">
                        <p><b>A) For Mobile Browsers:</b> Open Browser settings (Chrome/Firefox/Edge) on your phone and follow the desktop steps. <b>This is the best and fastest way.</b></p>
                        <p><b>B) For System-wide Apps:</b> We highly recommend using <b>RethinkDNS</b> or <b>Intra</b> apps. In these apps, set the DNS type to DoH and provide your unique Neptune link.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- SPECIAL EXPLANATION (Critical Point) -->
        <div class="cyber-glass p-8 md:p-12 rounded-[3.5rem] mb-20 border-sky-900/40 relative">
            <h4 class="text-sky-400 font-black text-base md:text-lg mb-6 flex items-center gap-3">
                ⭐ <span id="whyH">Why ONLY Browser-level DOH? (Crucial Tip)</span>
            </h4>
            <div class="space-y-6 text-[13px] md:text-[14px] text-slate-400 leading-loose" id="whyT">
                <p>Most operating systems (Windows settings, Android "Private DNS", or Apple Profiles) natively expect <b>DNS-over-TLS (DoT)</b> which runs on Port 853. Since this worker is built on <b>Cloudflare Edge (Serverless)</b>, it strictly provides <b>DNS-over-HTTPS (DoH)</b> running on Port 443.</p>
                <p><b>The Issue:</b> You <u>cannot</u> paste an <code>https://</code> link into the native Windows or Android DNS settings. It will result in an "Invalid Hostname" error. Systems there expect a simple domain, but this service requires the full path for HTTPS resolution.</p>
                <p><b>The Solution:</b> Browsers (Chrome, Edge, Firefox) have their own independent DOH clients. They are 100% compatible with Port 443 workers and provide far superior stability, encryption, and speed than standard OS DNS profiles. By setting this in the browser, your queries travel hidden within standard HTTPS web traffic, making them almost impossible for ISPs to intercept.</p>
            </div>
        </div>

        <footer class="mt-32 pb-20 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center opacity-60 gap-8">
            <div>
                <span class="text-[10px] font-black tracking-widest text-cyan-600 block mb-1">DOH CORE: NEPTUNE-V2</span>
                <p class="text-[9px] uppercase">Built with Edge-Computing Infrastructure</p>
            </div>
            <div class="flex gap-10 font-bold text-[10px] uppercase">
                <a href="https://x.com/the_azzi" class="hover:text-cyan-400" target="_blank">Twitter (X)</a>
                <a href="https://github.com/TheGreatAzizi/Secure-DNS-over-HTTPS-Cloudflare-Worker" class="hover:text-cyan-400" target="_blank">GitHub</a>
            </div>
        </footer>
    </div>

    <script>
        const I18N = {
            en: {
                main: 'Secure DNS over HTTPS', sub: 'Edge Resolve Network • 8-Way Concurrent Racing',
                urlL: 'Endpoint URL', cpT: 'COPY ENDPOINT', tabC: 'Chrome / Brave / Edge', tabF: 'Firefox', tabM: 'Android / iOS',
                cH: 'Chromium Browser Settings', cL: '<li>1. Open Browser <b>Settings</b> and find <b>Privacy & Security</b>.</li><li>2. Scroll to <b>"Use Secure DNS"</b>.</li><li>3. Select <b>"With Custom"</b>.</li><li>4. Paste your DoH endpoint URL provided above.</li>',
                fH: 'Firefox Network Options', fL: '<li>1. In Firefox <code>Settings</code>, search for "DNS over HTTPS".</li><li>2. Select <b>Custom</b> from the providers dropdown.</li><li>3. Paste the Neptune DOH link and hit OK.</li>',
                mH: 'Mobile Setup Strategy', mD: 'Smartphones prioritize DOT (Port 853). To use this Worker (Port 443) effectively:',
                mL: '<li><b>In Browsers:</b> Setting it directly in Chrome or Firefox for Mobile is the easiest path.</li><li><b>For Apps:</b> Use <b>Intra</b> or <b>RethinkDNS</b> apps and set DOH server to this link.</li>',
                whyH: 'Why Browser-Level ONLY? (The Technical Reality)',
                whyT: '<p>Operating systems like Windows/Android natively expect <b>DOT (Port 853)</b> and only take a hostname (not a full link). Workers on Cloudflare run on <b>HTTPS (Port 443)</b>, making them incompatible with native system-wide settings.</p><p><b>Result:</b> Modern browsers include their own DOH engine which works perfectly on Port 443. This is the most stealthy and reliable way to encrypt your DNS without facing native system errors.</p>',
                curL: 'ENGLISH'
            },
            fa: {
                main: 'سرویس امن DNS بر روی HTTPS', sub: 'پایدارترین پاسخگویی با مسابقه موازی بین ۸ سرور برتر جهان',
                urlL: 'آدرس مستقیم سرور شما (DoH)', cpT: 'کپی آدرس هوشمند', tabC: 'خانواده کروم', tabF: 'فایرفاکس', tabM: 'اندروید و آیفون',
                cH: 'تنظیمات در کروم، اج و بریو', cL: '<li>۱. در تنظیمات مرورگر کلمه DNS را جستجو کنید.</li><li>۲. وارد بخش Security شوید و Use Secure DNS را پیدا کنید.</li><li>۳. آن را روی حالت <b>With Custom</b> قرار دهید.</li><li>۴. آدرس کپی شده از بالای این صفحه را در کادر قرار دهید.</li>',
                fH: 'تنظیمات در مرورگر فایرفاکس', fL: '<li>۱. در فایرفاکس وارد Settings شوید و Network را باز کنید.</li><li>۲. تیک Enable DNS over HTTPS را بزنید.</li><li>۳. آن را روی حالت Custom گذاشته و لینک اختصاصی خود را وارد کنید.</li>',
                mH: 'استراتژی راه‌اندازی در موبایل', mD: 'گوشی‌ها معمولاً به دنبال پروتکل DOT هستند؛ برای استفاده از سرویس DOH ما بر روی کل گوشی:',
                mL: '<li><b>داخل مرورگر:</b> بهترین راه تنظیم مستقیم در بخش Secure DNS خودِ کروم یا فایرفاکسِ گوشی است.</li><li><b>برای تمام برنامه‌ها:</b> از اپلیکیشن‌های <b>RethinkDNS</b> یا <b>Intra</b> استفاده کنید و لینک DOH را در آن‌ها ست کنید.</li>',
                whyH: 'چرا نمی‌توان در تنظیمات سیستمی (اندروید/ویندوز) ست کرد؟',
                whyT: '<p>تنظیمات سیستمی ویندوز یا Private DNS اندروید، فقط پروتکل <b>DOT (پورت ۸۵۳)</b> را قبول می‌کنند و اجازه نمی‌دهند آدرس‌هایی که با <code>https://</code> شروع می‌شوند را وارد کنید.</p><p><b>راه حل:</b> مرورگرهای مدرن (مثل کروم و اج) یک موتورِ داخلی برای <b>DoH</b> دارند که دقیقاً روی پورت وب (۴۴۳) کار می‌کند. با تنظیم آن در مرورگر، ترافیک شما مخفی مانده و هیچ خطایی دریافت نمی‌کنید.</p>',
                curL: 'فارسی (FA)'
            },
            zh: {
                main: 'Secure DoH 安全加密中心', sub: '基于边缘节点全球竞速协议 v2.1',
                urlL: 'DoH 配置终端', cpT: '复制配置地址', tabC: 'Chromium 引擎', tabF: 'Firefox 火狐', tabM: '安卓与 iOS',
                cH: 'Chromium 浏览器设置', cL: '<li>1. 进入浏览器“设置”，搜索“安全 DNS”。</li><li>2. 将服务提供商设置为“自定义 (Custom)”。</li><li>3. 粘贴本页面的 Neptune 链接，然后重启浏览器生效。</li>',
                fH: '火狐浏览器配置指南', fL: '<li>1. 在火狐“设置”中搜索 DNS 选项。</li><li>2. 在 HTTPS 模式下勾选“增强模式”并选择自定义提供商。</li><li>3. 输入 DoH 服务器地址并确认保存。</li>',
                mH: '移动端解析说明', mD: '移动操作系统通常默认 Port 853 协议；若要在系统中使用此 DOH 服务器:',
                mL: '<li><b>浏览器设置:</b> 直接在安卓或苹果手机的浏览器（Chrome/Firefox）内按上述桌面步骤配置即可。</li><li><b>全系统生效:</b> 建议安装 <b>RethinkDNS</b> 或 <b>Intra</b> App，并在软件中设置本页面地址。</li>',
                whyH: '为什么只能在浏览器配置? (技术架构说明)',
                whyT: '<p>Windows 或安卓系统的 Private DNS 设置项原生仅支持 <b>DOT (853 端口)</b>，而不允许输入带 HTTPS 前缀的链接。本项目基于云原生 <b>Port 443</b> 环境构建。</p><p><b>解析建议:</b> 在浏览器端配置可以完美绕过系统级限制。浏览器独立自带的 DOH 解析器稳定性远高于原生操作系统的证书配置方案。</p>',
                curL: '简体中文'
            }
        };

        function changeLang(c) {
            localStorage.setItem('doc_v6', c);
            const l = I18N[c];
            document.body.classList.toggle('lang-fa', c === 'fa');
            document.getElementById('currentLang').innerText = l.curL;
            document.getElementById('mainTitle').innerText = l.main;
            document.getElementById('subTag').innerText = l.sub;
            document.getElementById('labelUrl').innerText = l.urlL;
            document.getElementById('txtCopy').innerText = l.cpT;
            document.getElementById('btnC').innerText = l.tabC;
            document.getElementById('btnF').innerText = l.tabF;
            document.getElementById('btnM').innerText = l.tabM;
            document.getElementById('cH').innerText = l.cH;
            document.getElementById('cL').innerHTML = l.cL;
            document.getElementById('fH').innerText = l.fH;
            document.getElementById('fL').innerHTML = l.fL;
            document.getElementById('mH').innerText = l.mH;
            document.getElementById('mD').innerText = l.mD;
            document.getElementById('mL').innerHTML = l.mL;
            document.getElementById('whyH').innerText = l.whyH;
            document.getElementById('whyT').innerHTML = l.whyT;
            document.getElementById('langMenu').classList.add('hidden');
        }

        function tab(id) {
            document.querySelectorAll('.panel-active').forEach(p => {p.classList.remove('panel-active'); p.classList.add('panel');});
            document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('nav-active'));
            document.getElementById(id).classList.add('panel-active');
            document.getElementById(id).classList.remove('panel');
            event.target.classList.add('nav-active');
        }

        function copyURL() {
            const el = document.getElementById("linkInp");
            el.select(); document.execCommand("copy");
            alert('LINK CAPTURED!');
        }

        window.onload = () => changeLang(localStorage.getItem('doc_v6') || 'en');
    </script>
</body>
</html>`, { headers: { 'content-type': 'text/html' } });
  }
};
