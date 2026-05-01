# 📦 News Module – Architecture & Logic

## 🧠 Overview

Module `news` được thiết kế theo **feature-based architecture**, tách rõ từng tầng để đảm bảo:

* Dễ maintain
* Dễ scale
* Code rõ ràng, không bị “dồn logic”

---

## 🏗️ Cấu trúc

```
news/
├── news.controller.js
├── news.service.js
├── news.route.js
```

---

## 🔄 Luồng xử lý (Flow)

```
Client → Route → Controller → Service → External API → Response
```

---

## 📌 1. `news.route.js` (Routing Layer)

### 🎯 Nhiệm vụ:

* Định nghĩa endpoint (API URL)
* Mapping request → controller

### 📥 Nhận:

* HTTP request từ client

### 📤 Gửi:

* Gọi function trong controller

### 💡 Ví dụ:

```js
router.get("/", getNews);
```

👉 Không xử lý logic ở đây

---

## 📌 2. `news.controller.js` (Controller Layer)

### 🎯 Nhiệm vụ:

* Nhận request từ route
* Lấy params / query / body
* Gọi service để xử lý
* Trả response về client

### 📥 Nhận:

* `req` (query, params...)
* `res`

### 📤 Gửi:

* JSON response

### 💡 Ví dụ:

```js
const getNews = async (req, res) => {
  try {
    const { scope } = req.query;

    const data = await fetchNews(scope);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## 📌 3. `news.service.js` (Business Logic Layer)

### 🎯 Nhiệm vụ:

* Xử lý logic chính
* Gọi API bên ngoài (newsapi.org)
* Transform dữ liệu (nếu cần)

### 📥 Nhận:

* Input từ controller (scope, keyword...)

### 📤 Gửi:

* Data đã xử lý

### 💡 Ví dụ:

```js
const fetchNews = async (scope) => {
  const url = `https://newsapi.org/v2/top-headlines?category=${scope}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.articles;
};
```

---

## ⚠️ Nguyên tắc quan trọng

### ❌ Không làm:

* Route xử lý logic
* Controller gọi API trực tiếp
* Service trả response (`res.json`)

---

### ✅ Phải làm:

* Route → chỉ điều hướng
* Controller → điều phối
* Service → xử lý logic

---

## 🚀 Mở rộng

Bạn có thể thêm:

* Cache (giảm gọi API)
* Translate (dịch title/description)
* Filter theo category

---

## 📌 Tổng kết

| Layer      | Vai trò chính     |
| ---------- | ----------------- |
| Route      | Định nghĩa API    |
| Controller | Điều phối request |
| Service    | Xử lý logic chính |

---

👉 Đây là nền tảng chuẩn để bạn build backend chuyên nghiệp hơn.
