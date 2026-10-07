````md
# Ticket Manager CLI

Ứng dụng CLI đơn giản để quản lý Ticket, được xây dựng bằng TypeScript, Node.js và Jest.

Project được phát triển theo phương pháp **Test-Driven Development (TDD)** với quy trình **Red - Green - Refactor**.

## Công nghệ

- TypeScript
- Node.js
- Jest
- ts-jest
- tsx
- Express để cung cấp Knowledge Base API
- MongoDB để lưu trữ Knowledge Base
- JSON để lưu trữ Ticket cục bộ

## Cài đặt

```bash
npm install
````

## Kiểm thử

Chạy toàn bộ test:

```bash
npm test
```

Chạy test riêng:

```bash
npm test -- ticket.test.ts
npm test -- storage.test.ts
npm test -- cli.test.ts
npm test -- index.test.ts
```

Project sử dụng Jest với `--runInBand` để tránh các test cùng truy cập file JSON đồng thời.

## Chạy CLI

```bash
npm run cli -- <command>
```

### Tạo Ticket

```bash
npm run cli -- tickets create "<title>" "<description>" <status> <priority> <tags>
```

Ví dụ:

```bash
npm run cli -- tickets create "Fix login bug" "Users cannot login" open high bug,login
```

Ticket ID được tự động tạo:

```text
TKT-001
TKT-002
TKT-003
...
```

### Xem danh sách

```bash
npm run cli -- tickets list
```

### Lọc Ticket

Theo status:

```bash
npm run cli -- tickets list --status open
```

Theo priority:

```bash
npm run cli -- tickets list --priority high
```

Theo tag:

```bash
npm run cli -- tickets list --tag bug
```

Có thể kết hợp nhiều điều kiện:

```bash
npm run cli -- tickets list --status open --priority high --tag bug
```

Có thể truyền nhiều tag:

```bash
npm run cli -- tickets list --tag bug,login
```

Các filter khác nhau được kết hợp theo điều kiện AND. Các tag trong cùng một `--tag` được xử lý theo điều kiện OR.

### Xem Ticket

```bash
npm run cli -- tickets show TKT-001
```

Ticket ID không phân biệt chữ hoa và chữ thường:

```bash
npm run cli -- tickets show tkt-001
```

### Cập nhật trạng thái

```bash
npm run cli -- tickets update TKT-001 close
```

Status hợp lệ:

```text
open
close
```

Ticket ID không phân biệt chữ hoa và chữ thường.

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
├── .github/
│   └── workflows/
│       └── ci.yml
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
├── package-lock.json
├── jest.config.js
├── tsconfig.json
├── .gitignore
└── README.md
```

## Configuration

No configuration is required.

Dữ liệu được lưu trữ cục bộ tại:

```text
data/tickets.json
```

Không cần database hoặc service bên ngoài.

## TDD

Project áp dụng quy trình:

```text
RED
Viết test và đảm bảo test thất bại
        ↓
GREEN
Viết code tối thiểu để test pass
        ↓
REFACTOR
Cải thiện code nhưng vẫn giữ test pass
```

Các thay đổi được thực hiện từng bước và kiểm chứng bằng test.

## Kiểm thử

### Unit Test

`tests/ticket.test.ts`

Kiểm tra validation và business logic của Ticket.

### Storage Test

`tests/storage.test.ts`

Kiểm tra:

* Lưu và đọc Ticket
* File JSON không tồn tại
* File JSON bị lỗi
* Cập nhật Ticket
* Ticket không tồn tại

Storage test sử dụng file dữ liệu được truyền vào để hạn chế phụ thuộc vào file dữ liệu mặc định.

### CLI Test

`tests/cli.test.ts`

Kiểm tra:

* Create
* List
* Show
* Update
* Filter theo status, priority và tag
* Kết hợp nhiều filter
* Validation khi update

### Integration Test

`tests/index.test.ts`

Chạy CLI thực tế và kiểm tra output từ command.

## Xử lý lỗi

Ứng dụng xử lý:

* Thiếu thông tin bắt buộc
* Status không hợp lệ
* Priority không hợp lệ
* Tags không hợp lệ
* Ticket không tồn tại
* File JSON không tồn tại
* File JSON bị lỗi hoặc không đúng định dạng

Ví dụ:

```bash
npm run cli -- tickets show TKT-999
```

```text
Ticket not found
```

## TypeScript

Kiểm tra TypeScript:

```bash
npx tsc --noEmit
```

## Continuous Integration

Project sử dụng **GitHub Actions** để tự động chạy test và kiểm tra TypeScript khi có Push hoặc Pull Request.

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
