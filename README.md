# Next.js Submit Exercise Project

**Đề tài:** Triển khai bảo mật RBAC/ABAC trong ứng dụng web

**Môn học:** Phát triển phần mềm web an toàn

## Danh sách thành viên nhóm

| STT | Họ và tên        | MSSV        | Vai trò                        |
| --- | ---------------- | ----------- | ------------------------------ |
| 1   | Nguyễn Trung Huy | 22810310075 | Team Lead, Security Researcher |
| 2   | Vũ Công Khánh    | 22810310023 | Developer, Security Analyst    |

## Phân chia công việc

### Nguyễn Trung Huy (22810310075)

**Kịch bản 1: Lỗ hổng Broken Access Control tại tầng Router**

-  Phân tích và thiết kế hệ thống RBAC (Role-Based Access Control)
-  Xây dựng middleware kiểm soát truy cập tại tầng router
-  Triển khai cơ chế phân quyền người dùng (Admin, User, Guest)
-  Xây dựng route protection và authorization guards
-  Demo và test các lỗ hổng Broken Access Control
-  Viết tài liệu kỹ thuật cho Kịch bản 1

**Kịch bản 2: Tấn công Logic - Server Action Replay Attack**

-  Nghiên cứu và phân tích Server Action Replay Attack
-  Xây dựng cơ chế token/nonce để chống replay attack
-  Triển khai timestamp validation và request signing
-  Implement rate limiting và request throttling
-  Demo tấn công và biện pháp phòng chống
-  Viết tài liệu kỹ thuật cho Kịch bản 2

### Vũ Công Khánh (22810310023)

**Kịch bản 3: Giả mạo Token**

-  Thiết kế và triển khai hệ thống ABAC (Attribute-Based Access Control)
-  Xây dựng JWT authentication system
-  Implement token generation, validation và refresh mechanism
-  Xây dựng cơ chế phát hiện và ngăn chặn token forgery
-  Triển khai token blacklist và revocation
-  Demo các kỹ thuật giả mạo token và biện pháp bảo vệ
-  Viết tài liệu kỹ thuật cho Kịch bản 3

**Kịch bản 4: Bypass Authorization Middleware (Middleware Authorization Bypass)n**

-  Phân tích cơ chế middleware hiện tại và xác định điểm bị bỏ qua
-  Tạo môi trường mô phỏng bỏ middleware để minh họa việc ai cũng truy cập được /admin
-  Minh họa tấn công bypass middleware bằng cách truy cập trực tiếp URL
-  Phân tích rủi ro khi chỉ kiểm tra vai trò ở tầng query/UI
-  Thiết kế lại hệ thống RBAC/ABAC để kiểm soát truy cập đúng chuẩn
-  Triển khai middleware bảo vệ route (authorization guard)
-  Demo tấn công + demo biện pháp phòng chống
-  Viết tài liệu kỹ thuật và báo cáo cho Kịch bản 4

**Công việc chung:**

-  Thiết kế database schema và models
-  Xây dựng giao diện người dùng (UI/UX)
-  Tích hợp các module bảo mật
-  Testing tổng thể hệ thống
-  Chuẩn bị báo cáo và slide thuyết trình
-  Code review và optimize performance

## Hướng dẫn sử dụng

### Yêu cầu hệ thống

-  Node.js 18.x trở lên
-  npm, yarn, pnpm hoặc bun
-  Docker 
-  Drizzle 0.44.6
-  Mysql 7.x trở lên
-  Deploy: freedb:db, vercel:client
-  Nextjs 15.5.7

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/huyngtrung/nextjssubmitexerciseproject/tree/production
cd nextjssubmitexerciseproject
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. Chạy development server:

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```

4. Cấu hình env

**Devlopment:**
```
DB_USER=xxxx
DB_PASSWORD=xxxx
DB_NAME=xxxxx
DB_HOST=xxx
DB_PORT=xxx
```
**Production:**
```
DB_HOST=sql.freedb.tech
DB_PORT=3306
DB_NAME=xxx
DB_USER=xxx
DB_PASSWORD=xxx
```
**Clerk:** 
```
CLERK_SECRET_KEY=xxx
CLERK_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=xxx
NEXT_PUBLIC_CLERK_SIGN_UP_URL=xxx
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=xxx
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=xxx
```
**Gemikey:** 
``` 
AI_API_KEY=xxx
```

**AWS3:**
```
AWS_S3_REGION=xxx
AWS_S3_ACCESS_KEY_ID=xxx
AWS_S3_SECRET_ACCESS_KEY=xxx
NEXT_PUBLIC_AMS_S3_BUCKET_NAME=xxx
```
**Typesense:** 
```
TYPESENSE_API_KEY=xxx
```

**Other:** 
```
NEXT_PUBLIC_SERVER_URL=http://localhost:3000/vi
```

5. Tạo cơ sở dữ liệu
```
npm run db:generate       #Tạo lại Prisma Client sau khi thay đổi schema.
npm run db:migrate        #Cập nhật database theo các thay đổi trong schema dựa vào tạo các bảng trong cơ sở dữ liệu đã kết nối.
npm run db:studio         #Mở giao diện để xem và chỉnh sửa dữ liệu trong database.
```


6. Mở trình duyệt và truy cập [http://localhost:3000/vi](http://localhost:3000/vi) hoặc [http://localhost:3000/en](http://localhost:3000/en)

### Cấu trúc dự án

```
nextjssubmitexerciseproject/
├── app/              # Next.js App Router
├── components/       # React components
├── public/          # Static files
├── styles/          # CSS styles
└── ...
```


### Khởi chạy dự án

Đầu tiên, chạy máy chủ phát triển:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Truy cập [http://localhost:3000/vi](http://localhost:3000/vi) hoặc [http://localhost:3000/en](http://localhost:3000/en) với trình duyệt để xem kết quả.


## Triển khai (Deployment)

Cách dễ nhất để triển khai ứng dụng Next.js là sử dụng [Nền tảng Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) từ các nhà sáng lập Next.js.

Xem tài liệu [Triển khai Next.js của chúng tôi](https://nextjs.org/docs/app/building-your-application/deploying) để biết thêm chi tiết.

## Liên hệ

GitHub Issues: [https://github.com/huyngtrung/nextjssubmitexerciseproject/issues](https://github.com/huyngtrung/nextjssubmitexerciseproject/issues)

## License

[MIT License](LICENSE)

