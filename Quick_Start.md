# Zero-Trust API Demo — Quick Start

```bash
# 1️⃣ Clone repo
git clone https://github.com/TaiTranTrongNgoc/zero-trust-demo.git
cd zero-trust-demo

# 2️⃣ Khởi chạy Envoy + Backend
docker compose up -d

# 3️⃣ Kiểm thử API mTLS
curl -vk \
  --cert ./envoy/tls/client.crt \
  --key ./envoy/tls/client.key \
  --cacert ./envoy/tls/ca.crt \
  https://localhost:8443/api/data
Kết quả mong đợi:

json
Copy code
{ "message": "Secure data from backend ✅" }