# Next.js Submit Exercise Project

**Đề tài:** Triển khai RBAC/ABAC trong ứng dụng web

**Môn học:** Phát triển phần mềm web an toàn

## Danh sách thành viên nhóm

| STT |     Họ và tên    |     MSSV    |             Vai trò            |
|-----|------------------|-------------|--------------------------------|
| 1   | Nguyễn Trung Huy | 22810310075 | Team Lead, Security Researcher |
| 2   | Vũ Công Khánh    | 22810310023 | Developer, Security Analyst    |

## Phân chia công việc

### Nguyễn Trung Huy (22810310075)
**Kịch bản 1: Lỗ hổng Broken Access Control tại tầng Router**
- [ ] Phân tích và thiết kế hệ thống RBAC (Role-Based Access Control)
- [ ] Xây dựng middleware kiểm soát truy cập tại tầng router
- [ ] Triển khai cơ chế phân quyền người dùng (Admin, User, Guest)
- [ ] Xây dựng route protection và authorization guards
- [ ] Demo và test các lỗ hổng Broken Access Control
- [ ] Viết tài liệu kỹ thuật cho Kịch bản 1

**Kịch bản 2: Tấn công Logic - Server Action Replay Attack**
- [ ] Nghiên cứu và phân tích Server Action Replay Attack
- [ ] Xây dựng cơ chế token/nonce để chống replay attack
- [ ] Triển khai timestamp validation và request signing
- [ ] Implement rate limiting và request throttling
- [ ] Demo tấn công và biện pháp phòng chống
- [ ] Viết tài liệu kỹ thuật cho Kịch bản 2

### Vũ Công Khánh (22810310023)
**Kịch bản 3: Giả mạo Token**
- [ ] Thiết kế và triển khai hệ thống ABAC (Attribute-Based Access Control)
- [ ] Xây dựng JWT authentication system
- [ ] Implement token generation, validation và refresh mechanism
- [ ] Xây dựng cơ chế phát hiện và ngăn chặn token forgery
- [ ] Triển khai token blacklist và revocation
- [ ] Demo các kỹ thuật giả mạo token và biện pháp bảo vệ
- [ ] Viết tài liệu kỹ thuật cho Kịch bản 3

**Công việc chung:**
- [ ] Thiết kế database schema và models
- [ ] Xây dựng giao diện người dùng (UI/UX)
- [ ] Tích hợp các module bảo mật
- [ ] Testing tổng thể hệ thống
- [ ] Chuẩn bị báo cáo và slide thuyết trình
- [ ] Code review và optimize performance

## Hướng dẫn sử dụng

### Yêu cầu hệ thống
- Node.js 18.x trở lên
- npm, yarn, pnpm hoặc bun

### Cài đặt

1. Clone repository:
```bash
git clone https://github.com/huyngtrung/nextjssubmitexerciseproject.git
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

4. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

### Cấu trúc dự án
```
nextjssubmitexerciseproject/
├── app/              # Next.js App Router
├── components/       # React components
├── public/          # Static files
├── styles/          # CSS styles
└── ...
```

### Chức năng chính

#### Kịch bản 1: Broken Access Control
- Hệ thống phân quyền đa cấp (RBAC)
- Route protection và middleware authorization
- Demo các lỗ hổng access control phổ biến
- Biện pháp phòng chống và best practices

#### Kịch bản 2: Server Action Replay Attack
- Token/nonce generation và validation
- Request signing và timestamp verification
- Rate limiting và throttling
- Demo tấn công replay và cơ chế phòng thủ

#### Kịch bản 3: Token Forgery
- JWT authentication system (ABAC)
- Token lifecycle management
- Token validation và refresh mechanism
- Phát hiện và ngăn chặn token forgery
- Token revocation và blacklist

## Getting Started

### Phát triển

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Chỉnh sửa

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tài nguyên học tập

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Tài nguyên học tập

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Triển khai (Deployment)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Liên hệ

GitHub Issues: [https://github.com/huyngtrung/nextjssubmitexerciseproject/issues](https://github.com/huyngtrung/nextjssubmitexerciseproject/issues)

## License

[MIT License](LICENSE)
