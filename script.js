
const SUPABASE_URL = "https://kinrrhbpxpyqixanmlsk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_MxuL0imgv3cRP5PhJ0WSBg_Rlzz2o--";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Mobil menüyü açıp kapat
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Menüyü kapat" : "Menüyü aç"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Menüden bir bölüme tıklanınca menüyü kapat
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Menüyü aç");
      menuToggle.textContent = "☰";
    });
  });
}

/* ITEMDROPCHECKER - OYUN ARAÇLARI */

const nickParcalari = [
  "Shadow", "Koin", "Vex", "Ghost",
  "Raven", "Zero", "Frost", "Nova",
  "Blaze", "Drake", "Void", "Reaper"
];

const takimIsimleri = [
  "Phantom Wolves", "Shadow Reign",
  "Void Hunters", "Night Ravens",
  "Crimson Force", "Neon Legends",
  "Dark Horizon", "Frost Giants",
  "Silent Storm", "Chaos Unit"
];

const oyunlar = [
  "VALORANT", "Minecraft", "Roblox",
  "League of Legends", "Counter-Strike 2",
  "Rocket League", "Brawl Stars",
  "EA SPORTS FC", "Terraria", "GTA V"
];

function rastgeleSec(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function nickOlustur() {
  const sayi = Math.floor(10 + Math.random() * 990);
  return rastgeleSec(nickParcalari) + sayi;
}

function takimOlustur() {
  return rastgeleSec(takimIsimleri);
}

function oyunSec() {
  return rastgeleSec(oyunlar);
}

console.log("ItemDropChecker oyun araçları hazır!");

function aracCalistir(tur) {
  if (tur === "nick") {
    const parcalar = [
      "Vex", "Ghost", "Nova", "Koin",
      "Shadow", "Frost", "Zero", "Raven",
      "Blaze", "Void", "Drake", "Reign"
    ];

    const nick =
      parcalar[Math.floor(Math.random() * parcalar.length)] +
      Math.floor(10 + Math.random() * 990);

    document.getElementById("nickSonuc").textContent = nick;
  }

  if (tur === "takim") {
    const isimler = [
      "Shadow Wolves", "Void Hunters",
      "Neon Legends", "Crimson Force",
      "Night Ravens", "Phantom Squad",
      "Frost Giants", "Silent Storm",
      "Dark Horizon", "Chaos Unit"
    ];

    const takim =
      isimler[Math.floor(Math.random() * isimler.length)];

    document.getElementById("takimSonuc").textContent = takim;
  }

  if (tur === "oyun") {
    const oyunlar = [
      "VALORANT", "Minecraft", "Roblox",
      "Brawl Stars", "League of Legends",
      "Counter-Strike 2", "Rocket League",
      "EA SPORTS FC", "Terraria", "GTA V"
    ];

    const oyun =
      oyunlar[Math.floor(Math.random() * oyunlar.length)];

    document.getElementById("oyunSonuc").textContent = oyun;
  }
}

function sonucuKopyala(id) {
  const alan = document.getElementById(id);
  const metin = alan.textContent;

  if (!metin || metin.includes("burada") || metin.includes("görünecek")) {
    alert("Önce bir sonuç üret kanka!");
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(metin)
      .then(() => alert("Kopyalandı: " + metin))
      .catch(() => alert("Kopyalama başarısız. Sonucu elle kopyalayabilirsin."));
  } else {
    alert("Sonucun: " + metin + "\nMetni seçip Ctrl+C ile kopyalayabilirsin.");
  }
}

/* GENEL SOHBET - SUPABASE */

const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatUsername = document.getElementById("chat-username");
const chatInput = document.getElementById("chat-input");
const chatStatus = document.getElementById("chat-status");

if (chatMessages && chatForm && chatUsername && chatInput) {
  async function mesajlariYukle() {
    const { data, error } = await supabaseClient
      .from("chat_messages")
      .select("id, username, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      chatMessages.textContent = "Mesajlar yüklenemedi.";
      if (chatStatus) chatStatus.textContent =
        "Veritabanı bağlantısını ve izinleri kontrol et.";
      console.error("Sohbet hatası:", error);
      return;
    }

    chatMessages.replaceChildren();

    if (!data || data.length === 0) {
      chatMessages.textContent = "Henüz mesaj yok. İlk mesajı sen yaz!";
      return;
    }

    data.reverse().forEach((mesaj) => {
      const satir = document.createElement("div");
      satir.className = "chat-message";

      const kullanici = document.createElement("strong");
      kullanici.textContent = mesaj.username + ": ";

      const metin = document.createElement("span");
      metin.textContent = mesaj.message;

      satir.append(kullanici, metin);
      chatMessages.appendChild(satir);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = chatUsername.value.trim();
    const message = chatInput.value.trim();

    if (!username || !message) {
      if (chatStatus) chatStatus.textContent =
        "Kullanıcı adını ve mesajını yaz.";
      return;
    }

    if (username.length > 24 || message.length > 500) {
      if (chatStatus) chatStatus.textContent =
        "Kullanıcı adı en fazla 24, mesaj 500 karakter olabilir.";
      return;
    }

    const gonderButonu = chatForm.querySelector('button[type="submit"]');
    if (gonderButonu) gonderButonu.disabled = true;
    if (chatStatus) chatStatus.textContent = "Gönderiliyor...";

    const { error } = await supabaseClient
      .from("chat_messages")
      .insert([{ username, message }]);

    if (error) {
      console.error("Mesaj gönderme hatası:", error);
      if (chatStatus) chatStatus.textContent =
        "Mesaj gönderilemedi. Bağlantıyı kontrol et.";
    } else {
      chatInput.value = "";
      if (chatStatus) chatStatus.textContent = "Mesaj gönderildi!";
      await mesajlariYukle();
    }

    if (gonderButonu) gonderButonu.disabled = false;
  });

  mesajlariYukle();
  setInterval(mesajlariYukle, 5000);
}
