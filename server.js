const express = require('express');
const crypto = require('crypto');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const ALIAS_REGEX = /^[A-Za-z0-9_-]{3,30}$/;
const RESERVED_ALIASES = ['api', 'admin', 'static', 'public'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Cria um link curto (com alias opcional)
app.post('/api/shorten', (req, res) => {
  const { url, alias } = req.body || {};
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'URL inválida. Use http:// ou https://' });
  }

  // Alias personalizado
  if (alias) {
    if (!ALIAS_REGEX.test(alias)) {
      return res.status(400).json({
        error: 'Alias inválido. Use de 3 a 30 caracteres: letras, números, - ou _',
      });
    }
    if (RESERVED_ALIASES.includes(alias.toLowerCase())) {
      return res.status(400).json({ error: 'Esse alias é reservado. Escolha outro.' });
    }
    if (db.findByCode(alias)) {
      return res.status(409).json({ error: 'Esse alias já está em uso. Escolha outro.' });
    }
    try {
      db.create(alias, url);
      return res.status(201).json({ code: alias, shortUrl: `${BASE_URL}/${alias}` });
    } catch (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'Esse alias já está em uso. Escolha outro.' });
      }
      throw err;
    }
  }

  // Sem alias: reaproveita link existente ou gera código aleatório
  const existing = db.findByUrl(url);
  if (existing) {
    return res.json({ code: existing.code, shortUrl: `${BASE_URL}/${existing.code}` });
  }

  for (let i = 0; i < 5; i++) {
    const code = generateCode();
    try {
      db.create(code, url);
      return res.status(201).json({ code, shortUrl: `${BASE_URL}/${code}` });
    } catch (err) {
      if (!String(err.message).includes('UNIQUE')) throw err;
    }
  }
  res.status(500).json({ error: 'Não foi possível gerar um código único.' });
});

// Lista os links e cliques
app.get('/api/links', (req, res) => {
  const links = db.list().map((l) => ({ ...l, shortUrl: `${BASE_URL}/${l.code}` }));
  res.json(links);
});

// Estatísticas de um link
app.get('/api/links/:code', (req, res) => {
  const link = db.findByCode(req.params.code);
  if (!link) return res.status(404).json({ error: 'Link não encontrado' });
  res.json(link);
});

// Redireciona e conta o clique
app.get('/:code', (req, res, next) => {
  if (!ALIAS_REGEX.test(req.params.code)) return next();
  const link = db.findByCode(req.params.code);
  if (!link) return res.status(404).send('Link não encontrado');
  db.addClick(link.code);
  res.redirect(302, link.original_url);
});

app.listen(PORT, () => console.log(`Servidor rodando em ${BASE_URL}`));
