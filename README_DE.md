# P5.js: Thermal Printer Lines

[English](readme.md)

Schickt Text aus einem Textfeld per WebSocket an einen
Thermodrucker-Server. Ein Klick druckt den Text viermal in verschiedenen
Grössen und Stilen und schneidet dann das Papier ab. Jeder Befehl wartet
auf das `ok` des Servers, bevor der nächste gesendet wird. Ein
Ausgangspunkt, um Text auf einem Bondrucker auszugeben.

## Installation

Bibliotheken (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (eingebunden,
nicht verwendet).

Lizenz: MIT

## Server

Braucht `printer-websockets` aus
[Servers_RaspberriPi](https://github.com/ZHdK-Critical-Coding/Servers_RaspberriPi)
(WebSocket, Port 8080), auf einem Raspberry Pi mit einem
ESC/POS-Thermodrucker an USB, im selben Netzwerk wie dein Computer. Zuerst
im Ordner mit `bash run.sh` (oder `node printer.js`) starten. Er druckt
JSON-Textbefehle und Bilder und antwortet mit `ok`. In `sketch.js`
`printerConnection` auf seine Adresse setzen (Standard
`ws://10.21.8.225:8080`).

## Ausführen

1. Sicherstellen, dass der Drucker-Server läuft (siehe Server).
2. Den Ordner in Visual Studio Code öffnen und Live Server starten (in der
   Statusleiste auf **Go Live** klicken).
3. Text ins Textfeld schreiben und auf **Print** klicken.

Der Verbindungsstatus wird auf der Zeichenfläche angezeigt.

## Coding-Hilfe

- **`sketch.js` → Konfiguration oben**: `printerConnection` ist die Adresse
  des Servers. `printerWidth` bestimmt nur die Grösse der
  Status-Zeichenfläche.
- **`sendText(text, w, h, style, cut)`**: sendet
  `{ text, w, h, style, cut }` als JSON und gibt ein Promise zurück, das
  bei `ok` erfüllt wird und bei jeder anderen Antwort scheitert. `w` 0/1 =
  normal/breit, `h` 0/1 = normal/doppelt hoch, `style` `'b'` fett, `'u'`
  unterstrichen, `'bu'` beides, `cut` true schneidet das Papier nach dem
  Druck ab.
- **`setup()`**: öffnet den WebSocket und erstellt Textfeld und
  **Print**-Knopf. Der Handler des Knopfs ruft `sendText()` viermal
  nacheinander mit `await` auf – diese Aufrufe für ein eigenes Layout
  anpassen.
- **`draw()`**: zeigt den Verbindungsstatus auf der Zeichenfläche an.
