# Deployment Guide

This guide covers deploying TapSync to various platforms.

## Frontend Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch and root folder
4. Your app will be available at `https://username.github.io/tap-sync/`

### Netlify

1. Connect your GitHub repository
2. Build settings:
   - Build command: (none needed)
   - Publish directory: `/`
3. Deploy

Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Cloudflare Pages

1. Connect GitHub repository
2. Build settings:
   - Framework preset: None
   - Build command: (none)
   - Build output directory: `/`
3. Deploy

## Backend Deployment

### Heroku

1. Create `Procfile`:
```
web: cd api && gunicorn app:app
```

2. Add `gunicorn` to requirements.txt:
```bash
echo "gunicorn==21.2.0" >> api/requirements.txt
```

3. Deploy:
```bash
heroku create tap-sync-api
git push heroku main
```

### Railway

1. Create `railway.toml`:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "cd api && gunicorn app:app"
```

2. Deploy via Railway CLI or GitHub integration

### Google Cloud Run

1. Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY api/ /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

2. Build and deploy:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/tap-sync-api
gcloud run deploy tap-sync-api --image gcr.io/PROJECT_ID/tap-sync-api --platform managed
```

### AWS Lambda + API Gateway

1. Install Zappa:
```bash
pip install zappa
```

2. Initialize:
```bash
cd api
zappa init
```

3. Deploy:
```bash
zappa deploy production
```

### Docker Deployment

1. Create `Dockerfile`:
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api/ .

EXPOSE 5000
CMD ["python", "app.py"]
```

2. Build and run:
```bash
docker build -t tap-sync-api .
docker run -p 5000:5000 tap-sync-api
```

## Telegram Mini App Setup

### 1. Create Bot

Talk to [@BotFather](https://t.me/botfather):
```
/newbot
```
Follow prompts to create your bot.

### 2. Create Mini App

```
/newapp
```

Select your bot and provide:
- Title: TapSync
- Description: A rhythm game with dynamic beatmap generation
- Photo: Upload a 640x360 PNG
- GIF: (Optional) Upload a demo GIF
- Web App URL: Your deployed frontend URL

### 3. Configure Bot

Set commands:
```
/setcommands

start - Start the game
help - Show help information
```

Set menu button:
```
/setmenubutton
```
Select your bot and provide the Mini App URL.

## Environment Configuration

### Production Settings

Create `.env` file for backend:
```env
FLASK_ENV=production
CORS_ORIGINS=https://yourdomain.com
MAX_FILE_SIZE=10485760
```

Update `api/app.py`:
```python
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', '*')
CORS(app, origins=cors_origins.split(','))

# Configuration
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_FILE_SIZE', 10 * 1024 * 1024))
```

### Frontend Configuration

Update `js/audio.js` if using backend API:
```javascript
const API_URL = 'https://your-api-url.com';

async function generateBeatmapFromAPI(file) {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await fetch(`${API_URL}/api/analyze-advanced`, {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
}
```

## HTTPS Configuration

### Let's Encrypt (for VPS deployment)

```bash
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com
```

### Cloudflare (Automatic)

1. Add your domain to Cloudflare
2. Update nameservers
3. SSL/TLS mode: Full or Flexible

## Performance Optimization

### Frontend

1. **Minify assets**:
```bash
# CSS
npx clean-css-cli -o css/style.min.css css/style.css

# JavaScript
npx terser js/*.js -o js/bundle.min.js -c -m
```

2. **Enable caching** (nginx):
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **Compress assets**:
```nginx
gzip on;
gzip_types text/css application/javascript;
```

### Backend

1. **Use gunicorn workers**:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Enable caching**:
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/analyze', methods=['POST'])
@cache.cached(timeout=300)
def analyze_audio():
    # ...
```

## Monitoring

### Frontend Monitoring

Use Sentry for error tracking:
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ 
    dsn: 'YOUR_DSN',
    environment: 'production'
  });
</script>
```

### Backend Monitoring

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="YOUR_DSN",
    integrations=[FlaskIntegration()],
    environment="production"
)
```

## Scaling

### Load Balancer Setup (nginx)

```nginx
upstream backend {
    least_conn;
    server backend1.example.com:5000;
    server backend2.example.com:5000;
    server backend3.example.com:5000;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Redis Caching

```python
from redis import Redis
from flask_caching import Cache

redis_client = Redis(host='localhost', port=6379, db=0)
cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_URL': 'redis://localhost:6379/0'
})
```

## Backup and Recovery

### Database Backup (if added)

```bash
# Backup
pg_dump dbname > backup.sql

# Restore
psql dbname < backup.sql
```

### Configuration Backup

Keep your configuration in version control:
```bash
git commit -am "Update production config"
git push origin main
```

## Health Checks

### Frontend Health Check

Create `health.html`:
```html
<!DOCTYPE html>
<html>
<body>OK</body>
</html>
```

### Backend Health Check

Already implemented at `/api/health`:
```python
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Configure CORS properly in backend
2. **Audio not loading**: Check HTTPS and audio format support
3. **Telegram API not working**: Ensure app is accessed via Telegram
4. **Backend timeout**: Increase gunicorn timeout or optimize processing

### Logs

View logs:
```bash
# Heroku
heroku logs --tail

# Docker
docker logs container_id

# Systemd
journalctl -u tap-sync-api
```

## Security Checklist

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set file size limits
- [ ] Validate file types
- [ ] Rate limit API endpoints
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Regular security audits

## Post-Deployment

1. Test all functionality
2. Monitor error rates
3. Set up alerts
4. Document any issues
5. Gather user feedback
6. Plan improvements
