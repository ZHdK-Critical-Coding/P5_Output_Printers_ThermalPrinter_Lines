# P5.js: Thermal Printer Lines

[Deutsch](README_DE.md)

Sends text from a text field to a thermal printer server over WebSocket.
One click prints the text four times in different sizes and styles and
then cuts the paper. Each command waits for the server's `ok` before the
next one is sent. A starting point for printing text output on a receipt
printer.

## Installation

Requirements: a thermal printer server that accepts JSON text commands
over WebSocket and answers with `ok`, reachable from your computer's
network.

1. Make sure the printer server is running.
2. Set `printerConnection` in `sketch.js` to the server address (default
   `ws://10.21.8.225:8080`).
3. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
4. Type into the text field and click **Print**.

The connection status is shown on the canvas.

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not used).

License: MIT

## Coding Help

- **`sketch.js` → config at the top**: `printerConnection` is the server
  address. `printerWidth` only sets the size of the status canvas.
- **`sendText(text, w, h, style, cut)`**: sends
  `{ text, w, h, style, cut }` as JSON and returns a Promise that resolves
  on `ok` and rejects on any other answer. `w` 0/1 = normal/wide, `h` 0/1 =
  normal/double height, `style` `'b'` bold, `'u'` underlined, `'bu'` both,
  `cut` true cuts the paper after printing.
- **`setup()`**: opens the WebSocket and creates the text field and the
  **Print** button. The button handler calls `sendText()` four times in a
  row with `await` – change these calls to set your own layout.
- **`draw()`**: shows the connection status on the canvas.
