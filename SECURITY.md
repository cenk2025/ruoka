# 🔐 Security Policy

## API Key Security

### ⚠️ Critical Rules

1. **NEVER commit API keys to Git**
   - All API keys must be stored in `.env` files
   - The `.env` file is in `.gitignore` - keep it there!
   - Use `.env.example` for documentation only (with placeholder values)

2. **NEVER hard-code API keys in source code**
   - Always use `import.meta.env.VITE_*` to access keys
   - Never write actual key values in `.ts`, `.tsx`, `.js`, or `.jsx` files

3. **Use environment variables in production**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Never expose keys in client-side code

### 🔑 Required Environment Variables

For production deployment, set these in your hosting platform:

```
VITE_OPENAI_API_KEY=sk-...
VITE_DEEPSEEK_API_KEY=sk-...
```

**Important**: The `VITE_` prefix is required for Vite to expose variables to the client.

### 🚨 What to Do If Your API Key Leaks

If you accidentally commit or expose an API key:

1. **Immediately revoke the leaked key**
   - OpenAI: https://platform.openai.com/api-keys
   - DeepSeek: https://platform.deepseek.com/api_keys

2. **Generate a new key**
   - Create a new API key with a descriptive name
   - Update your `.env` file locally
   - Update environment variables in your hosting platform

3. **Update your deployment**
   - Vercel: Update env vars and redeploy
   - Other platforms: Update env vars and redeploy

4. **Clean Git history (if committed)**
   ```bash
   # Remove file from Git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (use with caution!)
   git push origin --force --all
   ```

### ✅ Security Checklist

Before deploying or committing:

- [ ] `.env` file is in `.gitignore`
- [ ] No API keys in source code
- [ ] `.env.example` has only placeholder values
- [ ] Production environment variables are set in hosting platform
- [ ] API keys have appropriate usage limits set
- [ ] Monitoring is enabled for API usage

### 📊 Monitoring API Usage

Regularly check your API usage:
- **OpenAI**: https://platform.openai.com/usage
- **DeepSeek**: https://platform.deepseek.com/usage

Set up usage alerts to detect:
- Unexpected spikes in usage
- Unauthorized access
- Cost overruns

### 🛡️ Additional Security Measures

1. **Rate Limiting**: Implement rate limiting in your application
2. **Usage Caps**: Set monthly spending limits in API provider dashboards
3. **IP Restrictions**: If possible, restrict API key usage to specific IPs
4. **Rotation**: Regularly rotate API keys (every 3-6 months)

### 📞 Reporting Security Issues

If you discover a security vulnerability, please email:
- **Email**: cenk.yakinlar@hotmail.com
- **Subject**: [SECURITY] Ruoka App Vulnerability

Do not open public issues for security vulnerabilities.

---

**Last Updated**: December 25, 2024
