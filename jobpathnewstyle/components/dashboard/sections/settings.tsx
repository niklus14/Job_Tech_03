"use client";

import { useState } from "react";
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  User,
  Mail,
  Smartphone,
  Link,
  Eye,
  EyeOff,
  QrCode,
  Download,
  Trash2,
  ChevronRight,
  ExternalLink,
  Check
} from "lucide-react";

export function SettingsSection() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    dailyDigest: true,
    weeklyReport: false,
    jobAlerts: true,
    marketUpdates: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showSalary: false,
    showEmail: false,
    showPhone: false
  });

  const [language, setLanguage] = useState("az");

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Profil Ayarları</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xl font-semibold text-accent-foreground">
                EN
              </div>
              <div>
                <p className="font-medium text-foreground">Elvin Nuriyev</p>
                <p className="text-sm text-muted-foreground">Senior Frontend Developer</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
              Şəkil Dəyiş
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Ad Soyad</label>
              <input 
                type="text" 
                defaultValue="Elvin Nuriyev"
                className="mt-1 w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">E-poçt</label>
              <input 
                type="email" 
                defaultValue="elvin@example.com"
                className="mt-1 w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Telefon</label>
              <input 
                type="tel" 
                defaultValue="+994 50 123 45 67"
                className="mt-1 w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Yer</label>
              <input 
                type="text" 
                defaultValue="Bakı, Azərbaycan"
                className="mt-1 w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          <button className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
            Dəyişiklikləri Saxla
          </button>
        </div>
      </div>

      {/* Public Profile */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Açıq Profil</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm">
            <Check className="w-4 h-4" />
            Aktiv
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/30 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Profil linkiniz:</span>
            <button className="text-accent text-sm hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Bax
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value="jobpath.az/elvinnuriyev"
              readOnly
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
            />
            <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
              Kopyala
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">QR Kod</p>
              <p className="text-xs text-muted-foreground">CV linkiniz üçün QR kod yaradın</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Yüklə
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Bildirişlər</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "email", icon: Mail, label: "E-poçt bildirişləri", desc: "Yeni uyğun işlər haqqında e-poçt alın" },
            { key: "push", icon: Smartphone, label: "Push bildirişlər", desc: "Brauzer və mobil bildirişlər" },
            { key: "dailyDigest", icon: Bell, label: "Günlük xülasə", desc: "Hər səhər uyğun işlərin xülasəsi" },
            { key: "weeklyReport", icon: Bell, label: "Həftəlik hesabat", desc: "Karyera inkişafı haqqında həftəlik hesabat" },
            { key: "jobAlerts", icon: Bell, label: "İş bildirişləri", desc: "Yeni uyğun iş tapıldıqda ani bildiriş" },
            { key: "marketUpdates", icon: Bell, label: "Bazar yenilikləri", desc: "Bazar trendləri haqqında yeniliklər" },
          ].map((item) => {
            const Icon = item.icon;
            const isEnabled = notifications[item.key as keyof typeof notifications];
            return (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    isEnabled ? "bg-accent" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-foreground transition-transform ${
                      isEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Gizlilik</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "publicProfile", label: "Açıq profil", desc: "Profiliniz şirkətlərə görünsün" },
            { key: "showSalary", label: "Maaş gözləntisini göstər", desc: "Maaş gözləntiniz profilinizdə görünsün" },
            { key: "showEmail", label: "E-poçtu göstər", desc: "E-poçtunuz profilinizdə görünsün" },
            { key: "showPhone", label: "Telefonu göstər", desc: "Telefonunuz profilinizdə görünsün" },
          ].map((item) => {
            const isEnabled = privacy[item.key as keyof typeof privacy];
            return (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  {isEnabled ? <Eye className="w-5 h-5 text-accent" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    isEnabled ? "bg-accent" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-foreground transition-transform ${
                      isEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Language */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Dil</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { code: "az", label: "Azərbaycan" },
            { code: "en", label: "English" },
            { code: "ru", label: "Русский" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                language === lang.code
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-destructive">Təhlükəli Zona</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Hesabınızı silmək bütün məlumatlarınızı, CV-nizi və iş tarixçənizi birdəfəlik siləcək. Bu əməliyyat geri qaytarıla bilməz.
        </p>

        <button className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
          Hesabı Sil
        </button>
      </div>
    </div>
  );
}
