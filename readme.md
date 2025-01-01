# Enhanced Image Proxy

An Express.js-based image proxy server that fetches images from external URLs and serves them to clients. It includes features like rate limiting, URL validation, logging, and error handling.

## Features

- Fetch and serve images from external URLs.
- Protect against abuse with rate limiting.
- Detailed logging with `morgan`.
- URL validation to ensure valid image URLs.
- Customizable headers for debugging and caching.
- Graceful error handling for client and server issues.

## Installation

Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>```
```

Install dependencies:
```bash
npm install
```
Usage
```bash
Start the server:
node image-proxy.js
```

Access the proxy by visiting:
```bash
http://localhost:3000/proxy?url=<image_url>
```
Replace <image_url> with the URL of the image you want to fetch.

Examples
Fetch an image:
```bash
Copy code
http://localhost:3000/proxy?url=https://example.com/image.jpg
```
Invalid or missing URL:

Returns a 400 Bad Request error.
Excessive requests:

Returns a 429 Too Many Requests error if rate limits are exceeded.

### License  
This project is licensed under the MIT License.