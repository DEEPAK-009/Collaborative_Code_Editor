# Self-Hosting Judge0 for CollabX

This guide explains how to self-host your own dedicated **Judge0** instance on any Linux VM (e.g., Oracle Cloud Always Free, AWS EC2, DigitalOcean, or Hetzner) and connect it to CollabX.

---

## 1. Quick Requirements
- **OS**: Ubuntu 22.04 / 24.04 LTS (x86_64 or ARM64)
- **RAM**: Minimum 2 GB (4 GB+ recommended)
- **Software**: Docker & Docker Compose v2+

---

## 2. Deploy Judge0 Stack (3 Steps)

### Step 1: Download Official Release
SSH into your Linux server and run:
```bash
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip
cd judge0-v1.13.1
```

### Step 2: Start Databases (Postgres & Redis)
```bash
docker compose up -d db redis
sleep 10
```

### Step 3: Start Server & Workers
```bash
docker compose up -d
```

Verify your instance is healthy:
```bash
curl http://localhost:2358/languages
```

---

## 3. Connect CollabX to Your Self-Hosted Judge0

In your **Backend `.env`**:
```env
# Enable Judge0 Execution
ENABLE_CODE_EXECUTION=true
EXECUTION_PROVIDER=judge0

# Point to your self-hosted server IP or domain
JUDGE0_API_URL=http://<YOUR_SERVER_PUBLIC_IP>:2358

# Optional: If you enabled AUTH_TOKEN in judge0.conf
JUDGE0_AUTH_TOKEN=your-configured-token
```

---

## 4. Free Cloud Hosting Options

| Provider | Free Tier Details |
| :--- | :--- |
| **Oracle Cloud Always Free** | Ampere A1 Compute (Up to 4 OCPUs, 24 GB RAM, 200 GB storage) — **Free forever**. |
| **AWS Free Tier** | `t2.micro` or `t4g.small` (750 hours/month free for 12 months). |
| **Hetzner / DigitalOcean** | Dedicated VPS for $4–$5/month. |
