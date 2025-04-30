/**
 * Test script for login API
 * 
 * Run with: node test-login.js
 */
const http = require('http');

// Login credentials
const data = JSON.stringify({
  username: 'admin',
  password: 'admin123'
});

// Request options
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

// Make request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(responseData);
      console.log('Response:');
      console.log(JSON.stringify(parsedData, null, 2));
      
      if (parsedData.token) {
        console.log('\nToken received successfully!');
        console.log('You can use this token for authenticated requests:');
        console.log(`Authorization: Bearer ${parsedData.token}`);
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();

console.log('Login request sent, waiting for response...');