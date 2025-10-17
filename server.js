const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cyberpolis API is running' });
});

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, r.name as role_name, r.description as role_description
      FROM players p
      LEFT JOIN roles r ON p.role_id = r.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new player
app.post('/api/players', async (req, res) => {
  const { name, role_id, color = '#00f0ff' } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO players (name, role_id, color) VALUES ($1, $2, $3) RETURNING *',
      [name, role_id, color]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get player by ID
app.get('/api/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, r.name as role_name, r.description as role_description
      FROM players p
      LEFT JOIN roles r ON p.role_id = r.id
      WHERE p.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all roles
app.get('/api/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all districts
app.get('/api/districts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM districts ORDER BY position');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new game
app.post('/api/games', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO games DEFAULT VALUES RETURNING *'
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get game by ID with players
app.get('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const playersResult = await pool.query(`
      SELECT gp.*, p.name, p.color, r.name as role_name
      FROM game_players gp
      JOIN players p ON gp.player_id = p.id
      LEFT JOIN roles r ON p.role_id = r.id
      WHERE gp.game_id = $1
      ORDER BY gp.joined_at
    `, [id]);

    const districtsResult = await pool.query(`
      SELECT od.*, d.name, d.type, d.cost, d.rent_base
      FROM owned_districts od
      JOIN districts d ON od.district_id = d.id
      WHERE od.game_id = $1
    `, [id]);

    res.json({
      ...gameResult.rows[0],
      players: playersResult.rows,
      owned_districts: districtsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add player to game
app.post('/api/games/:id/players', async (req, res) => {
  const { id } = req.params;
  const { player_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO game_players (game_id, player_id) VALUES ($1, $2) RETURNING *',
      [id, player_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // unique violation
      res.status(400).json({ error: 'Player already in game' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// Update player in game
app.put('/api/games/:gameId/players/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params;
  const { position, credits, influence } = req.body;
  try {
    const result = await pool.query(
      `UPDATE game_players
       SET position = COALESCE($1, position),
           credits = COALESCE($2, credits),
           influence = COALESCE($3, influence)
       WHERE game_id = $4 AND player_id = $5
       RETURNING *`,
      [position, credits, influence, gameId, playerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found in game' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Buy district
app.post('/api/games/:gameId/districts/:districtId/buy', async (req, res) => {
  const { gameId, districtId } = req.params;
  const { player_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO owned_districts (game_id, player_id, district_id) VALUES ($1, $2, $3) RETURNING *',
      [gameId, player_id, districtId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // unique violation
      res.status(400).json({ error: 'District already owned' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Cyberpolis server running on port ${port}`);
});

module.exports = app;