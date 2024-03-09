const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const fs = require("fs");

const PORT = 3000;
const map = new Map();

app.get("/save/:params*", async (req, res) => {
  try {
    let endpoint = req.params.params;

    if (!endpoint) {
      const generateRandomString = () => [...Array(8 + Math.floor(Math.random() * 3))].map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
      return res.redirect(`/save/${generateRandomString()}`);
    }

    endpoint = `/${endpoint}`;

    if (map.has(endpoint)) {
      const data = fs.readFileSync("app/save.html", 'utf-8');
      const textData = map.get(endpoint);
      const HTML = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Share Text/Code</title>
  <meta name="description" content="A platform for sharing code or text with dynamic real-time updates">
  <meta name="keywords" content="share, text, code, snippets, pastebin, savetext, text">
  <meta name="author" content="Mike Harrison">
  <meta property="og:title" content="Share Texts/Codes">
  <meta property="og:description" content="A platform to share and save text or code snippets">
  <meta property="og:image" content="https://github.com/SatoX69/Pastebin-Clone">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:description" content="A platform to share and save text or code snippets">
  <meta name="twitter:image" content="https://github.com/SatoX69/Pastebin-Clone">

  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f8ff;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    #container {
      height: 93vh;
      width: 85vw;
      max-width: 920px;
      padding: 20px;
      box-sizing: border-box;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    textarea {
      width: calc(100% - 0px);
      height: 98%;
      margin: 10px 0;
      box-sizing: border-box;
      border: 2px solid #87CEEB;
      border-radius: 10px;
      padding: 15px;
      padding-top: 20px;
      font-family: inherit;
      resize: none;
      outline: none;
    }

    #copyButton,
    #rawButton {
      position: absolute;
      top: 10px;
      cursor: pointer;
      padding: 10px;
      border-radius: 5px;
      color: #ffffff;
    }

    #copyButton {
      left: 10px;
      background-color: #87CEEB;
    }

    #rawButton {
      right: 10px;
      background-color: #87CEEB;
    }
  </style>
</head>

<body>
  <div id="container">
    <button id="copyButton" onclick="copyToClipboard()">Copy</button>
    <button id="rawButton" onclick="redirectToRaw()">Raw</button>
    <textarea id="text" onclick="disableZoom(event)">${textData}</textarea>
  </div>

  <script>
    function disableZoom(event) { event.preventDefault(); }

    const textarea = document.getElementById('text');
    textarea.addEventListener('input', (event) => { if (!event.target.value.length || event.target.value.length == 0) return; const data = { bool: true, text: event.target.value, uri: window.location.pathname };
      fetch('/save', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(data), }); });

    function redirectToRaw() { window.location.href = \`/raw${window.location.pathname}\`; }

    function copyToClipboard() { const textArea = document.getElementById('text');
      textArea.select();
      document.execCommand('copy');
      console.log("Copied"); }
  </script>
</body>

</html>`;
      return res.contentType('text/html').send(HTML);
    } else {
      return res.send(fs.readFileSync("app/save.html", 'utf-8'));
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

app.post("/save", async (req, res) => {
  try {
    let { bool, text, uri } = req.body;
    if (!bool || !text || !uri) return res.status(400).end();

    const formattedUri = uri.replace(/^\/save\//, "/");
    text = text.replace("\n", "\n");
    map.set(formattedUri, text);
    res.status(200).end()
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

app.get("/raw/:params*", async (req, res) => {
  try {
    const endpoint = req.params['0'];
    const data = map.get(endpoint);

    if (!data) return res.status(404).end("Data not found");

    res.setHeader("Content-Type", "text/plain;charset=utf-8");

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

app.get("/save", (req, res) => {
  const generateRandomString = () => [...Array(8 + Math.floor(Math.random() * 3))].map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
  return res.redirect(`/save/${generateRandomString()}`);
});

app.listen(PORT, () => {
  console.log("Running on Port " + PORT)
})