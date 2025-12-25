# 🚀 Vercel Deployment - Hızlı Başlangıç

## Adım 1: Vercel'e Giriş
1. https://vercel.com adresine git
2. "Sign Up" veya "Log In" tıkla
3. GitHub ile giriş yap

## Adım 2: Projeyi Import Et
1. Vercel Dashboard'da "Add New..." > "Project" tıkla
2. GitHub repository listesinde `cenk2025/ruoka` ara
3. "Import" butonuna tıkla

## Adım 3: Proje Ayarlarını Yap

### Framework Preset
Vercel otomatik olarak Vite'ı tespit edecek:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

### Environment Variables (ÖNEMLİ!)
"Environment Variables" bölümünde ekle:

**Name**: `VITE_OPENAI_API_KEY`
**Value**: `[OpenAI API anahtarınızı buraya girin]`

> **Not**: API anahtarınızı https://platform.openai.com/api-keys adresinden alabilirsiniz.

## Adım 4: Deploy Et
1. "Deploy" butonuna tıkla
2. Build süreci başlayacak (~2-3 dakika)
3. Başarılı olunca "Visit" butonuyla siteyi görüntüle

## Adım 5: Custom Domain Ekle (food.voon.fi)

### Vercel'de:
1. Proje sayfasında "Settings" tıkla
2. Sol menüden "Domains" seç
3. "Add" butonuna tıkla
4. `food.voon.fi` yaz
5. "Add" tıkla

### DNS Ayarları (voon.fi için):
Vercel size DNS kayıtlarını gösterecek. Domain sağlayıcınızda (örn. Namecheap, GoDaddy) ekleyin:

**CNAME Kaydı (Önerilen):**
```
Type: CNAME
Host: food
Value: cname.vercel-dns.com
TTL: Automatic
```

**VEYA A Kaydı:**
```
Type: A
Host: food
Value: 76.76.21.21
TTL: Automatic
```

## Adım 6: Supabase'i Güncelle

1. https://supabase.com/dashboard adresine git
2. Projenizi seçin
3. "Authentication" > "URL Configuration" git
4. "Redirect URLs" bölümüne ekleyin:
   ```
   https://food.voon.fi
   https://food.voon.fi/**
   ```
5. "Save" tıklayın

## ✅ Kontrol Listesi

- [ ] Vercel'e giriş yaptım
- [ ] Projeyi import ettim
- [ ] Environment variable ekledim (`VITE_OPENAI_API_KEY`)
- [ ] İlk deployment başarılı
- [ ] Custom domain ekledim (`food.voon.fi`)
- [ ] DNS kayıtlarını güncelledim
- [ ] DNS propagation bekliyorum (5-60 dakika)
- [ ] Supabase redirect URLs güncellendi
- [ ] SSL sertifikası aktif (Vercel otomatik)
- [ ] Siteyi test ettim

## 🔍 Test Et

1. **Vercel URL**: https://ruoka-xxx.vercel.app (otomatik oluşturulur)
2. **Custom Domain**: https://food.voon.fi (DNS propagation sonrası)

## 💡 İpuçları

- **DNS Propagation**: 5-60 dakika sürebilir
- **SSL**: Vercel otomatik Let's Encrypt sertifikası oluşturur
- **Auto Deploy**: Her GitHub push otomatik deploy tetikler
- **Rollback**: Vercel'de eski versiyona kolayca dönebilirsin

## 🆘 Sorun mu var?

### Build Hatası
- Vercel Dashboard > Deployments > Logs kontrol et
- Local'de `npm run build` çalıştır

### Domain Çalışmıyor
- DNS kayıtlarını kontrol et: https://dnschecker.org
- 24 saat bekle (DNS propagation)

### Auth Çalışmıyor
- Supabase redirect URLs kontrol et
- Browser console'da hata var mı bak

## 📞 Yardım

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- DNS Checker: https://dnschecker.org

---

**Hazır mısın? Hadi başlayalım! 🚀**
