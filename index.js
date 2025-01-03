const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { URL } = require('url');

const app = express();
const PORT = 80;

// Rate limiter to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Request logger
app.use(morgan('combined'));

// Utility: Validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Image proxy endpoint
app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        // Fetch the image
        const response = await axios.get(url, {
            responseType: 'arraybuffer', // Required to handle binary data
            headers: {
                // Optional: Add custom headers if needed
                'User-Agent': 'ImageProxy/1.0',
            },
        });

        // Set appropriate headers
        res.set({
            'Content-Type': response.headers['content-type'],
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            'X-Proxy-Source': url, // Custom header for debugging
        });

        // Send the image data
        res.send(response.data);
    } catch (error) {
        // Enhanced error handling
        if (error.response) {
            console.error(
                `Failed to fetch image. HTTP ${error.response.status}: ${error.response.statusText}`
            );
            res.status(error.response.status).json({
                error: `Failed to fetch image. ${error.response.statusText}`,
            });
        } else {
            console.error('Error fetching the image:', error.message);
            res.status(500).json({ error: 'Unable to fetch the image' });
        }
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Enhanced Image Proxy running on http://localhost:${PORT}`);
});
