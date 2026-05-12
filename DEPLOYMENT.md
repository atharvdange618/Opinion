# Deployment Guide (CloudPanel)

## Architecture (Separate Subdomains)

```
Client --> opinion.atharvdangedev.in:443  --> Next.js (:3002)
Client --> api-opinion.atharvdangedev.in:443 --> Express API (:3001) --> MongoDB
```

The frontend and API are deployed on **separate subdomains**. All client-side API calls and Socket.io connections go directly to `api-opinion.atharvdangedev.in` (cross-origin, with CORS + credentials).

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

## 1. Clone the Repository (on BOTH servers)

```bash
# On the web server
cd /home/atharvdangedev-opinion/htdocs/opinion.atharvdangedev.in
git clone <repo-url> Opinion
cd Opinion
pnpm install

# On the API server
cd /home/atharvdangedev-opinion/htdocs/api-opinion.atharvdangedev.in
git clone <repo-url> Opinion
cd Opinion
pnpm install
```

---

## 2. Environment Variables

### `apps/api/.env` (on `api-opinion.atharvdangedev.in`)

```ini
PORT=3001
MONGODB_URI=mongodb://localhost:27017/opinion
KLEIS_IDP_URL=https://idp.your-domain.com
KLEIS_CLIENT_ID=your-kleis-client-id
KLEIS_CLIENT_SECRET=your-kleis-client-secret
PUBLIC_APP_URL=https://api-opinion.atharvdangedev.in
PUBLIC_FRONTEND_URL=https://opinion.atharvdangedev.in
SESSION_SECRET=<generate: openssl rand -hex 32>
SESSION_COOKIE_NAME=opinion_session
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
FINGERPRINT_SALT=<generate: openssl rand -hex 16>
CORS_ORIGIN=https://opinion.atharvdangedev.in
```

> `PUBLIC_APP_URL` is the API's own public URL (used for OAuth callback redirect URIs).
> `PUBLIC_FRONTEND_URL` is the frontend domain (used for post-logout redirect and resolving relative redirects).

### `apps/web/.env.local` (on `opinion.atharvdangedev.in`)

```ini
PUBLIC_APP_URL=https://opinion.atharvdangedev.in
NEXT_PUBLIC_API_URL=https://api-opinion.atharvdangedev.in
SESSION_SECRET=<same-as-api>
SESSION_COOKIE_NAME=opinion_session
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

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

Use PM2 on each server to manage the respective service.

### Install PM2

```bash
npm install -g pm2
```

### Create `ecosystem.config.js` in the project root (API server)

```js
module.exports = {
  apps: [
    {
      name: "opinion-api",
      cwd: "./apps/api",
      script: "dist/index.js",
      env: { NODE_ENV: "production" },
    },
  ],
};
```

### Create `ecosystem.config.js` in the project root (Web server)

```js
module.exports = {
  apps: [
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

### Set PM2 to start on boot

```bash
pm2 startup   # follow the printed instructions
```

---

## 5. CloudPanel Node.js Manager (DISABLE)

Since you're using PM2, **do NOT enable** the Node.js manager in CloudPanel for either site. If it's enabled, CloudPanel will try to run its own process and conflict with PM2.

- Go to CloudPanel > Sites > each site > Node.js
- If enabled, toggle it **OFF**

---

## 6. nginx — Each site proxies to its own process

### On `opinion.atharvdangedev.in`

Everything goes to Next.js on port 3002:

```nginx
location / {
    proxy_pass http://127.0.0.1:3002/;
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
```

### On `api-opinion.atharvdangedev.in`

Everything goes to Express on port 3001:

```nginx
location / {
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

# WebSocket support for Socket.io
location /socket.io/ {
    proxy_pass http://127.0.0.1:3001/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 7. MongoDB

Can be installed on either server (or use MongoDB Atlas). Install locally:

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

Or use MongoDB Atlas — just set `MONGODB_URI` to your Atlas connection string in the API's `.env`.

---

## 8. Verify

```bash
# On the API server
pm2 status
curl http://localhost:3001/api/polls   # should return JSON

# On the web server
pm2 status
curl http://localhost:3002              # should return HTML
```

Then hit `https://opinion.atharvdangedev.in/` in a browser and verify login, poll creation, and real-time updates work.

---

## 9. Updating

```bash
cd /home/atharvdangedev-opinion/htdocs/opinion.atharvdangedev.in/Opinion
git pull
pnpm install
pnpm build
pm2 restart ecosystem.config.js

# Repeat on the API server
```

---

## 10. Directory Reference

```
/home/atharvdangedev-opinion/
  htdocs/
    opinion.atharvdangedev.in/      # frontend
      public/
      Opinion/
        apps/web/
        ecosystem.config.js
    api-opinion.atharvdangedev.in/   # API
      public/
      Opinion/
        apps/api/
        ecosystem.config.js
```

---

## Troubleshooting

| Symptom                        | Cause & Fix                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `502 Bad Gateway`              | PM2 not running. Run `pm2 start ecosystem.config.js`                                                        |
| CORS errors in browser         | Check `CORS_ORIGIN` in API `.env` — must be `https://opinion.atharvdangedev.in`                             |
| Auth callback fails            | Check Kleiss client config — redirect URI must be `https://api-opinion.atharvdangedev.in/api/auth/callback` |
| Socket.io not connecting       | `NEXT_PUBLIC_API_URL` must be `https://api-opinion.atharvdangedev.in` in web `.env.local`                   |
| Session not persisting         | Cookie `SameSite=None` requires HTTPS. Both subdomains must have valid SSL certificates                     |
| `pnpm: command not found`      | Run `corepack enable && corepack prepare pnpm@10.32.1 --activate` as the site user                          |
| Login redirects to wrong place | Check `PUBLIC_FRONTEND_URL` in API `.env` — must be `https://opinion.atharvdangedev.in`                     |
