/* Wedding Story Atelier — Demo-Felder · v20260612
 *
 * Vorbefüllte Beispiel-Texte (echte input/textarea-values, statisch oder via
 * loadDemo gesetzt) verschwinden beim ERSTEN Klick in ein Feld — so tippt man
 * direkt den eigenen Text, statt erst löschen zu müssen.
 *
 * Greift pro Feld nur EINMAL (erster Fokus) und nur solange es noch den
 * Demo-Wert trägt. Eigene Eingaben werden NIE automatisch geleert. Funktioniert
 * auch für später per JS hinzugefügte Felder (delegiert über document).
 *
 * Einbau: <script src="/atelier/demo_fields.js?v=20260612"></script>
 */
(function () {
  function clearable(el) {
    if (!el || !el.matches) return false;
    if (el.dataset.demoTouched) return false;
    if (el.closest && el.closest("#frueh-rabatt")) return false; // Rabatt-Karte ausnehmen
    return el.matches('input[type="text"], input:not([type]), textarea');
  }

  document.addEventListener("focusin", function (e) {
    var el = e.target;
    if (!clearable(el)) return;
    el.dataset.demoTouched = "1"; // ab jetzt nie wieder automatisch leeren
    if (el.value && el.value.trim() !== "") {
      el.value = "";
      // Vorschau/Export synchron halten (löst das jeweilige oninput aus)
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
})();
