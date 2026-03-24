# Project architecture

## Frontend

- `src/frontend/pages`: mỗi route là một page
- `src/frontend/layouts`: khung dùng chung cho nhiều page
- `src/frontend/ui`: các component tái sử dụng
- `src/frontend/services`: nơi gọi API
- `src/frontend/types`: kiểu dữ liệu TypeScript
- `src/frontend/styles`: CSS global và animation

## Backend

- `backend/src/config`: cấu hình môi trường, db, logger
- `backend/src/modules`: tách theo nghiệp vụ (auth/news/users)
- `backend/src/routes`: định nghĩa API routes
- `backend/src/middlewares`: middleware auth/validate/error
- `backend/src/utils`: helper dùng chung
