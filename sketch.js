const printerConnection = 'ws://10.21.8.225:8080' // WebSocket-Adresse des Druckers
const printerWidth = 230 // Breite des Druckbereichs (in Pixeln)
let socket;               // WebSocket-Objekt
let printerState = 'not ok' // Statusanzeige der Verbindung

// Asynchrone Funktion zum Senden von Text an den Drucker
async function sendText(text, w, h, style, cut) {
  cut = cut || false       // Default: kein Papier schneiden
  style = style || ''      // Default: kein spezieller Stil
  w = w || 0               // Default: normale Breite
  h = h || 0               // Default: normale Höhe

  // Prüfen, ob Text vorhanden und Socket offen ist
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("Socket nicht bereit oder Text leer")
    return
  }

  // Datenobjekt vorbereiten
  const sendData = JSON.stringify({
    text: text,  // Textinhalt
    w: w,        // Breite
    h: h,        // Höhe
    style: style,// Stil (b, u, bu)
    cut: cut,    // Papier schneiden ja/nein
  });

  // Promise, das auf die Antwort vom Server wartet
  return new Promise((resolve, reject) => {
    // Event-Listener für einmalige Antwort
    const handler = (event) => {
      socket.removeEventListener('message', handler) // Listener wieder entfernen
      if (event.data == 'ok')
        resolve(event.data) // Server bestätigt erfolgreich
      else
        reject(event.data)  // Server meldet Fehler
    }
    socket.addEventListener('message', handler) // Listener registrieren

    try {
      socket.send(sendData)   // Daten an den Drucker senden
      console.log("Sent:", sendData)
    } catch (e) {
      reject('socket error')  // Fehler beim Senden
    }
  })
}

// Setup-Funktion: wird einmalig beim Start ausgeführt
function setup() {
  createCanvas(printerWidth, 2 * printerWidth) // Canvas nur zur Anzeige des Status

  // WebSocket-Verbindung zum Drucker erstellen
  socket = new WebSocket(printerConnection)

  // Event-Handler: Verbindung erfolgreich
  socket.onopen = () => {
    printerState = 'Connected to printer'
  }

  // Event-Handler: Fehler
  socket.onerror = () => {
    printerState = `WebSocket Error`
  }

  // Event-Handler: Verbindung geschlossen
  socket.onclose = () => {
    console.log("Connection closed")
  }

  // UI-Elemente
  const prompt = createElement('textarea', 'Write Something...') // Eingabefeld
  const button = createButton('Print')                          // Druck-Button

  // Button-Klick: Text an Drucker senden
  button.mousePressed(async () => {
    try {
      // Jede Variante nacheinander senden und auf Server-Antwort warten
      const resp1 = await sendText(prompt.value(), 0, 0, '', false)
      console.log("Server responded:", resp1)

      const resp2 = await sendText(prompt.value(), 0, 1, '', false)
      console.log("Server responded:", resp2)

      const resp3 = await sendText(prompt.value(), 1, 0, 'b', false)
      console.log("Server responded:", resp3)

      const resp4 = await sendText(prompt.value(), 1, 1, 'bu', true)
      console.log("Server responded:", resp4)
    } catch (err) {
      console.error(err) // Fehler vom Server oder Socket
    }
  })
}

// Draw-Funktion: Anzeige des Druckerstatus im Canvas
function draw() {
  background(220)                // Hellgrauer Hintergrund
  text(printerState, 10, 20)    // Statustext anzeigen
}