const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Home route with filtering options
router.get('/home', async (req, res) => {
  const { language, sortBy, genre, location } = req.query;
  let filter = {};

  // Check if language, genre, and location are arrays (multiple selections)
  if (language) filter.language = Array.isArray(language) ? { $in: language } : language;
  if (genre) filter.genre = Array.isArray(genre) ? { $in: genre } : genre;
  if (location) filter.location = Array.isArray(location) ? { $in: location } : location;

  let sortOption = {};
  if (sortBy === 'newToOld') sortOption.releaseDate = -1;
  if (sortBy === 'oldToNew') sortOption.releaseDate = 1;

  try {
    const movies = await Movie.find(filter).sort(sortOption);
    res.render('home', { movies });
  } catch (error) {
    res.status(500).send("Error loading movies.");
  }
});

module.exports = router;
