# Funnel-Abbruch messen mit Microsoft Clarity — Design

**Datum:** 2026-06-01
**Kontext:** Google-Ads-Kampagne „Goldene Hochzeit Einladung". Keywords funktionieren (CTR 16–25 %), aber die LP ist der Engpass. Aktuell misst die Seite nur eine Conversion beim Etsy-Outbound-Klick (post-Consent) — wo Besucher *innerhalb* des Funnels abspringen, ist eine Blackbox.

## Ziel
Sichtbar machen, **wo** Besucher (v.a. 65+/Frau/Mobile) auf dem Weg *Anzeige → LP → Demo → Etsy* abbrechen. Bei niedrigem Traffic qualitativ (Session-Recording + Heatmaps), nicht quantitativ (Funnel-Zahlen wären Rauschen).

## Entscheidung
Microsoft Clarity (gratis, unbegrenzte Aufzeichnungen, Heatmaps, maskiert Eingaben). Bewusste Abwägung der Userin: **Erkenntnis > Datensparsamkeit** auf der Marketing-Seite (gilt nicht für die Werke/Käuferdaten).

## Architektur

### 1. Clarity auf LP **und** Demo-Seite
- Die Demo (`/atelier/goldene-hochzeit-einladung.html`) ist eine eigene Seite im neuen Tab. Die wichtigste Erkenntnis (versteht die Nutzerin das Ausfüllen?) passiert dort → Clarity muss auch dort laufen.
- Beide Seiten liegen auf `weddingstoryatelier.de` (gleiche Origin) → die Demo-Seite liest dieselbe Zustimmung aus `localStorage['wsa_consent']`. Kein zweiter Banner.

### 2. Consent-Anbindung
- **LP & alle Layout-Seiten:** Clarity-Loader in `CookieBanner.astro`, ausgelöst exakt wie `loadGtag()` — nur wenn `wsa_consent === 'granted'` (gespeichert oder frisch per „Akzeptieren"). Ein gemeinsamer `loadTracking()`-Pfad lädt gtag + Clarity.
- **Demo-Seite:** kleiner Inline-Loader, der beim Laden `localStorage['wsa_consent'] === 'granted'` prüft und nur dann Clarity startet. Kein Consent → kein Clarity.

### 3. Maskierung (DSGVO)
- Clarity-Maskierungsmodus „Balanced" (Standard) maskiert Formulareingaben automatisch.
- Zusätzlich an den Demo-Feldern (`.field`) explizit absichern (Clarity respektiert `data-clarity-mask` / Standard-Input-Maskierung). Es wird erfasst *dass/wo* getippt wird, nie *was*.

### 4. Filter-Events
Zwei `clarity('event', …)`-Marker zum Filtern relevanter Sitzungen:
- `demo_geoeffnet` — beim Klick auf einen Demo-Link (LP)
- `etsy_klick` — am bestehenden `data-conversion`-Link (parallel zur Ads-Conversion)

## Manuelle Voraussetzungen (Userin, einmalig)
1. Gratis-Clarity-Konto anlegen → **Projekt-ID** notieren.
2. In Clarity: **EU-Datenregion** wählen + **AV-Vertrag (DPA)** akzeptieren.
3. Projekt-ID an Claude geben → wird als Konstante eingsetzt (analog `GTAG_ID`).

## Datenschutz-Ergänzung (von Claude eingebaut)
Neuer Absatz unter „Werbe- und Conversion-Tracking" in `datenschutz.astro`:
> **Microsoft Clarity.** Zur Verbesserung unserer Seiten nutzen wir Microsoft Clarity (Microsoft Ireland Operations Ltd.). Clarity zeichnet pseudonymisierte Nutzungsdaten (Maus-/Tippbewegungen, Scrollen, Klicks) auf; Texteingaben werden dabei maskiert und nicht im Klartext gespeichert. Dies geschieht nur mit Ihrer Einwilligung (Cookie-Banner) und ist jederzeit widerrufbar.

## Bewusst draußen (YAGNI)
- **Kein GA4-Funnel** jetzt — Zahlen bei ~14 Klicks sind Rauschen. Später bei mehr Traffic nachrüstbar.
- **Keine zweite** Heatmap-/Replay-Lösung.
- **Etsy-Kauf bleibt unsichtbar** (fremde Domain) — nur per Abgleich mit Etsy-Statistik, kein Tool löst das.

## Dateien (Umsetzung)
- `src/components/CookieBanner.astro` — `loadClarity()` + ID-Konstante, an Consent gehängt
- `public/atelier/goldene-hochzeit-einladung.html` — consent-aware Clarity-Loader
- `src/pages/einladung-goldene-hochzeit.astro` — `clarity('event', …)`-Marker an Demo-/Etsy-Links
- `src/pages/datenschutz.astro` — Clarity-Absatz
