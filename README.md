# Synaptra AI

**Synaptra AI** is a microservices-based, multi-agent AI workspace built with React, Node.js, and LangGraph. It features intelligent prompt routing across specialized agents (chat, live web search, full-stack coding artifacts, PDF/PPT generation, and image synthesis), backed by Redis session/memory caching, MongoDB persistence, AWS S3 artifact storage, and Razorpay credit billing.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-1C3C3C?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Persistence-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Sessions%20%26%20Memory-DC382D?style=flat-square&logo=redis&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-Artifact%20Storage-569A31?style=flat-square&logo=amazons3&logoColor=white)

---

## Core Capabilities

- **Multi-Agent Orchestration:** Automatic intent classification or manual routing via LangGraph across six specialized agents (`chat`, `search`, `coding`, `pdf`, `ppt`, `vision`).
- **Interactive Coding Workspace:** Generates multi-file HTML/CSS/JS projects with live in-browser preview powered by Monaco Editor.
- **Document & Media Synthesis:** Produces formatted PDFs (`PDFKit`), PowerPoint decks (`PptxGenJS`), and AI-generated images, served via expiring AWS S3 signed URLs.
- **Real-Time Web Intelligence:** Integrates Tavily search results directly into LLM responses for up-to-date queries.
- **Microservices Architecture:** Decoupled API Gateway (`:8000`) routing traffic to independent Auth (`:8001`), Chat (`:8002`), Agent (`:8003`), and Billing (`:8004`) services.
- **Session & Memory Layer:** HTTP-only Redis-backed authentication via Firebase Admin and low-latency conversation memory caching.
- **Credit-Based Monetization:** Integrated Razorpay checkout with server-side HMAC signature verification and automated credit allocation.

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
        |  MongoDB (Data) | Redis (Sessions/Memory) | AWS S3 (Files)|
        |  Firebase Auth  | Groq / Gemini / OpenRouter | Razorpay   |
        +-----------------------------------------------------------+
```

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS, Axios, Monaco Editor, React Markdown, Lucide React |
| **Backend & Gateway** | Node.js (ES Modules), Express 5, Docker Compose |
| **AI & Orchestration** | LangChain, LangGraph, Groq, Google Gemini, OpenRouter, Tavily Search, Pollinations |
| **Data & Storage** | MongoDB (Mongoose), Redis (`ioredis`), AWS SDK for S3 |
| **Auth, Docs & Billing** | Firebase Admin SDK, PDFKit, PptxGenJS, Razorpay |

---

## Project Structure

```text
Synaptra_AI/
├── frontend/                  # React 19 + Vite client application
│   ├── src/
│   │   ├── components/        # UI components & Monaco Artifact viewer
│   │   ├── features/          # API messaging & async thunks
│   │   ├── pages/             # Route views
│   │   └── redux/             # Store & state slices
│   └── utils/                 # Configured Axios instance
└── backend/
    ├── gateway/               # Reverse proxy, CORS & session middleware (:8000)
    ├── services/
    │   ├── auth/              # Firebase verification & Redis sessions (:8001)
    │   ├── chat/              # Conversation & message persistence (:8002)
    │   ├── agent/             # LangGraph router, LLMs & S3 generators (:8003)
    │   └── billing/           # Razorpay orders & credit management (:8004)
    ├── shared/redis/          # Shared Redis client configuration
    └── docker-compose.yml     # Redis container setup
```

---

## Quick Start

### 1. Prerequisites
- **Node.js** v20+ and **npm**
- **MongoDB** (Atlas cluster or local instance)
- **Docker** (for Redis) or a local Redis server
- API keys for **Firebase**, **AWS S3**, **Razorpay (Test Mode)**, **Tavily**, **Groq**, **Google Gemini**, and **OpenRouter**

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd Synaptra_AI

# Install frontend dependencies
cd frontend && npm install

# Install gateway and microservice dependencies
cd ../backend/gateway && npm install
cd ../services/auth && npm install
cd ../chat && npm install
cd ../agent && npm install
cd ../billing && npm install
```

### 3. Environment Configuration

Create `.env` files in each respective directory using the templates below:

<details>
<summary><strong>Click to expand environment variables for all services</strong></summary>

#### `frontend/.env`
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=<firebase-web-api-key>
VITE_RAZORPAY_KEY_ID=<razorpay-test-key-id>
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
*(Also place your Firebase Admin JSON file at `backend/services/auth/serviceAccountKey.json`)*
```env
PORT=8001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/auth
REDIS_URL=redis://localhost:6381
```

#### `backend/services/chat/.env`
```env
PORT=8002
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/chat
```

#### `backend/services/agent/.env`
```env
PORT=8003
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/agent
CHAT_SERVICE=http://localhost:8002
REDIS_URL=redis://localhost:6381

GROQ_API_KEY=<groq-api-key>
GOOGLE_API_KEY=<google-api-key>
OPENROUTER_API_KEY=<openrouter-api-key>
TAVILY_API_KEY=<tavily-api-key>
POLLINATIONS_API_KEY=<pollinations-api-key>

AWS_REGION=<aws-region>
AWS_ACCESS_KEY_ID=<aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<aws-secret-access-key>
AWS_BUCKET_NAME=<aws-s3-bucket-name>
```

#### `backend/services/billing/.env`
```env
PORT=8004
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/billing
AUTH_SERVICE=http://localhost:8001
RAZORPAY_KEY_ID=<razorpay-test-key-id>
RAZORPAY_KEY_SECRET=<razorpay-test-key-secret>
```
</details>

### 4. Running Locally

Start Redis via Docker Compose, then launch each service in a separate terminal:

```bash
# 1. Start Redis (exposes port 6381)
cd backend && docker compose up -d redis

# 2. Start Microservices & Gateway
cd backend/services/auth && npm run dev      # :8001
cd backend/services/chat && npm run dev      # :8002
cd backend/services/agent && npm run dev     # :8003
cd backend/services/billing && npm run dev   # :8004
cd backend/gateway && npm run dev            # :8000

# 3. Start Frontend
cd frontend && npm run dev                   # :5173
```

---

## API Reference

All client requests route through the API Gateway (`http://localhost:8000`). Protected routes require an active HTTP-only `session` cookie.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | No | Verify Firebase ID token and initialize Redis session |
| `GET` | `/api/auth/logout` | Yes | Destroy current user session |
| `GET` | `/api/me` | Yes | Fetch authenticated user profile and credit balance |
| `GET` | `/api/chat/create-conversation` | Yes | Initialize a new conversation thread |
| `GET` | `/api/chat/get-conversations` | Yes | Retrieve all conversations for the active user |
| `POST` | `/api/chat/update-conversation` | Yes | Rename an existing conversation |
| `POST` | `/api/chat/save-message` | Yes | Persist a user or assistant message |
| `GET` | `/api/chat/get-messages/:conversationId` | Yes | Fetch message history for a conversation |
| `POST` | `/api/agent/chat` | Yes | Dispatch a prompt to the LangGraph multi-agent router |
| `POST` | `/api/billing/create` | Yes | Generate a Razorpay order ID for a credit plan |
| `POST` | `/api/billing/verify` | Yes | Validate payment HMAC signature and credit user account |

---

## Agent Routing & Billing Tiers

### Specialized Agents

| Agent | Provider / Engine | Output Format |
| :--- | :--- | :--- |
| `chat` | Groq | Contextual conversational Markdown |
| `search` | Tavily + Groq | Web-grounded answers with live search context |
| `coding` | OpenRouter | Structured code blocks & runnable frontend artifacts |
| `pdf` | PDFKit + AWS S3 | Formatted document via expiring S3 signed URL |
| `ppt` | PptxGenJS + AWS S3 | Multi-slide `.pptx` deck via expiring S3 signed URL |
| `vision` | Pollinations + AWS S3 | Generated image asset via expiring S3 signed URL |

### Credit Plans

| Plan | Price | Credits | Validity |
| :--- | :---: | :---: | :---: |
| **Free** | INR 0 | 100 | 30 Days |
| **Starter** | INR 199 | 500 | 30 Days |
| **Pro** | INR 499 | 1,000 | 30 Days |

---

## Security & Production Checklist

- **Credential Hygiene:** Never commit `.env` files or `serviceAccountKey.json` to version control; rotate any exposed keys immediately.
- **Transport & Cookies:** Enforce HTTPS, `Secure` cookie flags, and strict CORS origins matching your production frontend domain.
- **Network Isolation:** Restrict MongoDB IP allowlists, scope AWS IAM policies strictly to S3 object uploads/signed reads, and route internal service traffic over a private container network.