# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase, Railway, Neon, etc.)
- A hosting platform (Vercel, Railway, Render, etc.)

## Option 1: Deploy to Railway (Recommended)

Railway provides free PostgreSQL and easy deployment.

### Backend Deployment

1. **Create a Railway account**: https://railway.app
2. **Create a new project**
3. **Add PostgreSQL database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a database and provide connection string
4. **Deploy Backend**:
   - Click "New" → "GitHub Repo"
   - Connect your repository
   - Select the `backend` directory
   - Add environment variables:
     ```
     DATABASE_URL=<from Railway PostgreSQL>
     JWT_SECRET=<strong-random-secret>
     JWT_EXPIRES_IN=24h
     PORT=3000
     NODE_ENV=production
     CORS_ORIGIN=<your-frontend-url>
     ```
   - Railway will automatically detect Node.js and deploy
5. **Run migrations**:
   - In Railway dashboard → Backend service → Settings → Deploy
   - Add custom start command: `npx prisma migrate deploy && npx prisma db seed && npm run start:prod`

### Frontend Deployment

1. **Deploy to Vercel**: https://vercel.com
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `frontend`
4. **Add environment variables**:
   ```
   VITE_API_URL=<your-railway-backend-url>
   ```

## Option 2: Deploy to Render

### Backend on Render

1. Create a Render account: https://render.com
2. Create a new PostgreSQL database
3. Create a new Web Service:
   - Connect your repository
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npx prisma db seed && npm run start:prod`
   - Add environment variables
4. The service will deploy automatically

### Frontend on Render

1. Create a new Static Site
2. Connect your repository
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Add environment variables

## Option 3: Using Supabase (Free Database)

1. **Create Supabase account**: https://supabase.com
2. **Create new project**
3. **Get connection string**:
   - Go to Settings → Database
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
4. **Use this connection string in your backend deployment**:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

## Option 4: Docker Deployment

### Using Docker Hub

1. **Build and push images**:
```bash
# Backend
cd backend
docker build -t your-username/library-backend:latest .
docker push your-username/library-backend:latest

# Frontend
cd frontend
docker build -t your-username/library-frontend:latest .
docker push your-username/library-frontend:latest
```

2. **Deploy on any Docker host**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Using DigitalOcean App Platform

1. Create a DigitalOcean account
2. Use App Platform with Docker Hub
3. Configure services from docker-compose.yml
4. Add environment variables
5. Deploy

## Environment Variables Checklist

### Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend
```env
VITE_API_URL=https://your-backend-domain.com
```

## Post-Deployment Tasks

1. **Run Database Migrations**:
```bash
npx prisma migrate deploy
```

2. **Seed Database** (optional for production):
```bash
npx prisma db seed
```

3. **Verify API**:
```bash
curl https://your-backend-url.com/api
```

4. **Test Authentication**:
```bash
curl -X POST https://your-backend-url.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"password123"}'
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use environment-specific CORS_ORIGIN
- [ ] Enable HTTPS for production
- [ ] Use strong database passwords
- [ ] Don't commit .env files
- [ ] Enable rate limiting (add in production)
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Update dependencies regularly

## Monitoring

### Health Check Endpoint
Add a health check endpoint to monitor your API:
```typescript
// In main.ts or app.controller.ts
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

### Logging
Consider adding logging services:
- Sentry for error tracking
- LogRocket for frontend monitoring
- Datadog or New Relic for full-stack monitoring

## Scaling Considerations

1. **Database Connection Pooling**: Configure Prisma connection pool
2. **CDN**: Use Cloudflare or similar for frontend
3. **Load Balancing**: Multiple backend instances
4. **Caching**: Add Redis for frequently accessed data
5. **Database Indexing**: Add indexes for common queries

## Cost Estimates (Free Tiers)

- **Railway**: Free tier includes PostgreSQL + 1 service
- **Vercel**: Unlimited deployments for personal projects
- **Render**: 750 hours/month free
- **Supabase**: 500MB database, 2GB bandwidth free
- **Railway**: $5/month credit free

## Troubleshooting Deployment

### Database Connection Issues
- Check DATABASE_URL format
- Verify network connectivity
- Check database firewall rules

### CORS Errors
- Update CORS_ORIGIN in backend
- Ensure https:// protocol
- Check for trailing slashes

### Build Failures
- Verify Node.js version compatibility
- Check for missing dependencies
- Review build logs

### Migration Failures
- Run migrations manually via Railway/Render CLI
- Check database permissions
- Verify schema is compatible

## Backup Strategy

### Database Backups
```bash
# Automated backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Scheduled Backups
- Railway: Automatic backups available
- Supabase: Point-in-time recovery available
- Render: Automatic backups on paid plans

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: berviantoleo/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## Support

For deployment issues:
1. Check service provider documentation
2. Review application logs
3. Test locally with production environment variables
4. Verify all endpoints work via Swagger docs

---

**Note**: This is a demo application. For production use, implement additional security measures, monitoring, and testing.
