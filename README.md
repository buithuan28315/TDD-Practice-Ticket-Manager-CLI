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
- JSON

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

## Cấu trúc Project

```text
ticket-manager-cli/
├── .github/
│   └── workflows/
│       └── ci.yml
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
Git Push / Pull Request
        ↓
GitHub Actions
        ↓
npm ci
        ↓
npm test
        ↓
npx tsc --noEmit
        ↓
PASS / FAIL
```

## AI-Assisted Development

AI được sử dụng xuyên suốt quá trình phát triển để hỗ trợ nghiên cứu, viết test, debug, refactor và phân tích thiết kế.

Ngoài ChatGPT, GitHub Copilot và Claude cũng được sử dụng để **so sánh các phương án**. Tôi thường hỏi lại nhiều lần về lý do lựa chọn, ưu nhược điểm, trade-off, độ phù hợp với yêu cầu hiện tại và khả năng sửa đổi, mở rộng trong tương lai.

Các đề xuất của AI không được áp dụng trực tiếp mà được kiểm chứng bằng **TDD, Jest, TypeScript checking, chạy thử CLI, manual verification và code review** trước khi quyết định sử dụng.

## Mục tiêu Week 2

* Thực hành TDD và Red - Green - Refactor
* Xây dựng CLI bằng TypeScript
* Unit Test và Integration Test
* Validation và xử lý lỗi
* Lưu trữ dữ liệu bằng JSON
* Sử dụng TypeScript với type rõ ràng
* Sử dụng AI có kiểm soát
* Thiết lập Continuous Integration

## Dự định mở rộng ở Week 3

Week 3 dự kiến mở rộng project để tích hợp với Knowledge Base API.

Kiến trúc dự kiến:

```text
CLI
 ↓
KBClient
 ├── MockKBClient
 └── HTTPKBClient
          ↓
        KB API
```

Nếu phạm vi cho phép, có thể mở rộng thêm Angular Frontend:

```text
Angular ──┐
          ├──> KB API
CLI ──────┘
```

