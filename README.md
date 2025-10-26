# 🧩 Zero-Trust API Proxy — Envoy + mTLS Demo

Dự án minh họa mô hình **Zero-Trust API Authentication** sử dụng **Envoy Proxy**, **mTLS (mutual TLS)**, và **Node.js backend**.  
Người dùng chỉ có thể truy cập API khi trình bày **chứng chỉ client hợp lệ**.

---

## 🚀 Quick Start

```bash
# 1️⃣ Clone repo từ GitHub
git clone https://github.com/TaiTranTrongNgoc/zero-trust-demo.git
cd zero-trust-demo

# 2️⃣ Giải nén chứng chỉ sẵn có (nếu cần)
unzip tls.zip -d envoy/

# 3️⃣ Khởi chạy Envoy + Backend
docker compose up -d

# 4️⃣ Kiểm tra trạng thái container
docker ps

# 5️⃣ Kiểm thử API mTLS
curl -vk \
  --cert ./envoy/tls/client.crt \
  --key ./envoy/tls/client.key \
  --cacert ./envoy/tls/ca.crt \
  https://localhost:8443/api/data
📁 1. Cấu trúc thư mục
css
Copy code
zero-trust-demo/
├── docker-compose.yml
├── envoy/
│   ├── envoy.yaml
│   └── tls/                # Chứa chứng chỉ và khóa (đã cấp sẵn)
│       ├── ca.crt
│       ├── ca.key
│       ├── server.crt
│       ├── server.key
│       ├── client.crt
│       ├── client.key
│       └── ...
├── backend/
│   ├── index.js            # Server Node.js backend
│   └── package.json
└── tls.zip                 # Bản nén sẵn của thư mục tls/
⚙️ 2. Chuẩn bị môi trường
Yêu cầu:

Docker ≥ 20.x

Docker Compose ≥ 2.x

curl để kiểm thử mTLS

Node.js (nếu muốn chạy backend ngoài Docker)

🧱 3. Giải nén chứng chỉ (tùy chọn)
bash
Copy code
unzip tls.zip -d envoy/
Nếu bạn muốn tự tạo chứng chỉ mới, xem phần phụ lục phía dưới.

🧱 4. Khởi chạy hệ thống
bash
Copy code
docker compose up -d
Kiểm tra trạng thái container:

bash
Copy code
docker ps
🔒 5. Kiểm thử mTLS truy cập API
bash
Copy code
curl -vk \
  --cert ./envoy/tls/client.crt \
  --key ./envoy/tls/client.key \
  --cacert ./envoy/tls/ca.crt \
  https://localhost:8443/api/data
Kết quả mong đợi:

json
Copy code
{
  "message": "Secure data from backend ✅"
}
Nếu bạn bỏ --cert hoặc --key, Envoy sẽ từ chối kết nối.

🧩 6. Cấu hình chính
backend/index.js
js
Copy code
const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  res.json({ message: "Secure data from backend ✅" });
});

app.listen(3000, () => console.log('Backend running on port 3000'));
envoy/envoy.yaml
Lắng nghe HTTPS trên cổng 8443

Bắt buộc client certificate (mTLS)

Chuyển tiếp request /api/* đến backend container

🧩 7. Truy cập giao diện quản trị Envoy (tùy chọn)
bash
Copy code
http://localhost:9901
Xem cluster, listener, endpoint

Thống kê traffic & handshake mTLS

🧹 8. Dừng và xóa container
bash
Copy code
docker compose down
📦 Phụ lục — Tạo chứng chỉ thủ công (tùy chọn)
bash
Copy code
cd envoy/tls

# 1️⃣ Tạo CA
openssl req -x509 -newkey rsa:2048 -keyout ca.key -out ca.crt -days 365 \
  -subj "/CN=ZeroTrustCA" -nodes

# 2️⃣ Server cert
openssl req -newkey rsa:2048 -keyout server.key -out server.csr \
  -subj "/CN=envoy.local" -nodes
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
  -out server.crt -days 365 -CAcreateserial

# 3️⃣ Client cert
openssl req -newkey rsa:2048 -keyout client.key -out client.csr \
  -subj "/CN=trusted-client" -nodes
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key \
  -out client.crt -days 365 -CAcreateserial
🧠 Ghi chú kỹ thuật
mTLS: Xác thực cả client và server

Envoy: Zero-Trust API Gateway, chỉ forward khi TLS handshake hợp lệ

Có thể mở rộng thêm Token-based Auth (DPoP / PoP)

👨‍💻 Tác giả
Zero-Trust API Authentication — Capstone Project
Môn: NT2205 - Cryptography
Tác giả: [Tên của bạn]

✅ Quick Test Summary
Thành phần	Cổng	Mục đích	Trạng thái
Envoy Proxy	8443	HTTPS Gateway (mTLS)	✅
Backend	3000	Node.js API	✅
Admin Port	9901	Envoy Dashboard	✅

📦 Nếu muốn chạy nhanh mà không tạo chứng chỉ, chỉ cần:

bash
Copy code
unzip tls.zip -d envoy/
docker compose up -d
curl -vk --cert envoy/tls/client.crt --key envoy/tls/client.key --cacert envoy/tls/ca.crt https://localho