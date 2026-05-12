# Deployment Guide (CloudPanel)

## Architecture

```
                           /api/*, /socket.io/* --> Express API (:3001) --> MongoDB
Client --> nginx (443) -->
                           everything else       --> Next.js (:3002)
```

nginx routes API and WebSocket traffic directly to the Express server on port 3001, and everything else to the Next.js app on port 3002.

---

## Prerequisites (SSH into your server)

```bash
# Switch to your CloudPanel site user
sudo -u atharvdangedev-opinion -i

# Install pnpm
corepack enable && corepack prepare pnpm@10.32.1 --activate

# Or if corepack isn't available:
npm install -g pnpm@10.32.1
```

---

## 1. Clone the Repository

```bash
cd /home/atharvdangedev-opinion/htdocs/opinion.atharvdangedev.in
git clone <repo-url> Opinion
cd Opinion
pnpm install
```

---

## 2. Environment Variables

### `apps/api/.env`

```ini
PORT=3001
MONGODB_URI=mongodb://localhost:27017/opinion
KLEIS_IDP_URL=https://idp.your-domain.com
KLEIS_CLIENT_ID=your-kleis-client-id
KLEIS_CLIENT_SECRET=your-kleis-client-secret
PUBLIC_APP_URL=https://opinion.atharvdangedev.in
SESSION_SECRET=<generate: openssl rand -hex 32>
SESSION_COOKIE_NAME=opinion_session
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
FINGERPRINT_SALT=<generate: openssl rand -hex 16>
CORS_ORIGIN=https://opinion.atharvdangedev.in
```

### `apps/web/.env.local`

```ini
PUBLIC_APP_URL=https://opinion.atharvdangedev.in
NEXT_PUBLIC_API_URL=http://localhost:3001
SESSION_SECRET=<same-as-api>
SESSION_COOKIE_NAME=opinion_session
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

> `NEXT_PUBLIC_API_URL=http://localhost:3001` — the Next.js server uses this internally (as a sidecar) to fetch poll data in `generateMetadata`. It's not exposed to the client.

---

## 3. Build

```bash
pnpm build
```

Produces:

- `apps/api/dist/` — compiled Express server
- `apps/web/.next/` — Next.js production bundle

---

## 4. Run Both Services

You need two processes: the API (port 3001) and the Next.js app (port 3002). Use PM2 to manage both.

### Install PM2

```bash
npm install -g pm2
```

### Create `ecosystem.config.js` in the project root

```js
module.exports = {
  apps: [
    {
      name: "opinion-api",
      cwd: "./apps/api",
      script: "dist/index.js",
      env: { NODE_ENV: "production" },
    },
    {
      name: "opinion-web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002",
      env: { NODE_ENV: "production" },
    },
  ],
};
```

### Start

```bash
pm2 start ecosystem.config.js
pm2 save
```

PM2 will restart both processes automatically if they crash.

### Set PM2 to start on boot

```bash
pm2 startup   # follow the printed instructions
```

---

## 5. CloudPanel Node.js Manager (DISABLE)

Since you're using PM2, **do NOT enable** the Node.js manager in CloudPanel for this site. If it's enabled, CloudPanel will try to run its own process on port 3002 and conflict with PM2.

- Go to CloudPanel > Sites > opinion.atharvdangedev.in > Node.js
- If enabled, toggle it **OFF**

Your vhost is already configured with `{{app_port}} 3002` — this tells nginx to proxy to `127.0.0.1:3002`, which is where PM2 runs the Next.js server.

---

## 6. nginx — Add an API-specific location block

Your current config proxies everything to port 3002 (Next.js). You need to route `/api/` and `/socket.io/` directly to the Express server on port 3001.

Replace your single `location /` block with two location blocks:

```nginx
# API and WebSocket -> Express server
location /api/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_pass_request_headers on;
    proxy_max_temp_file_size 0;
    proxy_connect_timeout 900;
    proxy_send_timeout 900;
    proxy_read_timeout 900;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    proxy_temp_file_write_size 256k;
}

location /socket.io/ {
    proxy_pass http://127.0.0.1:3001/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_pass_request_headers on;
    proxy_max_temp_file_size 0;
    proxy_connect_timeout 900;
    proxy_send_timeout 900;
    proxy_read_timeout 900;
}

# Everything else -> Next.js
location / {
    proxy_pass http://127.0.0.1:{{app_port}}/;
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_pass_request_headers on;
    proxy_max_temp_file_size 0;
    proxy_connect_timeout 900;
    proxy_send_timeout 900;
    proxy_read_timeout 900;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    proxy_temp_file_write_size 256k;
}
```

> nginx matches `location /api/` before `location /` because prefix matches are evaluated in order of longest match. All API traffic goes directly to Express on port 3001.

---

## 7. MongoDB

CloudPanel doesn't include MongoDB. Install it:

```bash
# Import MongoDB GPG key and add repo (adjust version as needed)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

Or use MongoDB Atlas (no installation needed — just set `MONGODB_URI` to your Atlas connection string).

---

## 8. Verify

```bash
pm2 status

curl http://localhost:3001/api/polls   # should return JSON (API)
curl http://localhost:3002              # should return HTML (Next.js)
```

Then hit `https://opinion.atharvdangedev.in/` in a browser.

---

## 9. Updating

```bash
cd /home/atharvdangedev-opinion/htdocs/opinion.atharvdangedev.in/Opinion
git pull
pnpm install
pnpm build
pm2 restart ecosystem.config.js
```

---

## 10. Directory Reference

```
/home/atharvdangedev-opinion/
  htdocs/
    opinion.atharvdangedev.in/
      public/           # nginx document root ({{root}})
      Opinion/          # project root (this repo)
        apps/api/       # Express API
        apps/web/       # Next.js app
        ecosystem.config.js
```

---

## Troubleshooting

| Symptom                   | Cause & Fix                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `502 Bad Gateway`         | PM2 not running. Run `pm2 start ecosystem.config.js`                                   |
| API 404s                  | Check `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` — must be `http://localhost:3001` |
| Socket.io not connecting  | Missing `proxy_set_header Upgrade $http_upgrade;` in nginx vhost                       |
| Port conflict             | CloudPanel Node.js manager is ON and competing with PM2. Turn it OFF                   |
| `pnpm: command not found` | Run `corepack enable && corepack prepare pnpm@10.32.1 --activate` as the site user     |
