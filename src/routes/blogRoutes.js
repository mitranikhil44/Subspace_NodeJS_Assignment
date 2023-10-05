// Import required dependencies
const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('lodash');

// Define a route to fetch and analyze blog data
router.get('/', async (req, res) => {
  try {
    // Fetch blog data from an external API
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    // Extract blog data from the response
    const blogData = response.data.blogs;

    // Data Analysis using Lodash
    const totalBlogs = blogData.length;

    // Find the blog with the longest title
    const longestTitleBlog = _.maxBy(blogData, (blog) => blog.title.length);

    // Filter blogs that contain the word 'privacy' in their title
    const blogsWithPrivacyKeyword = _.filter(blogData, (blog) => {
      return _.includes(_.toLower(blog.title), 'privacy');
    });

    // Find unique blog titles
    const uniqueBlogTitles = _.uniqBy(blogData, 'title');

    // Create a JSON response with the analysis results
    const analysisResults = {
      totalBlogs,
      longestTitle: longestTitleBlog ? longestTitleBlog.title : 'N/A',
      blogsContainingPrivacyKeyword: blogsWithPrivacyKeyword.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
    };

    // Respond with the analysis results
    res.json(analysisResults);
  } catch (error) {
    console.error('Error fetching and analyzing blog data:', error);
    res.status(500).json({ error: 'Error fetching and analyzing blog data' });
  }
});

module.exports = router;
