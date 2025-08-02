const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const db = new Pool({
  user: 'eurostock_user',
  host: 'dpg-d24hht9r0fns738vqejg-a.frankfurt-postgres.render.com',
  database: 'eurostock_db_3li3',
  password: 'BPNA7hRUPzLYIWHeCgrqoMvaRQfba1Ju',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect(err => {
  if (err) {
    console.error('Помилка підключення до PostgreSQL:', err);
  } else {
    console.log('Підключено до PostgreSQL!');
  }
});

const getItems = (table) => (req, res) => {
  db.query(`SELECT id, name, description, price, image_url, availability FROM ${table}`, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results.rows);
  });
};

const getItemById = (table) => (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM ${table} WHERE id = $1`, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.rows.length === 0) return res.status(404).json({ error: `${table} не знайдено` });
    res.json(results.rows[0]);
  });
};

// Всі твої API endpoints
const categories = [
  'fridges', 'washers', 'dryers', 'freezers', 'ovens', 'hobs',
  'side_by_sides', 'dishwashers', 'microwaves', 'mini_fridges',
  'mini_freezers', 'stoves', 'two_in_one', 'verticals'
];

categories.forEach(cat => {
  app.get(`/api/${cat}`, getItems(cat));
  app.get(`/api/${cat}/:id`, getItemById(cat));
});

app.listen(3001, () => {
  console.log('Сервер працює на порту 3001');
});
