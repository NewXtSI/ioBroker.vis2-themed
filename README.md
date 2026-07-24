# ioBroker.vis2-themed

Grundgeruest fuer einen ioBroker vis2 Widget-Adapter mit eigener Widget-Kategorie.

## Ziel

- Widget-Set im vis2 Editor: `vis2-themed`
- Start-Widget: `themed_checkbox`
- Weitere Widgets folgen im gleichen Muster, z. B. `themed_button`, `themed_slider`, `themed_progressbar`

## Struktur

- `io-package.json`: Adapter- und vis2-Widget-Metadaten
- `src-widgets/`: TypeScript/Vite Widget-Quellcode
- `tasks.js`: Build und Copy nach `widgets/vis2-themed`

## Build

```bash
npm install
npm run build
```

Der Build erzeugt/aktualisiert:

- `widgets/vis2-themed/customWidgets.js`
- `widgets/vis2-themed/assets/*`
- `widgets/vis2-themed/img/*`

## Erstes Widget

`themed_checkbox` bietet:

- Label-Text (`text`)
- State-Auswahl (`oid`)
- Schreiben von boolean nach `${oid}.val` beim Umschalten

## Naechste Schritte

1. `themed_button` mit `onClick` und optionalem Toggle-Modus
2. `themed_slider` fuer numerische States
3. `themed_progressbar` mit Min/Max und Farbthema