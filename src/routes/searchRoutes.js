// Import required dependencies
const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('lodash');

// Define a cache object to store search results
const cache = {};
const cacheDuration = 600000; // Cache duration in milliseconds (e.g., 10 minutes)

// Define a route to perform a search on blog data
router.get('/', async (req, res) => {
  try {
    // Get the search query from the request parameters
    const searchQuery = req.query.query;
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is missing' });
    }

    // Check if the search query result is cached and still valid
    const cachedResult = cache[searchQuery];
    if (cachedResult && Date.now() - cachedResult.timestamp <= cacheDuration) {
      console.log('Cache hit for', searchQuery);
      return res.json(cachedResult.data);
    }

    // Fetch blog data from an external API
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    // Extract blog data from the response
    const blogData = response.data.blogs;

    // Filter blogs that contain the search query in their title or content
    const searchResults = _.filter(blogData, (blog) => {
      const lowerCaseTitle = _.toLower(blog.title);
      const lowerCaseContent = _.toLower(blog.content);
      return _.includes(lowerCaseTitle, searchQuery) || _.includes(lowerCaseContent, searchQuery);
    });

    // Cache the search results for future requests with the same query
    cache[searchQuery] = {
      data: searchResults,
      timestamp: Date.now(),
    };

    // Respond with the search results
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ error: 'Error searching blogs' });
  }
});

module.exports = router;
