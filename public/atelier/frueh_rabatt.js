/* Wedding Story Atelier — Frühstarter-Rabatt-Karte (geteiltes Modul)
 *
 * Demo-Variante des Rabatt-Blocks: zeigt überall dieselbe sichtbare
 * "20 % Atelier-Rabatt"-Karte. Anders als die Geschenke (die laden die
 * Willkommensmappe-PDF via willkommensmappe.js) führt der Knopf hier direkt
 * zur Etsy-Auto-Einlöse-URL — so brauchen die Etsy-Demos KEINE PDF-Libs
 * (jsPDF/html2canvas) und das Demo-Pattern (kein Produkt-Export) bleibt intakt.
 *
 * Einbau pro Demo:
 *   <div id="frueh-rabatt" data-lang="de"></div>   (data-lang optional, Default "de")
 *   <script src="frueh_rabatt.js?v=20260611"></script>
 * Bei mehrsprachigen Demos im eigenen setLang() zusätzlich:
 *   if (window.setRabattLang) window.setRabattLang(lang);
 */
(function () {
  var COUPON = "FRUEHSTARTER20";
  var ETSY_URL = "https://weddingstoryatelier.etsy.com?coupon=" + COUPON;

  var T = {
    de: {
      eyebrow: "Frühstarter-Vorteil · für die ersten Paare",
      headline: "20 % Atelier-Rabatt",
      text: "Wir sind ein junges Atelier — sichere dir deinen Willkommens-Code für deine erste Bestellung.",
      btn: "Rabatt auf Etsy einlösen",
      code: "Code:",
    },
    en: {
      eyebrow: "Early-bird perk · for our first couples",
      headline: "20 % atelier discount",
      text: "We're a young atelier — grab your welcome code for your first order.",
      btn: "Redeem on Etsy",
      code: "Code:",
    },
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
      '<a href="' + ETSY_URL + '" target="_blank" rel="noopener" style="display:block; box-sizing:border-box; width:100%; padding:12px; background:#0D3D2A; color:#fff; border-radius:2px; font-family:\'Cormorant Garamond\',serif; font-size:14px; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none;">' + l.btn + "</a>" +
      '<p style="font-family:\'Cormorant Garamond\',serif; font-size:12px; letter-spacing:0.1em; color:#9c7b1a; margin:9px 0 0;">' + l.code + ' <strong style="letter-spacing:0.14em;">' + COUPON + "</strong></p>" +
      "</div>";
  }

  // Sprachumschaltung für mehrsprachige Demos.
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
