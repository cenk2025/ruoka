# Vercel Deployment Guide - food.voon.fi

## 🚀 Deployment Adımları

### 1. Vercel'e Giriş Yap
- https://vercel.com adresine git
- GitHub hesabınla giriş yap

### 2. Yeni Proje Oluştur
1. "Add New Project" butonuna tıkla
2. GitHub repository'yi seç: `cenk2025/ruoka`
3. "Import" butonuna tıkla

### 3. Proje Ayarları

#### Framework Preset
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Aşağıdaki environment variable'ları ekle:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Not**: API anahtarını Vercel Dashboard'dan ekleyin, kod deposuna eklemeyin!

### 4. Deploy Et
- "Deploy" butonuna tıkla
- İlk deployment ~2-3 dakika sürer

### 5. Custom Domain Ekle (food.voon.fi)

#### Vercel Dashboard'da:
1. Projeye git
2. "Settings" > "Domains" sekmesine tıkla
3. "Add Domain" butonuna tıkla
4. `food.voon.fi` yaz ve "Add" tıkla

#### DNS Ayarları (voon.fi domain'inde):
Vercel size DNS kayıtlarını gösterecek. Aşağıdaki kayıtları ekleyin:

**Seçenek 1: CNAME (Önerilen)**
```
Type: CNAME
Name: food
Value: cname.vercel-dns.com
```

**Seçenek 2: A Record**
```
Type: A
Name: food
Value: 76.76.21.21
```

### 6. Supabase Redirect URL'lerini Güncelle

Supabase Dashboard'da:
1. Authentication > URL Configuration
2. "Redirect URLs" bölümüne ekle:
   - `https://food.voon.fi`
   - `https://food.voon.fi/**`

### 7. SSL Sertifikası
- Vercel otomatik olarak SSL sertifikası oluşturur
- ~5-10 dakika içinde aktif olur
- HTTPS otomatik çalışır

## ✅ Deployment Checklist

- [ ] GitHub repository public veya Vercel'e erişim verildi
- [ ] Environment variables eklendi
- [ ] Build başarılı oldu
- [ ] Custom domain eklendi
- [ ] DNS kayıtları güncellendi
- [ ] SSL sertifikası aktif
- [ ] Supabase redirect URLs güncellendi
- [ ] Uygulama test edildi

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Local'de build test et:
npm run build
npm run preview
```

### Environment Variables Eksik
- Vercel Dashboard > Settings > Environment Variables
- Tüm `VITE_` prefix'li değişkenleri ekle
- Redeploy yap

### Domain DNS Propagation
- DNS değişiklikleri 24 saate kadar sürebilir
- https://dnschecker.org ile kontrol et

### Supabase Auth Hatası
- Redirect URLs'leri kontrol et
- CORS ayarlarını kontrol et

## 📊 Deployment Sonrası

### Performance Monitoring
- Vercel Analytics otomatik aktif
- https://vercel.com/dashboard/analytics

### Logs
- Vercel Dashboard > Deployments > Logs
- Real-time log takibi

### Automatic Deployments
- Her GitHub push otomatik deploy tetikler
- Production branch: `main`

## 🎯 Sonraki Adımlar

1. ✅ Deploy et
2. ✅ Custom domain ekle
3. ✅ DNS ayarlarını yap
4. ✅ SSL'i bekle
5. ✅ Test et: https://food.voon.fi
6. ✅ Supabase'i güncelle

## 💡 İpuçları

- **Preview Deployments**: Her PR otomatik preview URL alır
- **Rollback**: Eski deployment'lara kolayca dönebilirsin
- **Edge Functions**: Gerekirse serverless functions ekleyebilirsin
- **Analytics**: Vercel Analytics ile kullanıcı davranışlarını izle

## 🔗 Faydalı Linkler

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- DNS Checker: https://dnschecker.org
- SSL Checker: https://www.sslshopper.com/ssl-checker.html
