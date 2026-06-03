# 📦 News Module – Architecture & Logic

## 🧠 Overview

Module `news` được thiết kế theo **feature-based architecture**, tách rõ từng tầng để đảm bảo:

* Dễ maintain
* Dễ scale
* Code rõ ràng, không bị “dồn logic”

---

## 🏗️ Cấu trúc

```
modules/
names/
├── ?.controller.js
├── ?.service.js
├── ?.route.js
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

| Layer      | Vai trò chính     |
| ---------- | ----------------- |
| Route      | Định nghĩa API    |
| Controller | Điều phối request |
| Service    | Xử lý logic chính |

---
idea cho knowpage
page sẽ có các card thông tin liệu bạn có biết vê đa thể loại 
gồm các hình ảnh có thể lướt qua và ở dưới sẽ là thông tin
