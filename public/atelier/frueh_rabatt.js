/* Wedding Story Atelier — Frühstarter-Rabatt-Karte (geteiltes Modul) · v20260612
 *
 * Zeigt überall dieselbe sichtbare "20 % Atelier-Rabatt"-Karte. Der Knopf liefert
 * die WILLKOMMENSMAPPE-PDF aus (downloadWillkommensmappe) — der Rabattcode steckt
 * IM Paket, NICHT als offener Link/Code auf der Seite. KEIN direkter Etsy-Sprung.
 *
 * Die PDF-Engine (jsPDF + html2canvas + willkommensmappe.js) wird BEI KLICK
 * selbst nachgeladen (Lazy-Load) — so brauchen die Demos keine eigenen Lib-Tags
 * und das Online-Demo-Pattern (kein Produkt-Export im Markup) bleibt erhalten.
 *
 * Einbau pro Seite:
 *   <div id="frueh-rabatt" data-lang="de"></div>
 *   <script src="frueh_rabatt.js?v=20260612"></script>   (in /demos/ absolut: /atelier/frueh_rabatt.js)
 * Mehrsprachig: im eigenen setLang() zusätzlich  if(window.setRabattLang) window.setRabattLang(lang);
 */
(function () {
  var MAPPE = "/geschenke/willkommensmappe.js?v=20260611d";
  var JSPDF = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  var H2C = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

  var T = {
    de: {
      eyebrow: "Frühstarter-Vorteil · für die ersten Paare",
      headline: "20 % Atelier-Rabatt",
      text: "Wir sind ein junges Atelier — sichere dir deinen Willkommens-Code für deine erste Bestellung.",
      btn: "Rabattcode sichern",
      loading: "Wird geladen …",
    },
    en: {
      eyebrow: "Early-bird perk · for our first couples",
      headline: "20 % atelier discount",
      text: "We're a young atelier — grab your welcome code for your first order.",
      btn: "Get your discount code",
      loading: "Loading …",
    },
  };

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = function () { rej(new Error("Konnte nicht laden: " + src)); };
      document.head.appendChild(s);
    });
  }

  // Knopf-Handler: lädt bei Bedarf die PDF-Engine nach, dann die Willkommensmappe.
  window.fruehRabattDownload = async function (btn) {
    var box = document.getElementById("frueh-rabatt");
    var lang = box && box.getAttribute("data-lang") === "en" ? "en" : "de";
    var orig = btn ? btn.textContent : null;
    try {
      if (btn) { btn.disabled = true; btn.textContent = T[lang].loading; }
      if (typeof window.downloadWillkommensmappe !== "function") {
        if (!window.jspdf) await loadScript(JSPDF);
        if (typeof window.html2canvas !== "function") await loadScript(H2C);
        await loadScript(MAPPE);
      }
      if (typeof window.downloadWillkommensmappe === "function") {
        window.downloadWillkommensmappe(); // Default = wedding (aktuelles Paar)
      }
    } catch (e) {
      console.error("Willkommensmappe konnte nicht geladen werden:", e);
    } finally {
      if (btn) { btn.disabled = false; if (orig) btn.textContent = orig; }
    }
  };

  function render(lang) {
    var box = document.getElementById("frueh-rabatt");
    if (!box) return;
    var l = T[lang] || T.de;
    box.setAttribute("data-lang", lang);
    box.innerHTML =
      '<div style="margin-top:14px; border:1px solid #C9A84C; background:rgba(201,168,76,0.10); border-radius:4px; padding:18px 18px 16px; text-align:center;">' +
      '<p style="font-family:\'Cormorant Garamond\',serif; font-style:italic; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; color:#9c7b1a; margin:0 0 5px;">' + l.eyebrow + "</p>" +
      '<p style="font-family:\'Playfair Display\',\'Cormorant Garamond\',serif; font-size:23px; color:#0D3D2A; line-height:1.1; margin:0 0 7px;">' + l.headline + "</p>" +
      '<p style="font-family:\'Cormorant Garamond\',serif; font-size:14px; line-height:1.5; color:#1C1408; margin:0 0 13px;">' + l.text + "</p>" +
      '<button type="button" onclick="fruehRabattDownload(this)" style="width:100%; padding:12px; background:#0D3D2A; color:#fff; border:none; border-radius:2px; cursor:pointer; font-family:\'Cormorant Garamond\',serif; font-size:14px; letter-spacing:0.14em; text-transform:uppercase;">' + l.btn + "</button>" +
      "</div>";
  }

  window.setRabattLang = function (lang) {
    render(lang === "en" ? "en" : "de");
  };

  function init() {
    var box = document.getElementById("frueh-rabatt");
    if (!box) return;
    render(box.getAttribute("data-lang") === "en" ? "en" : "de");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
