/* ════════════════════════════════════════════════════════════════
   Wedding Story Atelier — Willkommensmappe (geteiltes Modul)
   Einbinden:  <script src="willkommensmappe.js?v=20260610"></script>
   Voraussetzung im Host: jsPDF (umd) + html2canvas geladen.

   API:
     window.downloadWillkommensmappe()        → erzeugt + speichert das PDF
     window.previewWillkommensmappe('id')      → rendert die Karte sichtbar in #id

   CSS ist unter #wsa-mappe gekapselt — kollidiert NICHT mit der Demo.
   ════════════════════════════════════════════════════════════════ */
(function () {
  // Schriften kommen per CDN (siehe ensure()) — dieselben, die die Demo lädt.
  // Macht das Modul selbst-versorgend und deploy-sicher (keine lokalen Font-Pfade).
  var FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap';

  var CSS = `
  #wsa-mappe-root { position:fixed; left:-9999px; top:0; pointer-events:none; z-index:-1; }

  #wsa-mappe {
    --green:#0D3D2A; --gold:#C9A84C; --gold-soft:rgba(201,168,76,0.30);
    --cream:#FAF7F2; --ink:#1C1408; --ink-soft:rgba(28,20,8,0.86);
    width:720px; height:1018px; position:relative; background:var(--cream);
    overflow:hidden; display:flex; flex-direction:column;
    font-family:'DM Sans',sans-serif; box-sizing:border-box;
  }
  #wsa-mappe *, #wsa-mappe *::before, #wsa-mappe *::after { box-sizing:border-box; margin:0; padding:0; }
  #wsa-mappe::before { content:''; position:absolute; inset:14px; border:1.5px solid var(--gold-soft); pointer-events:none; z-index:4; }
  #wsa-mappe::after  { content:''; position:absolute; inset:20px; border:0.5px solid rgba(201,168,76,0.22); pointer-events:none; z-index:4; }

  #wsa-mappe .head { background:var(--green); color:#fff; padding:36px 60px 28px; text-align:center; position:relative; }
  #wsa-mappe .wordmark { display:flex; align-items:center; justify-content:center; gap:16px; max-width:330px; margin:0 auto 20px; }
  #wsa-mappe .wm-line { flex:1; height:1px; background:var(--gold); opacity:.8; }
  #wsa-mappe .wm-text { font-family:'Cormorant Garamond',serif; font-style:italic; color:var(--gold); font-size:14px; letter-spacing:0.20em; white-space:nowrap; }
  #wsa-mappe .head h1 { font-family:'Playfair Display',serif; font-weight:400; font-size:31px; letter-spacing:0.07em; line-height:1.16; }
  #wsa-mappe .head .thanks { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:16px; color:rgba(255,255,255,0.78); margin-top:9px; }

  #wsa-mappe .body { padding:36px 62px 0; }
  #wsa-mappe .body p { font-family:'Cormorant Garamond',serif; font-size:15.5px; line-height:1.55; color:var(--ink-soft); margin-bottom:15px; }
  #wsa-mappe .body p.lead { color:var(--ink); }
  #wsa-mappe .gold-rule { width:54px; height:0; border-top:1.5px solid var(--gold); margin:22px auto; }

  #wsa-mappe .gift { border:1px solid var(--gold); background:rgba(201,168,76,0.07); padding:23px 28px; text-align:center; margin:22px 0 20px; }
  #wsa-mappe .g-eyebrow { font-family:'DM Sans',sans-serif; font-size:9.5px; letter-spacing:0.28em; text-transform:uppercase; color:#9c7b1a; margin-bottom:12px; }
  #wsa-mappe .g-headline { font-family:'Playfair Display',serif; font-size:27px; color:var(--green); line-height:1.15; margin-bottom:10px; }
  #wsa-mappe .g-code { font-family:'DM Sans',sans-serif; font-size:18px; font-weight:600; letter-spacing:0.10em; color:var(--green); }
  #wsa-mappe .g-code span { color:var(--gold); }
  #wsa-mappe .g-fine { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:13.5px; color:var(--ink-soft); margin-top:6px; }
  #wsa-mappe .g-cta { font-family:'Cormorant Garamond',serif; font-size:15px; color:var(--ink); margin-top:14px; line-height:1.5; }
  #wsa-mappe .g-cta a { color:var(--green); font-weight:600; text-decoration:none; border-bottom:1px solid var(--gold); }

  #wsa-mappe .offer-intro { font-family:'Cormorant Garamond',serif; font-size:16px; color:var(--ink); margin-bottom:9px; }
  #wsa-mappe .offer { list-style:none; margin:6px 0 18px; }
  #wsa-mappe .offer li { font-family:'Cormorant Garamond',serif; font-size:15.5px; color:var(--ink-soft); padding:3.5px 0 3.5px 24px; position:relative; }
  #wsa-mappe .offer li::before { content:'\\2661'; position:absolute; left:2px; color:var(--gold); font-size:13px; top:5px; }

  #wsa-mappe .body p.closing { text-align:center; font-family:'Cormorant Garamond',serif; font-style:italic; font-size:26px; line-height:1.3; color:var(--green); margin-top:4px; margin-bottom:0; }

  #wsa-mappe .foot { margin-top:auto; padding:14px 0 36px; text-align:center; }
  #wsa-mappe .f-name { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:14px; letter-spacing:0.10em; color:var(--green); }
  #wsa-mappe .f-url { font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.10em; color:#9c7b1a; margin-top:4px; }
  `;

  var HTML = `
  <div id="wsa-mappe">
    <div class="head">
      <div class="wordmark">
        <span class="wm-line"></span>
        <span class="wm-text">Wedding Story Atelier</span>
        <span class="wm-line"></span>
      </div>
      <h1>WELCOME TO<br>THE ATELIER</h1>
      <div class="thanks">Vielen Dank f&uuml;r deinen Download.</div>
    </div>
    <div class="body">
      <p class="lead">Wedding Story Atelier ist ein junges Designatelier aus der Region Heidelberg. Wir gestalten moderne Hochzeitsvorlagen f&uuml;r Paare, die zeitlose Eleganz und durchdachtes Design sch&auml;tzen.</p>
      <p>Da unser Atelier noch neu ist, geh&ouml;rst du zu den ersten Paaren, die unsere Designs entdecken. Als Dankesch&ouml;n erh&auml;ltst du unseren Fr&uuml;hstarter-Vorteil:</p>
      <div class="gift">
        <div class="g-eyebrow">Dein Fr&uuml;hstarter-Vorteil</div>
        <div class="g-headline">20 % auf deine erste Bestellung</div>
        <div class="g-code">Code: <span>FRUEHSTARTER20</span></div>
        <div class="g-fine">G&uuml;ltig auf deinen gesamten Warenkorb.</div>
        <div class="g-cta">&rarr; Besuche unseren Etsy-Shop, leg deine Lieblingsvorlagen in den Warenkorb und gib den Code beim Bezahlen ein.<br><a href="https://weddingstoryatelier.etsy.com?coupon=FRUEHSTARTER20">weddingstoryatelier.etsy.com</a></div>
      </div>
      <p>Vielleicht planst du gerade erst eure Hochzeit. Vielleicht fehlen nur noch die letzten Details.</p>
      <div class="offer-intro">Im Atelier findest du Vorlagen f&uuml;r viele Momente eurer Feier:</div>
      <ul class="offer">
        <li>Einladungen &amp; Save-the-Date-Karten</li>
        <li>Geld-statt-Geschenke-Karten</li>
        <li>Bridal Shower Vorlagen</li>
        <li>Tischnummern &amp; Papeterie</li>
        <li>Willkommensmappen f&uuml;r G&auml;ste</li>
      </ul>
      <div class="gold-rule"></div>
      <p class="closing">Sch&ouml;n, dass du hier bist.</p>
    </div>
    <div class="foot">
      <div class="f-name">Wedding Story Atelier &middot; Heidelberg</div>
      <div class="f-url">weddingstoryatelier.etsy.com</div>
    </div>
  </div>`;

  function ensure() {
    if (!document.getElementById('wsa-mappe-fonts')) {
      var lk = document.createElement('link');
      lk.id = 'wsa-mappe-fonts';
      lk.rel = 'stylesheet';
      lk.href = FONTS_HREF;
      document.head.appendChild(lk);
    }
    if (!document.getElementById('wsa-mappe-style')) {
      var s = document.createElement('style');
      s.id = 'wsa-mappe-style';
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    if (!document.getElementById('wsa-mappe-root')) {
      var c = document.createElement('div');
      c.id = 'wsa-mappe-root';
      c.innerHTML = HTML;
      document.body.appendChild(c);
    }
    return document.getElementById('wsa-mappe');
  }

  window.downloadWillkommensmappe = async function () {
    var node = ensure();
    if (document.fonts && document.fonts.load) {
      try {
        await Promise.all([
          document.fonts.load('400 16px "Playfair Display"'),
          document.fonts.load('600 16px "Playfair Display"'),
          document.fonts.load('400 16px "Cormorant Garamond"'),
          document.fonts.load('italic 400 16px "Cormorant Garamond"'),
          document.fonts.load('400 16px "DM Sans"'),
          document.fonts.load('600 16px "DM Sans"')
        ]);
      } catch (e) {}
    }
    if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
    await new Promise(function (r) { setTimeout(r, 150); });
    var canvas = await html2canvas(node, { scale: 3, backgroundColor: '#FAF7F2', useCORS: true, logging: false });
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    pdf.save('Willkommensmappe_Wedding_Story_Atelier.pdf');
  };

  // Karte sichtbar in ein Zielelement rendern (für die Vorschau-Seite)
  window.previewWillkommensmappe = function (targetId) {
    ensure();
    var root = document.getElementById('wsa-mappe-root');
    var tgt = document.getElementById(targetId);
    if (tgt && root) {
      root.style.position = 'static';
      root.style.left = 'auto';
      root.style.pointerEvents = 'auto';
      root.style.zIndex = 'auto';
      tgt.appendChild(root);
    }
  };
})();
