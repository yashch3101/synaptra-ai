# Synaptra AI

**Synaptra AI** is a microservices-based, multi-agent AI workspace built with React, Node.js, and LangGraph. It combines intelligent prompt routing across eight specialized agents (conversational AI, live web search, multi-file code generation with sandboxed preview, PDF/PPT synthesis, image generation, multimodal image analysis, and PDF RAG) with Redis session caching, MongoDB persistence, AWS S3 asset storage, and Razorpay credit billing.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-1C3C3C?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Persistence-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Sessions%20%26%20Cache-DC382D?style=flat-square&logo=redis&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-Presigned%20URLs-569A31?style=flat-square&logo=amazons3&logoColor=white)

---

## Core Capabilities

- **Multi-Agent Orchestration:** Automatic intent detection or manual routing via LangGraph across eight specialized agents (`chat`, `search`, `coding`, `pdf`, `ppt`, `vision`, `imageAnalyzer`, `pdfRag`).
- **Interactive Coding Workspace:** Generates multi-file HTML, CSS, and JavaScript projects rendered inside Monaco Editor with a live, sandboxed browser preview (`sandbox="allow-scripts"`).
- **Multimodal File Intelligence:** Supports `multipart/form-data` uploads (up to 20 MB) for vision-based image analysis and vector-backed PDF Q&A using Google embeddings and Qdrant.
- **Document & Media Synthesis:** Builds formatted PDFs (`PDFKit`), 6-slide presentations (`PptxGenJS`), and AI-generated images delivered via expiring AWS S3 presigned URLs.
- **Real-Time Web Search:** Enriches conversational responses with live web search results and visual context via Tavily.
- **Microservices Architecture:** Decoupled API Gateway (`:8000`) handling authentication, rate limiting, and reverse proxying to Auth (`:8001`), Chat (`:8002`), Agent (`:8003`), and Billing (`:8004`) services.
- **Credit-Based Billing:** Integrated Razorpay order creation, server-side HMAC-SHA256 signature verification, and automated credit allocation.

---

## System Architecture

```text
                        +---------------------------+
                        |     React 19 Frontend     |
                        |  (Vite / Redux / Monaco)  |
                        +-------------+-------------+
                                      | HTTP + Session Cookie
                                      v
                        +---------------------------+
                        |    API Gateway (:8000)    |
                        |   (Auth & x-user-id Proxy)|
                        +--+----+-----+------+---+--+
                           |    |     |      |   |
        +------------------+    |     |      |   +------------------+
        v                       v     |      v                      v
+---------------+   +---------------+ | +---------------+   +---------------+
| Auth (:8001)  |   | Chat (:8002)  | | | Agent (:8003) |   |Billing (:8004)|
+-------+-------+   +-------+-------+ | +-------+-------+   +-------+-------+
        |                   |         |         |                   |
        +---------+---------+         |         +---------+---------+
                  |                   |                   |
                  v                   v                   v
        +-----------------------------------------------------------+
        |               Infrastructure & External APIs              |
        |   MongoDB (Data) | Redis (Sessions/Limits) | AWS S3       |
        |   Firebase Auth  | Groq / Gemini / OpenRouter | Qdrant    |
        |   Tavily Search  | Pollinations               | Razorpay  |
        +-----------------------------------------------------------+
```

---

## Multi-Agent Routing & Rate Limits

When `agent=auto` is selected, uploaded PDFs route to `pdfRag`, uploaded images route to `imageAnalyzer`, and text prompts are classified by the LangGraph router.

| Agent | Trigger / Mode | Credits | Rate Limit | Execution Pipeline |
| :--- | :--- | :---: | :---: | :--- |
| `chat` | General queries | 1 | 20 / min | Groq LLM with Redis/MongoDB conversation memory |
| `search` | Web lookup | 5 | 5 / min | Tavily web search (top 5 results + images) synthesized by chat |
| `coding` | Code / Projects | 10 | 5 / min | Groq intent detection; multi-file JSON rendered in Monaco + iframe |
| `pdf` | PDF generation | 10 | 5 / min | Structured JSON layout rendered via `PDFKit` and uploaded to S3 |
| `ppt` | Deck generation | 10 | 5 / min | 6-slide presentation built with `PptxGenJS` and uploaded to S3 |
| `vision` | Image synthesis | 10 | 5 / min | Prompt enhancement via Groq + image generation via Pollinations |
| `imageAnalyzer` | Image upload | 10 | 5 / min | Base64 multimodal analysis via OpenRouter vision models |
| `pdfRag` | PDF upload | 10 | 5 / min | `pdf-parse` + recursive chunking + Google embeddings + Qdrant search |

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Redux Toolkit, Tailwind CSS 4, Axios, Monaco Editor, Motion, React Markdown (`remark-gfm`), Lucide React |
| **Gateway & Services** | Node.js (ES Modules), Express 5, `express-http-proxy`, Multer, Morgan, Docker Compose |
| **AI & Vector Search** | LangChain, LangGraph, Groq, Google Generative AI, OpenRouter, Tavily, Pollinations, Qdrant |
| **Storage & Auth** | MongoDB (Mongoose), Redis (`ioredis`), AWS SDK v3 (S3), Firebase Authentication & Firebase Admin SDK |
| **Docs & Payments** | PDFKit, PptxGenJS, `pdf-parse`, Razorpay |

---

## Project Structure

```text
Synaptra_AI/
├── frontend/                     # React 19 + Vite client (:5173)
│   ├── src/
│   │   ├── components/           # ChatArea, ChatInput, SideBar, Artifact, BillingDrawer
│   │   ├── features/             # API service modules (auth, chat, agent, billing)
│   │   ├── pages/                # Route views
│   │   └── redux/                # Store and state slices
│   └── utils/                    # Axios instance & Firebase client config
└── backend/
    ├── gateway/                  # API Gateway, CORS, Redis session & proxy middleware (:8000)
    ├── services/
    │   ├── auth/                 # Firebase token verification & Redis session creation (:8001)
    │   ├── chat/                 # Conversation and message persistence (:8002)
    │   ├── agent/                # LangGraph router, 8 agents, Multer & S3 utilities (:8003)
    │   └── billing/              # Razorpay order creation & HMAC verification (:8004)
    ├── shared/redis/             # Shared ioredis client
    └── docker-compose.yml        # Local Redis container configuration
```

---

## Quick Start

### 1. Prerequisites

- **Node.js** v20+ and **npm**
- **MongoDB** (local instance or Atlas)
- **Docker** (for Redis) and **Qdrant** (for PDF RAG)
- Credentials for **Firebase**, **AWS S3**, **Razorpay**, **Groq**, **Google AI**, **OpenRouter**, **Tavily**, and **Pollinations**

### 2. Install Dependencies

```bash
git clone <repository-url>
cd Synaptra_AI

npm --prefix frontend install
npm --prefix backend/gateway install
npm --prefix backend/services/auth install
npm --prefix backend/services/chat install
npm --prefix backend/services/agent install
npm --prefix backend/services/billing install
```

### 3. Environment Configuration

Create `.env` files in each service directory using the templates below:

<details>
<summary><strong>Expand Environment Templates</strong></summary>

#### `frontend/.env`
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=<firebase-web-api-key>
VITE_RAZORPAY_KEY_ID=<razorpay-key-id>
```

#### `backend/gateway/.env`
```env
PORT=8000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6381
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
BILLING_SERVICE=http://localhost:8004
```

#### `backend/services/auth/.env`
*(Place your Firebase Admin JSON at `backend/services/auth/serviceAccountKey.json`)*
```env
PORT=8001
MONGODB_URI=mongodb://127.0.0.1:27017/synaptra_auth
REDIS_URL=redis://localhost:6381
```

#### `backend/services/chat/.env`
```env
PORT=8002
MONGODB_URI=mongodb://127.0.0.1:27017/synaptra_chat
```

#### `backend/services/agent/.env`
```env
PORT=8003
MONGODB_URI=mongodb://127.0.0.1:27017/synaptra_agent
REDIS_URL=redis://localhost:6381
CHAT_SERVICE=http://localhost:8002
AUTH_SERVICE=http://localhost:8001

GROQ_API_KEY=<groq-api-key>
GOOGLE_API_KEY=<google-ai-api-key>
OPENROUTER_API_KEY=<openrouter-api-key>
TAVILY_API_KEY=<tavily-api-key>
POLLINATIONS_API_KEY=<pollinations-api-key>

AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<aws-secret-access-key>
AWS_BUCKET_NAME=<aws-s3-bucket-name>

QDRANT_URL=http://localhost:6333
```

#### `backend/services/billing/.env`
```env
PORT=8004
MONGODB_URI=mongodb://127.0.0.1:27017/synaptra_billing
AUTH_SERVICE=http://localhost:8001
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```
</details>

### 4. Run Locally

```bash
# 1. Start Redis (exposes port 6381)
cd backend && docker compose up -d

# 2. Start Gateway and Microservices (in separate terminals)
npm --prefix backend/gateway run dev          # :8000
npm --prefix backend/services/auth run dev     # :8001
npm --prefix backend/services/chat run dev     # :8002
npm --prefix backend/services/agent run dev    # :8003
npm --prefix backend/services/billing run dev  # :8004

# 3. Start Frontend
npm --prefix frontend run dev                  # :5173
```

---

## API Reference

All client requests route through the API Gateway (`http://localhost:8000`). Protected routes authenticate via an HTTP-only Redis session cookie and forward `x-user-id` downstream.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | No | Verify Firebase ID token and initialize Redis session |
| `GET` | `/api/auth/logout` | No | Destroy Redis session and clear session cookie |
| `GET` | `/api/me` | Yes | Fetch authenticated user profile and credit balance |
| `GET` | `/api/chat/create-conversation` | Yes | Create a new conversation thread |
| `GET` | `/api/chat/get-conversations` | Yes | List conversations for the active user |
| `POST` | `/api/chat/update-conversation` | Yes | Rename an existing conversation |
| `POST` | `/api/chat/save-message` | Yes | Persist a user or assistant message |
| `GET` | `/api/chat/get-messages/:conversationId` | Yes | Retrieve message history for a conversation |
| `POST` | `/api/agent/chat` | Yes | Dispatch prompt + optional `file` (`multipart/form-data`, max 20 MB) to LangGraph |
| `POST` | `/api/billing/create` | Yes | Create a Razorpay order for a selected credit tier |
| `POST` | `/api/billing/verify` | Yes | Verify Razorpay HMAC signature and add credits |

### Credit Billing Plans

| Plan | Price | Credits | Validity |
| :--- | :---: | :---: | :---: |
| **Free** | INR 0 | 100 | 30 Days |
| **Starter** | INR 199 | 500 | 30 Days |
| **Pro** | INR 499 | 1,000 | 30 Days |

---

## Security & Production Checklist

- **Credential Management:** Keep `.env` files and `serviceAccountKey.json` out of version control; store secrets in a managed vault in production.
- **Transport & Session Security:** Enable `secure: true` on cookies, enforce HTTPS/HSTS at the reverse proxy, and restrict CORS origins to your production frontend domain.
- **Storage & Uploads:** Enforce strict Multer MIME filtering (`PDF` and `images`, max 20 MB), delete temporary uploads immediately post-processing, and serve S3 assets exclusively through short-lived presigned URLs.
- **Service Hardening:** Add `/health` endpoints, structured logging, conversation ownership checks, and idempotency guards on payment verification before deploying behind container orchestration.

---

## License

This project is licensed under the MIT License.