const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const chalk = require('chalk');

// Token checker sınıfı
class TokenChecker {
    constructor() {
        this.validTokens = [];
        this.invalidTokens = [];
        this.checkedCount = 0;
    }

    // Tokenleri dosyadan oku
    readTokens() {
        try {
            if (!fs.existsSync('./tokens.txt')) {
                console.log(chalk.red('❌ tokens.txt dosyası bulunamadı!'));
                console.log(chalk.yellow('💡 tokens.txt dosyası oluşturuldu. Lütfen tokenlerinizi ekleyin.'));
                return [];
            }

            const data = fs.readFileSync('./tokens.txt', 'utf-8');
            const tokens = data.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            if (tokens.length === 0) {
                console.log(chalk.yellow('⚠️  tokens.txt dosyası boş!'));
                return [];
            }

            console.log(chalk.blue(`📋 ${tokens.length} token bulundu, kontrol ediliyor...\n`));
            return tokens;
        } catch (error) {
            console.log(chalk.red(`❌ Token dosyası okuma hatası: ${error.message}`));
            return [];
        }
    }

    // Token'ı kontrol et ve bilgileri al
    async checkToken(token, index) {
        return new Promise((resolve) => {
            const client = new Client({
                checkUpdate: false,
                readyStatus: false
            });

            const timeout = setTimeout(() => {
                client.destroy();
                resolve({
                    valid: false,
                    error: 'Timeout',
                    token: token.substring(0, 40) + '...'
                });
            }, 15000);

            client.on('ready', async () => {
                clearTimeout(timeout);
                
                try {
                    const user = client.user;
                    const userSettings = client.settings;

                    // Kullanıcı bilgileri
                    const info = {
                        valid: true,
                        token: token,
                        id: user.id,
                        username: user.username,
                        discriminator: user.discriminator,
                        tag: user.tag,
                        email: user.email || 'Gizli',
                        phone: user.phone || 'Yok',
                        verified: user.verified ? 'Evet' : 'Hayır',
                        mfaEnabled: user.mfaEnabled ? 'Evet' : 'Hayır',
                        premiumType: this.getPremiumType(user.premiumType),
                        flags: this.getUserFlags(user.flags),
                        bio: user.bio || 'Yok',
                        avatarURL: user.displayAvatarURL({ dynamic: true, size: 1024 }),
                        bannerURL: user.bannerURL({ dynamic: true, size: 1024 }) || 'Yok',
                        accentColor: user.accentColor ? `#${user.accentColor.toString(16).padStart(6, '0')}` : 'Yok',
                        createdAt: user.createdAt.toLocaleString('tr-TR'),
                        locale: userSettings?.locale || 'Bilinmiyor',
                        guilds: client.guilds.cache.size,
                        friends: 0,
                        blocked: 0
                    };

                    // Arkadaş ve engellenen sayısını al
                    try {
                        if (client.relationships && client.relationships.cache) {
                            info.friends = client.relationships.cache.filter(r => r.type === 1).size || 0;
                            info.blocked = client.relationships.cache.filter(r => r.type === 2).size || 0;
                        }
                    } catch (e) {
                        // İlişki bilgileri alınamazsa varsayılan 0 kalır
                    }

                    // Nitro bitiş tarihi
                    if (user.premiumType && user.premiumType !== 0) {
                        try {
                            const billing = await client.api.users('@me').billing.subscriptions.get();
                            if (billing && billing.length > 0) {
                                const nitroSub = billing.find(sub => sub.type === 1);
                                if (nitroSub && nitroSub.current_period_end) {
                                    info.nitroExpires = new Date(nitroSub.current_period_end).toLocaleString('tr-TR');
                                }
                            }
                        } catch (e) {
                            info.nitroExpires = 'Alınamadı';
                        }
                    }

                    // Ödeme yöntemleri
                    try {
                        const paymentSources = await client.api.users('@me').billing['payment-sources'].get();
                        info.paymentMethods = paymentSources?.length || 0;
                    } catch (e) {
                        info.paymentMethods = 'Alınamadı';
                    }

                    // Sunucu listesi (ilk 5)
                    const guildList = client.guilds.cache.first(5).map(g => ({
                        name: g.name,
                        id: g.id,
                        members: g.memberCount,
                        owner: g.ownerId === user.id
                    }));
                    info.topGuilds = guildList;

                    await client.destroy();
                    resolve(info);
                } catch (error) {
                    await client.destroy();
                    resolve({
                        valid: false,
                        error: error.message,
                        token: token.substring(0, 40) + '...'
                    });
                }
            });

            client.on('error', async (error) => {
                clearTimeout(timeout);
                await client.destroy();
                resolve({
                    valid: false,
                    error: error.message,
                    token: token.substring(0, 40) + '...'
                });
            });

            client.login(token).catch(async (error) => {
                clearTimeout(timeout);
                await client.destroy();
                resolve({
                    valid: false,
                    error: 'Geçersiz Token',
                    token: token.substring(0, 40) + '...'
                });
            });
        });
    }

    // Premium tipini al
    getPremiumType(type) {
        const types = {
            0: 'Yok',
            1: 'Nitro Classic',
            2: 'Nitro',
            3: 'Nitro Basic'
        };
        return types[type] || 'Bilinmiyor';
    }

    // Kullanıcı bayraklarını al
    getUserFlags(flags) {
        if (!flags) return [];
        
        const flagMap = {
            STAFF: '👨‍💼 Discord Çalışanı',
            PARTNER: '🤝 Partnered Server Sahibi',
            HYPESQUAD: '🎉 HypeSquad Events',
            BUG_HUNTER_LEVEL_1: '🐛 Bug Hunter Level 1',
            HYPESQUAD_ONLINE_HOUSE_1: '⚔️ HypeSquad Bravery',
            HYPESQUAD_ONLINE_HOUSE_2: '🔮 HypeSquad Brilliance',
            HYPESQUAD_ONLINE_HOUSE_3: '⚖️ HypeSquad Balance',
            PREMIUM_EARLY_SUPPORTER: '💎 Early Supporter',
            BUG_HUNTER_LEVEL_2: '🐛 Bug Hunter Level 2',
            VERIFIED_BOT_DEVELOPER: '🔧 Verified Bot Developer',
            CERTIFIED_MODERATOR: '🛡️ Certified Moderator',
            ACTIVE_DEVELOPER: '⚡ Active Developer'
        };

        const userFlags = [];
        for (const [flag, label] of Object.entries(flagMap)) {
            if (flags.has(flag)) {
                userFlags.push(label);
            }
        }

        return userFlags;
    }

    // Token bilgilerini göster
    displayTokenInfo(info, index) {
        console.log(chalk.green('═══════════════════════════════════════════════════════════'));
        console.log(chalk.cyan.bold(`✅ Token #${index} - GEÇERLİ`));
        console.log(chalk.green('═══════════════════════════════════════════════════════════'));
        
        console.log(chalk.white.bold('\n👤 KULLANICI BİLGİLERİ:'));
        console.log(chalk.gray('├─') + chalk.white(` Kullanıcı Adı: ${chalk.yellow(info.username)}`));
        console.log(chalk.gray('├─') + chalk.white(` Etiket: ${chalk.yellow(info.tag)}`));
        console.log(chalk.gray('├─') + chalk.white(` ID: ${chalk.yellow(info.id)}`));
        console.log(chalk.gray('├─') + chalk.white(` Email: ${chalk.yellow(info.email)}`));
        console.log(chalk.gray('├─') + chalk.white(` Telefon: ${chalk.yellow(info.phone)}`));
        console.log(chalk.gray('├─') + chalk.white(` Doğrulanmış: ${info.verified === 'Evet' ? chalk.green(info.verified) : chalk.red(info.verified)}`));
        console.log(chalk.gray('├─') + chalk.white(` 2FA: ${info.mfaEnabled === 'Evet' ? chalk.green(info.mfaEnabled) : chalk.red(info.mfaEnabled)}`));
        console.log(chalk.gray('├─') + chalk.white(` Dil: ${chalk.yellow(info.locale)}`));
        console.log(chalk.gray('└─') + chalk.white(` Oluşturulma: ${chalk.yellow(info.createdAt)}`));

        console.log(chalk.white.bold('\n🎨 GÖRÜNÜM:'));
        console.log(chalk.gray('├─') + chalk.white(` Avatar: ${chalk.blue(info.avatarURL)}`));
        console.log(chalk.gray('├─') + chalk.white(` Banner: ${info.bannerURL !== 'Yok' ? chalk.blue(info.bannerURL) : chalk.gray(info.bannerURL)}`));
        console.log(chalk.gray('├─') + chalk.white(` Vurgu Rengi: ${info.accentColor !== 'Yok' ? chalk.hex(info.accentColor)(info.accentColor) : chalk.gray(info.accentColor)}`));
        console.log(chalk.gray('└─') + chalk.white(` Bio: ${info.bio !== 'Yok' ? chalk.yellow(info.bio) : chalk.gray(info.bio)}`));

        console.log(chalk.white.bold('\n💎 NITRO & ÖDEME:'));
        console.log(chalk.gray('├─') + chalk.white(` Nitro Tipi: ${info.premiumType !== 'Yok' ? chalk.magenta(info.premiumType) : chalk.gray(info.premiumType)}`));
        if (info.nitroExpires) {
            console.log(chalk.gray('├─') + chalk.white(` Nitro Bitiş: ${chalk.yellow(info.nitroExpires)}`));
        }
        console.log(chalk.gray('└─') + chalk.white(` Ödeme Yöntemi: ${info.paymentMethods !== 'Alınamadı' && info.paymentMethods > 0 ? chalk.green(info.paymentMethods) : chalk.gray(info.paymentMethods)}`));

        if (info.flags && info.flags.length > 0) {
            console.log(chalk.white.bold('\n🏆 ROZETLER:'));
            info.flags.forEach((flag, i) => {
                const prefix = i === info.flags.length - 1 ? '└─' : '├─';
                console.log(chalk.gray(prefix) + ` ${flag}`);
            });
        }

        console.log(chalk.white.bold('\n📊 İSTATİSTİKLER:'));
        console.log(chalk.gray('├─') + chalk.white(` Sunucular: ${chalk.cyan(info.guilds)}`));
        console.log(chalk.gray('├─') + chalk.white(` Arkadaşlar: ${chalk.cyan(info.friends)}`));
        console.log(chalk.gray('└─') + chalk.white(` Engellenenler: ${chalk.cyan(info.blocked)}`));

        if (info.topGuilds && info.topGuilds.length > 0) {
            console.log(chalk.white.bold('\n🏰 İLK 5 SUNUCU:'));
            info.topGuilds.forEach((guild, i) => {
                const prefix = i === info.topGuilds.length - 1 ? '└─' : '├─';
                const ownerBadge = guild.owner ? chalk.yellow(' 👑') : '';
                console.log(chalk.gray(prefix) + chalk.white(` ${guild.name}${ownerBadge}`));
                console.log(chalk.gray('   ') + chalk.gray(`  ID: ${guild.id} | Üyeler: ${guild.members}`));
            });
        }

        console.log(chalk.white.bold('\n🔑 TOKEN:'));
        console.log(chalk.gray('└─') + chalk.red(` ${info.token}`));
        
        console.log(chalk.green('═══════════════════════════════════════════════════════════\n'));
    }

    // Geçersiz token göster
    displayInvalidToken(info, index) {
        console.log(chalk.red('═══════════════════════════════════════════════════════════'));
        console.log(chalk.red.bold(`❌ Token #${index} - GEÇERSİZ`));
        console.log(chalk.red('═══════════════════════════════════════════════════════════'));
        console.log(chalk.gray(`Hata: ${info.error}`));
        console.log(chalk.gray(`Token: ${info.token}`));
        console.log(chalk.red('═══════════════════════════════════════════════════════════\n'));
    }

    // Sonuçları göster
    displaySummary() {
        console.log(chalk.cyan('╔═══════════════════════════════════════════════════════════╗'));
        console.log(chalk.cyan('║') + chalk.white.bold('                      ÖZET RAPOR                          ') + chalk.cyan('║'));
        console.log(chalk.cyan('╠═══════════════════════════════════════════════════════════╣'));
        
        const totalText = ` Toplam Kontrol Edilen: ${this.checkedCount}`;
        const validText = ` Geçerli Token: ${this.validTokens.length}`;
        const invalidText = ` Geçersiz Token: ${this.invalidTokens.length}`;
        
        console.log(chalk.cyan('║') + chalk.white(totalText.padEnd(58)) + chalk.cyan('║'));
        console.log(chalk.cyan('║') + chalk.white(validText.padEnd(58)) + chalk.cyan('║'));
        console.log(chalk.cyan('║') + chalk.white(invalidText.padEnd(58)) + chalk.cyan('║'));
        console.log(chalk.cyan('╚═══════════════════════════════════════════════════════════╝'));

        // Geçerli tokenleri dosyaya kaydet
        if (this.validTokens.length > 0) {
            const validTokensData = this.validTokens.map(t => 
                `${t.tag} | ${t.id} | ${t.token}`
            ).join('\n');
            
            fs.writeFileSync('./valid_tokens.txt', validTokensData);
            console.log(chalk.green('\n✅ Geçerli tokenler valid_tokens.txt dosyasına kaydedildi!'));
        }

        // Geçersiz tokenleri dosyaya kaydet
        if (this.invalidTokens.length > 0) {
            const invalidTokensData = this.invalidTokens.map(t => 
                `${t.error} | ${t.token}`
            ).join('\n');
            
            fs.writeFileSync('./invalid_tokens.txt', invalidTokensData);
            console.log(chalk.red('❌ Geçersiz tokenler invalid_tokens.txt dosyasına kaydedildi!'));
        }
    }

    // Ana kontrol fonksiyonu
    async start() {
        console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════════════╗'));
        console.log(chalk.cyan.bold('║        🚀 GELİŞMİŞ DISCORD TOKEN CHECKER v1.0 🚀         ║'));
        console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════════════╝\n'));

        const tokens = this.readTokens();
        
        if (tokens.length === 0) {
            console.log(chalk.yellow('\n⚠️  Kontrol edilecek token bulunamadı!'));
            return;
        }

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            this.checkedCount++;
            
            console.log(chalk.blue(`\n⏳ Token ${i + 1}/${tokens.length} kontrol ediliyor...\n`));
            
            const result = await this.checkToken(token, i + 1);
            
            if (result.valid) {
                this.validTokens.push(result);
                this.displayTokenInfo(result, i + 1);
            } else {
                this.invalidTokens.push(result);
                this.displayInvalidToken(result, i + 1);
            }

            // Rate limiting için kısa bir bekleme
            if (i < tokens.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        this.displaySummary();
    }
}

// Programı başlat
const checker = new TokenChecker();
checker.start().catch(error => {
    console.log(chalk.red(`\n❌ Kritik Hata: ${error.message}`));
    console.log(chalk.gray(error.stack));
});
