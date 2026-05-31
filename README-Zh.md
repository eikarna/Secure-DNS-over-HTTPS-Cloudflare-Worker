# 🛡️ Secure DNS over HTTPS (DoH) V2.2.0

### **基于 Cloudflare Worker 的 DoH 解析服务：完整解析池、Profile、更加安全的验证与并行竞速**

[![Cloudflare Workers](https://img.shields.io/badge/Platform-Cloudflare_Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com)
[![Architecture](https://img.shields.io/badge/Architecture-Parallel_Racing_v7.0-emerald)](https://github.com/TheGreatAzizi/Secure-DNS-over-HTTPS-Cloudflare-Worker)
[![Security](https://img.shields.io/badge/Privacy-DNS_Encryption-teal)](https://x.com/the_azzi)
[![Interface](https://img.shields.io/badge/UI-English_Persian_Chinese-0ea5e9)](https://github.com/TheGreatAzizi/Secure-DNS-over-HTTPS-Cloudflare-Worker)

[![English](https://img.shields.io/badge/Readme-English-blue)](./README.md)
[![Farsi](https://img.shields.io/badge/Readme-Farsi-green)](./README-Fa.md)
![Repository Views](https://komarev.com/ghpvc/?username=TheGreatAzizi&repo=Secure-DNS-over-HTTPS-Cloudflare-Worker&color=red)

这是一个运行在 Cloudflare Worker 上的高性能 **DNS-over-HTTPS** 解析服务，并带有多语言配置页面。版本 **2.2.0** 保留了原来的视觉设计，同时升级了后端逻辑：更安全的请求验证、上游 timeout、有限缓存、有限 rate-limit map、解析器评分，以及默认 **Full-Pool** 模式。

**在线演示:** [dns.theazizi.ir](https://dns.theazizi.ir)  
**默认端点:** `https://dns.theazizi.ir/dns-query`

---

## ✨ V2.2.0 新功能

- **默认 Full-Pool 模式:** `/dns-query` 默认使用完整解析池。
- **可选解析器 Profile:** 仍然支持 `default`、`security`、`family`、`adblock`、`dns64`。
- **安全 GET 解码:** 对 DoH GET 的 base64url 数据进行验证和安全解码。
- **Method 与 Content-Type 验证:** 只允许 `GET` 和 `POST`；POST 必须使用 `application/dns-message`。
- **Body Size 验证:** 拒绝过大的 DNS message。
- **DNS Packet 验证:** 检查 query 结构，并要求只有一个 DNS question。
- **上游 timeout:** 使用 `AbortController` 中止过慢的上游请求。
- **有限缓存:** 使用 `MAX_CACHE_ENTRIES` 限制内存缓存大小。
- **有限 Throttle Map:** 使用 `MAX_THROTTLE_ENTRIES` 控制 rate-limit 内存占用。
- **SHA-256 Cache Key**
- **更安全的 HTML 渲染:** Dashboard 中来自 host 的 endpoint 会先被 escape。
- **更干净的前端 JS:** 不再依赖全局 `event`；Clipboard API 带 fallback。
- **更准确的隐私说明:** 明确说明 DoH 只加密 DNS，不是 VPN。

---

## ⚠ 重要说明

### 1. Worker 默认子域名可能被阻断

Cloudflare Worker 默认域名 `*.workers.dev` 在某些网络中可能不可用或不稳定。建议绑定自己的自定义域名，例如：

```txt
dns.yourdomain.com
```

请确保 Cloudflare DNS 中该域名开启 **Proxied** 橙色云朵。

### 2. 只处理 DNS，不是 VPN

本服务只加密客户端与 Worker 之间的 **DNS 查询**。它不会更改您的公网 IP，不会隐藏最终连接的目标 IP，也不能替代完整 VPN 或 Proxy。

如果需要完整流量隧道或隐藏 IP，请配合 VPN、Proxy、v2rayN、Hiddify、Nekoray、Clash 等工具。

### 3. 能解决什么，不能解决什么

适合解决 DNS 污染、DNS 劫持、ISP DNS 篡改和 DNS 级别封锁。

不能单独保证绕过 IP 封锁、SNI 过滤、TLS/HTTPS 封锁、QUIC 封锁、DPI 或网络级限速。

---

## 🚀 架构：并行竞速引擎

传统 DoH 服务通常依赖单一解析器。如果该解析器变慢、被阻断或不稳定，整体服务会变慢。本 Worker 使用竞速引擎：

- **解析器竞速:** 每个 DNS query 会选择当前评分最高的上游解析器。
- **并发请求:** 同时请求多个上游。
- **最快合法响应胜出:** 第一个合法 DNS response 会返回给用户。
- **自愈评分:** 成功的解析器加分，失败或 timeout 的解析器降分。
- **Timeout 保护:** 使用 `AbortController` 中止慢速上游。
- **安全有限缓存:** 高频问题可从有限内存缓存中返回。

当前重要常量：

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

## 🌐 端点与 Profile

### 默认 Full-Pool 端点

```txt
https://dns.theazizi.ir/dns-query
```

新版本默认配置为：

```js
DEFAULT_PROFILE: 'all'
```

也就是说，简单的 `/dns-query` 不需要 query parameter，会直接使用完整解析池。

### 可选 Profile

```txt
https://dns.theazizi.ir/dns-query?profile=default
https://dns.theazizi.ir/dns-query?profile=security
https://dns.theazizi.ir/dns-query?profile=family
https://dns.theazizi.ir/dns-query?profile=adblock
https://dns.theazizi.ir/dns-query?profile=dns64
```

| Profile | 用途 |
|---|---|
| `all` | 完整混合解析池。默认模式。 |
| `default` | 平衡公共解析器，不混合 family/adblock/DNS64 策略。 |
| `security` | 安全与恶意软件过滤解析器。 |
| `family` | 家庭安全过滤解析器。 |
| `adblock` | 广告与 tracker 过滤解析器。 |
| `dns64` | 适用于 IPv6-only/NAT64 网络。 |

> [!WARNING]
> `all` 模式会混合不同策略的解析器。这样覆盖范围更大，但某些域名的结果可能会根据胜出的上游策略而变化。如果需要可预测策略，请使用指定 profile。

---

## 📋 功能特点

- **✅ 完全运行在 Cloudflare Worker 上**
- **✅ 大型 DoH 解析池**
- **✅ 默认通用查询:** `/dns-query`
- **✅ 可选分组 Profile**
- **✅ 支持 DoH GET 与 POST**
- **✅ 安全 base64url GET 解码**
- **✅ method、content-type、packet size 与 DNS 结构验证**
- **✅ 上游 response ID 与 response flag 验证**
- **✅ 上游 timeout**
- **✅ 解析器动态评分**
- **✅ 有限 cache 与有限 throttle map**
- **✅ 基础 rate limit：每 IP 每分钟 250 请求**
- **✅ 英语、波斯语、中文 Dashboard**
- **✅ 健康检查端点:** `/health`

---

## 📖 部署

1. 在 Cloudflare 创建新的 Worker。
2. 粘贴项目中的 `worker.js`。
3. Deploy Worker。
4. 在 `Settings -> Domains & Routes` 添加自定义子域名。
5. 在 Cloudflare DNS 中确保橙色云朵 Proxied 已开启。
6. 使用您的 DoH 端点：

```txt
https://dns.yourdomain.com/dns-query
```

---

## 🔧 配置指南

### Chrome / Edge / Brave

1. 打开 `Settings -> Privacy and security -> Security`。
2. 启用 **Use Secure DNS**。
3. 选择 **Custom**。
4. 输入您的端点：

```txt
https://dns.yourdomain.com/dns-query
```

如果浏览器提示 invalid provider，请先用 DoH GET 测试端点。有时浏览器内部验证或当前系统 DNS 会导致验证失败，即使 Worker 本身正常。

### Firefox

1. 打开 `Settings -> Privacy & Security`。
2. 找到 **DNS over HTTPS**。
3. 选择 **Max Protection** 或 **Custom**。
4. 输入您的 DoH 端点。

### Android / iOS

Android Private DNS 通常需要 **DoT**，不是完整 DoH URL。此 Worker 建议使用支持 Custom DoH URL 的客户端：

- Intra
- RethinkDNS
- Firefox Mobile
- Brave Mobile

### Windows

Windows 原生 DNS 设置通常不能直接使用此类完整 DoH URL。推荐：

- 浏览器内置 Secure DNS
- YogaDNS
- dnscrypt-proxy
- v2rayN / Xray DNS
- 任何支持 Custom DoH URL 的客户端

---

## 🧪 快速测试

健康的 DoH GET 请求应返回：

```txt
HTTP 200
Content-Type: application/dns-message
```

响应可能包含：

```txt
x-cache: HIT / MISS
x-profile: all
x-winner: <upstream-url>
x-winner-lat: <latency>
```

---

## 🧩 关于 YouTube 等服务

YouTube 不只依赖一个域名，它还会使用多个相关域名：

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

如果这些域名都能成功解析但网站仍无法打开，说明问题可能不只是 DNS，需要通过 VPN/Proxy/TUN 工具转发完整 HTTPS 流量。

---

## 👤 Credits & Links

Developer: **TheGreatAzizi**  
Twitter/X: [@the_azzi](https://x.com/the_azzi)
