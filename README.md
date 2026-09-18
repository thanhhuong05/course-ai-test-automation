# CRM Playwright Automation Framework

Framework kiểm thử tự động bằng **Playwright + TypeScript** cho chức năng đăng nhập của
[Perfex CRM – Anh Tester Demo](https://crm.anhtester.com/admin/authentication).

Kiến trúc: **Page Object Model + custom fixtures + data-driven tests**.

---

## 1. Yêu cầu

- Node.js >= 18 (đang dùng v22.9.0)
- npm

## 2. Cài đặt

```bash
npm install
npx playwright install
```

Tạo file cấu hình môi trường:

```bash
cp .env.example .env
```

`.env`:

```
BASE_URL=https://crm.anhtester.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456
HEADLESS=true
```

> `.env` đã được `.gitignore` — không commit thông tin đăng nhập.

## 3. Chạy test

| Lệnh | Mô tả |
|------|-------|
| `npm test` | Chạy toàn bộ test trên cả 3 trình duyệt |
| `npm run test:chromium` | Chỉ chạy Chromium |
| `npm run test:login` | Chỉ chạy bộ test đăng nhập |
| `npm run test:headed` | Chạy có hiện trình duyệt |
| `npm run test:ui` | Mở Playwright UI mode (debug trực quan) |
| `npm run test:debug` | Chạy ở chế độ debug từng bước |
| `npm run report` | Mở HTML report |
| `npm run codegen` | Ghi lại thao tác thành code |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |

Chạy theo tag:

```bash
npx playwright test --grep @smoke
```

## 4. Cấu trúc thư mục

```
.
├── playwright.config.ts          # Cấu hình projects, reporter, timeout, trace/video
├── tsconfig.json
├── .env.example
├── src/
│   ├── pages/
│   │   ├── BasePage.ts           # Điều hướng, chờ tải, helper dùng chung
│   │   ├── LoginPage.ts          # Locator + hành vi + assertion của trang login
│   │   ├── DashboardPage.ts      # Trang sau khi đăng nhập thành công
│   │   └── index.ts
│   ├── fixtures/
│   │   └── pages.fixture.ts      # Inject page object vào test qua fixture
│   ├── data/
│   │   └── users.ts              # Tài khoản + bộ dữ liệu test âm
│   └── utils/
│       ├── env.ts                # Đọc & validate biến môi trường
│       └── paths.ts
├── tests/
│   └── auth/
│       ├── auth.setup.ts                 # Đăng nhập 1 lần, lưu session
│       ├── login.spec.ts                 # Bộ test đăng nhập
│       └── authenticated-session.spec.ts # Tái sử dụng session đã lưu
└── .github/workflows/playwright.yml
```

## 5. Các test case đang có

**Admin login**

1. Form đăng nhập hiển thị đủ control (email, password, remember me, nút Login, Forgot Password)
2. Đăng nhập đúng thông tin → vào Dashboard `@smoke`
3. Đăng nhập đúng thông tin + tick "Remember me" → vào Dashboard
4. Đăng xuất → quay lại trang login
5. Data-driven các trường hợp sai (5 case):
   - Sai mật khẩu → `Invalid email or password`
   - Email không tồn tại → `Invalid email or password`
   - Mật khẩu toàn khoảng trắng → `The Password field is required.`
   - Mật khẩu rỗng → `The Password field is required.`
   - Email rỗng → `The Email Address field is required.`
6. Submit form rỗng → báo lỗi cả 2 trường bắt buộc
7. Ô mật khẩu che ký tự (`type="password"`)

**Access control**

8. Truy cập `/admin` khi chưa đăng nhập → redirect về trang login

**Session reuse**

9. Dùng session đã lưu → vào thẳng Dashboard, không cần đăng nhập lại

## 6. Ghi chú về ứng dụng thật

Các assertion dưới đây được xác minh trực tiếp trên site, không phải giả định:

- Đăng nhập thành công redirect về `https://crm.anhtester.com/admin/` với `<title>Dashboard</title>`.
- Lỗi hiển thị trong `div.alert.alert-danger`; khi submit form rỗng app render **2 banner lỗi**
  cùng lúc, nên `expectErrorMessage()` dùng `.filter({ hasText })` thay vì match toàn bộ locator.
- Server **trim** giá trị nhập, nên mật khẩu toàn khoảng trắng bị coi là rỗng (`field is required`)
  chứ không phải sai mật khẩu.
- Form không có thuộc tính `required` phía HTML → validation chạy ở server, test phải chờ điều hướng.

## 7. Mở rộng

Thêm một trang mới:

1. Tạo `src/pages/YourPage.ts` kế thừa `BasePage`, khai báo `path` và các `Locator`.
2. Đăng ký vào `src/fixtures/pages.fixture.ts`.
3. Viết spec trong `tests/<feature>/`, dùng `test.use({ storageState: ADMIN_STORAGE_STATE })`
   nếu cần trạng thái đã đăng nhập.

## 8. Báo cáo & debug

- HTML report: `playwright-report/` (`npm run report`)
- JUnit XML: `test-results/junit.xml` (dùng cho CI)
- Khi test fail: tự động lưu screenshot, video và trace trong `test-results/`
- Xem trace: `npx playwright show-trace test-results/<tên-test>/trace.zip`
---------Thanh Huong
