# Ticket Manager CLI

Ứng dụng CLI đơn giản để quản lý Ticket, được xây dựng bằng TypeScript và Jest.

Project được phát triển theo phương pháp **Test-Driven Development (TDD)** với quy trình **Red - Green - Refactor**.

## Công nghệ sử dụng

- TypeScript
- Node.js
- Jest
- ts-jest
- tsx
- Express để cung cấp Knowledge Base API
- MongoDB để lưu trữ Knowledge Base
- JSON để lưu trữ Ticket cục bộ

## Cài đặt

Cài đặt các package cần thiết:

```bash
npm install
````

## Chạy kiểm thử

Chạy toàn bộ test:

```bash
npm test
```

```bash
npm test -- ticket.test.ts
```

```bash
npm test -- storage.test.ts
```

```bash
npm test -- cli.test.ts
```

```bash
npm test -- index.test.ts
```

Project sử dụng Jest với `--runInBand` để tránh các test cùng truy cập file JSON đồng thời.

## Chạy CLI

CLI được chạy bằng:

```bash
npm run cli -- <command>
```

## Hướng dẫn sử dụng

### 1. Tạo Ticket

Cú pháp:

```bash
npm run cli -- tickets create "<title>" "<description>" <status> <priority> <tags>
```

Ví dụ:

```bash
npm run cli -- tickets create "Fix login bug" "Users cannot login" open high bug,login
```

Kết quả:

```text
✓ Ticket created successfully

ID:          TKT-001
Title:       Fix login bug
Description: Users cannot login
Status:      open
Priority:    high
Tags:        bug, login
```

Có thể tạo thêm Ticket:

```bash
npm run cli -- tickets create "Fix logout bug" "Users cannot logout" open medium bug,logout
```

```bash
npm run cli -- tickets create "Add dashboard" "Create dashboard page" open low feature,dashboard
```

```bash
npm run cli -- tickets create "Update profile" "Allow users to update profile" open medium feature,profile
```

ID của Ticket được tự động tạo theo thứ tự:

```text
TKT-001
TKT-002
TKT-003
TKT-004
```

### 2. Xem danh sách Ticket

```bash
npm run cli -- tickets list
```

Ví dụ:

```text
Tickets:

TKT-001 | Fix login bug | open | high | bug, login
TKT-002 | Fix logout bug | open | medium | bug, logout
TKT-003 | Add dashboard | open | low | feature, dashboard
TKT-004 | Update profile | open | medium | feature, profile
```

### 3. Xem thông tin một Ticket

Cú pháp:

```bash
npm run cli -- tickets show <ticket-id>
```

Ví dụ:

```bash
npm run cli -- tickets show TKT-001
```

Kết quả:

```text
Ticket details

ID:          TKT-001
Title:       Fix login bug
Description: Users cannot login
Status:      open
Priority:    high
Tags:        bug, login
```

Ticket ID không phân biệt chữ hoa và chữ thường:

```bash
npm run cli -- tickets show tkt-001
```

### 4. Cập nhật trạng thái Ticket

Cú pháp:

```bash
npm run cli -- tickets update <ticket-id> <status>
```

Ví dụ:

```bash
npm run cli -- tickets update TKT-001 close
```

Kết quả:

```text
✓ Ticket updated successfully

ID:          TKT-001
Title:       Fix login bug
Description: Users cannot login
Status:      close
Priority:    high
Tags:        bug, login
```

Ticket ID không phân biệt chữ hoa và chữ thường:

```bash
npm run cli -- tickets update tkt-001 close
```

### 5. Kiểm tra Ticket sau khi cập nhật

Sau khi update, có thể sử dụng `show` để kiểm tra:

```bash
npm run cli -- tickets show TKT-001
```
Ticket ID không phân biệt chữ hoa và chữ thường

Hoặc xem toàn bộ danh sách:

```bash
npm run cli -- tickets list
```

## Quy trình sử dụng cơ bản

Một workflow đơn giản:

### Bước 1: Tạo Ticket

```bash
npm run cli -- tickets create "Fix login bug" "Users cannot login" open high bug,login
```

### Bước 2: Xem danh sách

```bash
npm run cli -- tickets list
```

### Bước 3: Xem chi tiết

```bash
npm run cli -- tickets show TKT-001
```

### Bước 4: Cập nhật trạng thái

```bash
npm run cli -- tickets update TKT-001 close
```

### Bước 5: Kiểm tra lại

```bash
npm run cli -- tickets show TKT-001
```

## Các chức năng CLI

### Tạo Ticket

```bash
npm run cli -- tickets create "<title>" "<description>" <status> <priority> <tags>
```

### Danh sách Ticket

```bash
npm run cli -- tickets list
```

### Xem Ticket

```bash
npm run cli -- tickets show <ticket-id>
```

### Cập nhật trạng thái

```bash
npm run cli -- tickets update <ticket-id> <status>
```

## Knowledge Base CLI

Các lệnh KB mặc định dùng mock client trong bộ nhớ:

```powershell
npm run cli -- kb search response --top-k 3
npm run cli -- kb list --node /templates/email --limit 10
npm run cli -- kb retrieve KB-003
npm run cli -- kb add --file .\new-template.md --path /templates/email --tags template,email
```

Mock client là mặc định và giữ dữ liệu trong bộ nhớ. Để dùng API với MongoDB, tạo file `.env` từ mẫu rồi cấu hình URI MongoDB:

```powershell
Copy-Item .env.example .env
```

Chỉnh `MONGODB_URI`, `MONGODB_DATABASE` và `MONGODB_COLLECTION` trong `.env`. File `.env` đã được ignore bởi Git; chỉ commit `.env.example` và không đưa credentials thật vào source hoặc lịch sử Git. Mở terminal thứ nhất để chạy API:

```powershell
npm run api
```

Trong terminal thứ hai, chọn HTTP client và gọi API. `KB_API_URL` mặc định là `http://localhost:3000`; `--title` là tùy chọn, nếu bỏ qua thì tên file được dùng làm title:

```powershell
$env:KB_CLIENT = "http"
$env:KB_API_URL = "http://localhost:3000"
npm run cli -- kb add --file .\new-template.md --path /templates/email --title "Customer Email Template" --tags template,email
```

HTTP client hỗ trợ cùng các filter search `--node` và `--tags` như mock client. API áp dụng node path chính xác và khớp bất kỳ tag nào được yêu cầu. File path của lệnh `kb add` được tính từ thư mục hiện tại của terminal.

## Cấu trúc Project

```text
ticket-manager-cli/
├── src/
│   ├── api.ts
│   ├── http-kb-client.ts
│   ├── kb-cli.ts
│   ├── kb-client-factory.ts
│   ├── kb.ts
│   ├── mock-kb-client.ts
│   ├── mongodb.ts
│   ├── server.ts
│   ├── ticket.ts
│   ├── storage.ts
│   ├── cli.ts
│   └── index.ts
├── tests/
│   ├── api.test.ts
│   ├── http-kb-client.test.ts
│   ├── kb-e2e.test.ts
│   ├── kb-client-factory.test.ts
│   ├── mock-kb-client.test.ts
│   ├── mongodb.test.ts
│   ├── ticket.test.ts
│   ├── storage.test.ts
│   ├── cli.test.ts
│   └── index.test.ts
├── data/
│   └── tickets.json
├── .env.example
├── package.json
├── jest.config.js
├── tsconfig.json
└── README.md
```

## Quy trình TDD

Project áp dụng quy trình **Red - Green - Refactor**.

### 1. Red

Viết test trước và đảm bảo test thất bại.

### 2. Green

Viết code tối thiểu cần thiết để test pass.

### 3. Refactor

Cải thiện cấu trúc code trong khi vẫn đảm bảo các test tiếp tục pass.

Quy trình:

```text
RED
Test thất bại
   ↓
GREEN
Viết code để test pass
   ↓
REFACTOR
Cải thiện code
```

## Xử lý lỗi

Ứng dụng xử lý các trường hợp:

* Thiếu thông tin bắt buộc của Ticket
* Status không hợp lệ
* Priority không hợp lệ
* Tags không hợp lệ
* Ticket không tồn tại
* File JSON không tồn tại
* File JSON bị lỗi hoặc không đúng định dạng

Ví dụ khi Ticket không tồn tại:

```bash
npm run cli -- tickets show TKT-999
```

Kết quả:

```text
Ticket not found
```

## Chiến lược kiểm thử

Project sử dụng nhiều loại test khác nhau.

### Unit Test

File:

```text
tests/ticket.test.ts
```

Kiểm tra validation và business logic của Ticket.

### Storage Test

File:

```text
tests/storage.test.ts
```

Kiểm tra:

* Lưu Ticket
* Đọc Ticket
* File JSON không tồn tại
* File JSON bị lỗi

### CLI Test

File:

```text
tests/cli.test.ts
```

Kiểm tra behavior của các command thông qua các function xử lý CLI.

### Integration Test

File:

```text
tests/index.test.ts
```

Chạy CLI thực tế và kiểm tra output trả về từ command.

### Knowledge Base end-to-end test

File:

```text
tests/kb-e2e.test.ts
```

Chạy lệnh CLI qua HTTP client, HTTP server/API và repository trong bộ nhớ. Test dùng cổng localhost ngẫu nhiên và không cần MongoDB đang chạy.

### MongoDB tests

File:

```text
tests/mongodb.test.ts
```

Kiểm tra tạo ID tuần tự và bộ lọc truy vấn MongoDB. Để kiểm tra kết nối với MongoDB đã cấu hình, chạy `npm run mongo:test`.

## Lưu trữ dữ liệu

Dữ liệu Ticket được lưu trữ cục bộ tại:

```text
data/tickets.json
```

Không cần database bên ngoài.

Knowledge Base dùng mock client trong bộ nhớ khi chạy CLI mặc định. Khi chọn HTTP client, API lưu Knowledge Base trong MongoDB.

File JSON có dạng:

```json
[
  {
    "id": "TKT-001",
    "title": "Fix login bug",
    "description": "Users cannot login",
    "status": "open",
    "priority": "high",
    "tags": [
      "bug",
      "login"
    ]
  }
]
```

## Week 3: Knowledge Base API đã hoàn thành

Project hiện bao gồm:

* CLI Knowledge Base cho search, list, retrieve và add.
* `MockKBClient` cho phát triển và kiểm thử không cần dịch vụ ngoài.
* `HTTPKBClient` kết nối với Express API; search filter được hỗ trợ nhất quán trên cả mock và HTTP.
* API search/list/retrieve/add dùng repository interface; MongoDB là repository mặc định của API.
* Kiểm thử unit, API, HTTP client, end-to-end CLI → HTTP client → API → repository và các truy vấn MongoDB.

Kiến trúc hiện tại:

```text
CLI ── KBClient ──┬── MockKBClient (in-memory)
                  └── HTTPKBClient ── Express API ── KBRepository ── MongoDB
