# 2025cloud 🚀

使用 GitHub Actions + Docker Hub 的最小範例：  
當程式碼推到 `main` 便自動打包成 Container Image 並推送到 **juliecys/2025cloud**，供任何環境直接拉取執行。

---

## 前置需求

| 工具 | 版本建議 | 用途 |
|------|----------|------|
| Docker Desktop / Engine | ≥ 23.x | 本機 Build / Run Image |
| Git | ≥ 2.30 | 版本控制、推送至 GitHub |

---

## Quick Start

### 1 Build — 打包成 Container Image
```bash
docker build -t juliecys/2025cloud:local .
````

> `docker build` 會讀取專案根目錄的 **Dockerfile**。
> 完成後於 `docker images` 可看到 `juliecys/2025cloud:local`。

### 2 Run — 在本機執行剛打好的 Image

```bash
docker run --rm -p 3000:3000 juliecys/2025cloud:local
# 瀏覽器開 http://localhost:3000
```

> `-p 3000:3000` 把容器內的 3000 埠映射到主機，瀏覽器即可看到 **Hello 2025cloud**。

---

## 直接從 Docker Hub 取得最新映像

若不想本機 Build，可直接拉取 CI 產製的 *latest* 版本：

```bash
docker pull juliecys/2025cloud:latest
docker run --rm -p 3000:3000 juliecys/2025cloud:latest
```

---

## 開發—熱重載 (可選)

```bash
# 監看檔案自動重啟
docker run --rm -p 3000:3000 -v $(pwd):/app \
  --entrypoint sh juliecys/2025cloud:local -c "npm i -g nodemon && nodemon server.js"
```

---

## CI/CD 流程

```mermaid
graph LR
  A[Push / PR] --> B[GitHub Actions] --> C[docker buildx build]
  C --> D[docker login<br/>(Secrets)]
  D --> E[docker push<br/>to Docker Hub:<br/>juliecys/2025cloud]
```

### Tag 策略

| 來源行為                      | 產生 Tag               | 目的                          |
| ------------------------- | -------------------- | --------------------------- |
| `main` push               | `latest`, `sha-<7碼>` | `latest` 供一般使用；`sha` 便於回溯   |
| Pull Request              | *(只 build，不推)*       | 驗證能否成功 Build，不污染正式 registry |
| 手動 Git tag `v*.*.*` (未啟用) | `vX.Y.Z`, `latest`   | 未來可用於發行版本                   |

Workflow 主要使用三個 Action：

1. **`docker/login-action`** → 讀取 Secrets (`DOCKER_USERNAME / DOCKER_PASSWORD`) 登入 Docker Hub
2. **`docker/metadata-action`** → 自動產生 `latest` + `sha-*` Tag
3. **`docker/build-push-action`** → Build & Push Image

---

## 專案結構 (精簡)

```
.
├── Dockerfile
├── server.js            # 最小 Node.js HTTP 伺服器
├── README.md
└── .github/
    └── workflows/
        └── docker.yml   # CI 配置
```

---

## 常見問題

| 症狀                                                   | 排查方向                                             |
| ---------------------------------------------------- | ------------------------------------------------ |
| `no basic auth credentials`                          | 確認 GitHub Secrets 名稱正確、`docker/login-action` 未遺漏 |
| `denied: requested access to the resource is denied` | Docker Hub repo 是否 Public？ `images:` 行帳號拼字正確？    |
| CI 綠燈但 Docker Hub 沒 tag                              | YAML 條件 `push:` 可能被限制在特定分支；將 `push: true` 可強制上傳  |

---

## License

MIT
