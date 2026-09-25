# Ticket Manager CLI

Ứng dụng CLI đơn giản để quản lý Ticket, được xây dựng bằng TypeScript và Jest.

Project được phát triển theo phương pháp **Test-Driven Development (TDD)** với quy trình **Red - Green - Refactor**.

## Công nghệ sử dụng

- TypeScript
- Node.js
- Jest
- ts-jest
- tsx
- JSON để lưu trữ dữ liệu

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

Chạy riêng từng nhóm test:

```bash
npx jest tests/ticket.test.ts
```

```bash
npx jest tests/storage.test.ts
```

```bash
npx jest tests/cli.test.ts
```

```bash
npx jest tests/index.test.ts
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

## Cấu trúc Project

```text
ticket-manager-cli/
├── src/
│   ├── ticket.ts
│   ├── storage.ts
│   ├── cli.ts
│   └── index.ts
├── tests/
│   ├── ticket.test.ts
│   ├── storage.test.ts
│   ├── cli.test.ts
│   └── index.test.ts
├── data/
│   └── tickets.json
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

## Lưu trữ dữ liệu

Dữ liệu Ticket được lưu trữ cục bộ tại:

```text
data/tickets.json
```

Không cần database bên ngoài.

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

## Mục tiêu Week 2

Mục tiêu chính của project là thực hành:

* Test-Driven Development (TDD)
* Quy trình Red - Green - Refactor
* Unit Test
* Integration Test
* Phát triển CLI
* Lưu trữ dữ liệu bằng JSON
* Kiểm thử các trường hợp lỗi
* Sử dụng AI có kiểm soát trong quá trình phát triển
