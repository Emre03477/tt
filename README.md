# 🚀 Gelişmiş Discord Token Checker

> **⚠️ ÖNEMLİ UYARI:** Self-bot kullanımı Discord'un Kullanım Şartlarına aykırıdır ve hesabınızın kalıcı olarak yasaklanmasına neden olabilir. Bu araç yalnızca eğitim ve araştırma amaçlıdır. Kullanımdan doğabilecek tüm sorumluluk kullanıcıya aittir.

Discord tokenlarınızı kontrol eden ve detaylı hesap bilgileri gösteren gelişmiş bir token checker sistemi.

## ✨ Özellikler

### 📊 Temel Bilgiler
- ✅ Token geçerliliği kontrolü
- 👤 Kullanıcı adı, etiket ve ID
- 📧 Email ve telefon bilgisi
- ✔️ Hesap doğrulama durumu
- 🔐 2FA (Two-Factor Authentication) durumu
- 🌍 Dil ayarı
- 📅 Hesap oluşturulma tarihi

### 🎨 Görünüm Bilgileri
- 🖼️ Avatar URL (1024x1024 dinamik)
- 🎭 Banner URL (1024x1024 dinamik)
- 🎨 Profil vurgu rengi (Hex kodu)
- 📝 Bio/Hakkında bölümü

### 💎 Premium & Ödeme
- 💎 Nitro tipi (None, Classic, Nitro, Basic)
- ⏰ Nitro bitiş tarihi
- 💳 Kayıtlı ödeme yöntemi sayısı

### 🏆 Rozetler
- 👨‍💼 Discord Çalışanı
- 🤝 Partnered Server Sahibi
- 🎉 HypeSquad Events
- 🐛 Bug Hunter (Level 1 & 2)
- ⚔️ HypeSquad Bravery
- 🔮 HypeSquad Brilliance
- ⚖️ HypeSquad Balance
- 💎 Early Supporter
- 🔧 Verified Bot Developer
- 🛡️ Certified Moderator
- ⚡ Active Developer

### 📊 İstatistikler
- 🏰 Toplam sunucu sayısı
- 👥 Arkadaş sayısı
- 🚫 Engellenmiş kullanıcı sayısı
- 📋 İlk 5 sunucu detayları (isim, ID, üye sayısı, sahiplik durumu)

### 📁 Dosya Yönetimi
- ✅ Geçerli tokenler `valid_tokens.txt` dosyasına kaydedilir
- ❌ Geçersiz tokenler `invalid_tokens.txt` dosyasına kaydedilir
- 📊 Detaylı özet raporu

## 📦 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/Emre03477/tt.git
cd tt
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `tokens.txt` dosyasına tokenlerinizi ekleyin (her satıra bir token):
```
YOUR_TOKEN_HERE_1234567890.XXXXXX.YYYYYYYYYYYYYYYYYYYYYYYY
YOUR_TOKEN_HERE_0987654321.AAAAAA.BBBBBBBBBBBBBBBBBBBBBBBB
```

## 🚀 Kullanım

Token checker'ı çalıştırmak için:

```bash
npm start
```

veya

```bash
node index.js
```

## 📋 Çıktı Örneği

Program her token için detaylı bilgileri renkli ve düzenli bir şekilde gösterir:

```
═══════════════════════════════════════════════════════════
✅ Token #1 - GEÇERLİ
═══════════════════════════════════════════════════════════

👤 KULLANICI BİLGİLERİ:
├─ Kullanıcı Adı: Username
├─ Etiket: Username#1234
├─ ID: 123456789012345678
├─ Email: user@example.com
├─ Telefon: +90xxxxxxxxxx
├─ Doğrulanmış: Evet
├─ 2FA: Evet
├─ Dil: tr
└─ Oluşturulma: 17.01.2024 11:44:09

🎨 GÖRÜNÜM:
├─ Avatar: https://cdn.discordapp.com/avatars/...
├─ Banner: https://cdn.discordapp.com/banners/...
├─ Vurgu Rengi: #5865F2
└─ Bio: Bu bir bio metnidir

💎 NITRO & ÖDEME:
├─ Nitro Tipi: Nitro
├─ Nitro Bitiş: 17.02.2024 11:44:09
└─ Ödeme Yöntemi: 2

🏆 ROZETLER:
├─ 💎 Early Supporter
└─ ⚡ Active Developer

📊 İSTATİSTİKLER:
├─ Sunucular: 50
├─ Arkadaşlar: 100
└─ Engellenenler: 5

🏰 İLK 5 SUNUCU:
├─ Sunucu Adı 1 👑
   ID: 123456789012345678 | Üyeler: 1000
└─ Sunucu Adı 2
   ID: 987654321098765432 | Üyeler: 500

🔑 TOKEN:
└─ YOUR_TOKEN_HERE.XXXXXX.YYYYYYYYYYYYYYYYYYYYYYYY
```

## ⚠️ Önemli Notlar

- **Self-bot kullanımı Discord'un Kullanım Şartlarına aykırıdır** ve hesabınızın yasaklanmasına neden olabilir.
- Bu araç yalnızca **eğitim amaçlıdır**.
- Tokenlerinizi asla başkalarıyla paylaşmayın.
- `tokens.txt` dosyası `.gitignore` içinde olduğu için Git'e yüklenmez.
- Geçerli ve geçersiz tokenler ayrı dosyalara kaydedilir.

## 🛡️ Güvenlik

- Tokenler hassas bilgilerdir, dikkatli kullanın
- `tokens.txt` dosyasını asla Git'e eklemeyin
- Tokenlerinizi düzenli olarak yenileyin
- 2FA kullanarak hesabınızı koruyun

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açarak neyi değiştirmek istediğinizi tartışın.

## ⚡ Performans

- Her token için ortalama 3-5 saniye kontrol süresi
- Rate limiting koruması ile güvenli kullanım
- Timeout koruması (15 saniye)
- Hata yönetimi ve loglama

## 📞 İletişim

Sorularınız için issue açabilirsiniz.