# Render Deployment Guide for BIM Drawing Manager

## Overview
This guide explains how to deploy your BIM Drawing Manager application to Render.com. The deployment includes:
- Spring Boot backend (with PostgreSQL database)
- React frontend (static site)
- PostgreSQL database
- Persistent disk storage for uploaded files

## Prerequisites
1. A Render account (sign up at https://render.com)
2. Git repository pushed to GitHub/GitLab
3. All code changes committed

## Deployment Options

### Option 1: Using Render Blueprint (Recommended)

This is the easiest method - Render will automatically set up all services from the `render.yaml` file.

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin master
   ```

2. **Create New Blueprint on Render**
   - Go to https://dashboard.render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select your repository
   - Render will detect the `render.yaml` file
   - Click "Apply"

3. **Update Environment Variables**
   After services are created, you need to update the frontend URL:
   - Go to the backend service settings
   - Find the `FRONTEND_URL` environment variable
   - Update it with your actual frontend URL (e.g., `https://bim-frontend-xyz.onrender.com`)

   And update the backend URL in frontend:
   - Go to the frontend service settings
   - Find the `VITE_API_URL` environment variable
   - Update it with your actual backend URL (e.g., `https://bim-backend-xyz.onrender.com`)

4. **Trigger Redeployment**
   - After updating the URLs, manually redeploy both services

### Option 2: Manual Setup

If you prefer to set up services manually:

#### Step 1: Create PostgreSQL Database
1. From Render Dashboard, click "New" → "PostgreSQL"
2. Configure:
   - Name: `bim-db`
   - Database: `bim_drawing_db`
   - User: `bim_user`
   - Region: Choose closest to your users
   - Plan: Starter (or Free for testing)
3. Click "Create Database"
4. Save the "Internal Database URL" - you'll need this

#### Step 2: Deploy Backend
1. Click "New" → "Web Service"
2. Connect your Git repository
3. Configure:
   - Name: `bim-backend`
   - Runtime: Docker
   - Branch: master
   - Docker Build Context Directory: `backend`
   - Dockerfile Path: `backend/Dockerfile`
4. Add Environment Variables:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `DATABASE_URL` = [Paste the Internal Database URL from Step 1]
   - `JWT_SECRET` = [Generate a random 64-character string]
   - `FRONTEND_URL` = `https://YOUR-FRONTEND-URL.onrender.com` (you'll update this later)
5. Add Persistent Disk:
   - Name: `uploads`
   - Mount Path: `/app/uploads`
   - Size: 10 GB
6. Click "Create Web Service"

#### Step 3: Deploy Frontend
1. Click "New" → "Static Site"
2. Connect your Git repository
3. Configure:
   - Name: `bim-frontend`
   - Branch: master
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Add Environment Variable:
   - `VITE_API_URL` = [Your backend URL from Step 2, e.g., `https://bim-backend-xyz.onrender.com`]
5. Click "Create Static Site"

#### Step 4: Update CORS Settings
1. Go back to backend service
2. Update the `FRONTEND_URL` environment variable with the actual frontend URL
3. Manually trigger a redeploy

## Environment Variables Reference

### Backend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile to use | `prod` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 64-char string |
| `FRONTEND_URL` | Frontend URL for CORS | `https://bim-frontend.onrender.com` |

### Frontend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://bim-backend.onrender.com` |

## Generating JWT Secret

You can generate a secure JWT secret using:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

## Post-Deployment Steps

1. **Test the Application**
   - Visit your frontend URL
   - Try logging in
   - Create a test project
   - Upload a test PDF file
   - Download the file to verify naming is correct

2. **Monitor Logs**
   - Check backend logs for any errors
   - Check frontend build logs

3. **Database Migration**
   - The database will auto-create tables on first run (using `spring.jpa.hibernate.ddl-auto=update`)
   - If you have existing data in H2, you'll need to migrate it manually

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down may be slow (cold start)
- Database has limited storage (1GB on free tier)

### Upgrading for Production
Consider upgrading to paid plans for:
- Always-on services (no spin down)
- More database storage
- Better performance
- Custom domains

### Custom Domain Setup
1. Go to service settings
2. Navigate to "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. Update environment variables with new domain

## Troubleshooting

### Backend Won't Start
- Check DATABASE_URL is correct
- Verify JWT_SECRET is set
- Check logs for specific error messages
- Ensure PostgreSQL dependency is in pom.xml

### Frontend Can't Connect to Backend
- Verify VITE_API_URL is correct
- Check CORS settings (FRONTEND_URL in backend)
- Inspect browser console for CORS errors
- Ensure both services are running

### File Uploads Fail
- Verify persistent disk is mounted at `/app/uploads`
- Check disk has sufficient space
- Review file size limits (currently 50MB)

### Database Connection Issues
- Verify DATABASE_URL is the "Internal Database URL"
- Check database is running
- Review connection pool settings if needed

## Monitoring and Maintenance

### Checking Service Health
- Render provides built-in metrics
- Monitor CPU, memory, and disk usage
- Set up alerts for service failures

### Database Backups
- Render automatically backs up PostgreSQL databases
- You can manually trigger backups from the dashboard
- Consider setting up automated backup schedule

### Updating the Application
1. Push changes to your Git repository
2. Render automatically detects changes and redeploys
3. Monitor deployment progress in dashboard
4. Check logs after deployment completes

## Cost Estimate

### Free Tier
- PostgreSQL: Free (1GB storage)
- Backend: Free (750 hours/month)
- Frontend: Free (100GB bandwidth)
- Persistent Disk: Not available on free tier

### Starter Plan (~$20-30/month)
- PostgreSQL: $7/month (10GB)
- Backend: $7/month (always-on)
- Frontend: Free
- Persistent Disk: $1/GB/month

## Support

If you encounter issues:
1. Check Render status page: https://status.render.com
2. Review Render documentation: https://render.com/docs
3. Check application logs in Render dashboard
4. Contact Render support if needed

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL/TLS certificates (automatic with Render)
3. Set up monitoring and alerts
4. Plan database backup strategy
5. Document deployment process for team