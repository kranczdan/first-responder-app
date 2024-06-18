const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const kafka = require('kafka-node');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware für das Parsen von JSON
app.use(express.json());
app.use(cors());

// Kafka Consumer Setup
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'http://localhost:29092' });
const producer = new kafka.Producer(client);

producer.on('ready', function () {
  console.log('Kafka Producer is ready');
});

producer.on('error', function (err) {
  console.error('Kafka Producer error:', err);
});

// Consumer für das Topic 'emergency-call'
const emergencyCallConsumer = new Consumer(
  client,
  [{ topic: 'emergency-call', partition: 0 }, { topic: 'emergency-response', partition: 0 }],
  { autoCommit: true }
);

emergencyCallConsumer.on('message', function (message) {
  // An alle verbundenen Clients senden
  if(message.topic === "emergency-call"){
    console.log('Received message from emergency-call:', message);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }else if(message.topic === "emergency-response"){
    console.log('Received message from emergency-response:', message);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
    //@TODO was auch immer hier geschehen muss
  }
});

emergencyCallConsumer.on('error', function (err) {
  console.error('Kafka emergency-call Consumer error:', err);
});

/*
// Consumer für das Topic 'emergency-response'
const emergencyResponseConsumer = new Consumer(
    client,
    [{ topic: 'emergency-response', partition: 0 }],
    { autoCommit: true }
);

emergencyResponseConsumer.on('message', function (message) {
  console.log('Received message from emergency-response:', message);
  // An alle verbundenen Clients senden
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
});

emergencyResponseConsumer.on('error', function (err) {
  console.error('Kafka emergency-response Consumer error:', err);
});
 */

wss.on('connection', function (ws) {
  console.log('Client connected');
  ws.on('close', function () {
    console.log('Client disconnected');
  });
});

// API-Route zum Abrufen der Benutzer
app.get('/api/user', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8090/user');
    res.json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
  }
});

// API-Route zum Abrufen der Ereignisse
app.get('/api/event', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8090/event');
    res.json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Ereignisse:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Ereignisse' });
  }
});

// API-Route zum Erstellen eines neuen Ereignisses
app.post('/api/event', async (req, res) => {
  const { eventLong, eventLat, title, description, victimName } = req.body;
  try {
    const response = await axios.post('http://localhost:8090/event', {
      eventLong,
      eventLat,
      title,
      description,
      victimName
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fehler beim Erstellen des Ereignisses:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Ereignisses' });
  }
});

// API-Route zur Registrierung als Ersthelfer
app.post('/api/event/register', async (req, res) => {
  const { userLong, userLat, eventId, userId } = req.body;
  try {
    const response = await axios.post('http://localhost:8090/event/register', {
      userLong,
      userLat,
      eventId,
      userId
    });

    // Wenn die Registrierung erfolgreich ist, Nachricht an emergency-response senden
    if (response.status === 201) {
      res.status(200).json(response.data);
      /*
      const payload = [
        {
          topic: 'emergency-response',
          messages: JSON.stringify({ id: eventId, type: 'help-response' })
        }
      ];

      producer.send(payload, function (err, data) {
        if (err) {
          console.error('Failed to send message to Kafka:', err);
          res.status(500).json({ error: 'Fehler beim Senden der Nachricht an Kafka' });
        } else {
          console.log('Message sent to emergency-response topic:', data);
          res.status(200).json(response.data);
        }
      });
      */
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error('Fehler bei der Registrierung als Ersthelfer:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung als Ersthelfer' });
  }
});

/* DAS IST DER CODE DER AUF ALLE FÄLLE FUNKTIONIERT!!
// API-Route zur Registrierung als Ersthelfer
app.post('/api/event/register', async (req, res) => {
  const { userLong, userLat, eventId, userId } = req.body;
  try {
    const response = await axios.post('http://localhost:8090/event/register', {
      userLong,
      userLat,
      eventId,
      userId
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fehler bei der Registrierung als Ersthelfer:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung als Ersthelfer' });
  }
});
*/

// API-Route zum Anlegen eines Ersthelfer
app.post('/api/user', async (req, res) => {
  const { firstname, lastname } = req.body;
  try {
    const response = await axios.post('http://localhost:8090/user', {
      firstname,
      lastname,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fehler beim Anlegen eines Ersthelfer:', error);
    res.status(500).json({ error: 'Fehler beim Anlegen eines Ersthelfer' });
  }
});

// API-Route zum Abrufen der Event-Details
app.get('/api/event/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const response = await axios.get(`http://localhost:8090/event/${eventId}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Fehler beim Abrufen der Event-Details für Event ${eventId}:`, error);
    res.status(500).json({ error: `Fehler beim Abrufen der Event-Details für Event ${eventId}` });
  }
});

// Proxy-Konfiguration für '/api'
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8090',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Entfernt '/api' aus dem Anfragepfad
  },
}));

// Statische Dateien bereitstellen (wenn React von diesem Server aus bereitgestellt wird)
app.use(express.static(path.join(__dirname, 'build')));

// Alle anderen Anfragen auf die React-App weiterleiten
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server lauscht auf Port ${PORT}`);
});