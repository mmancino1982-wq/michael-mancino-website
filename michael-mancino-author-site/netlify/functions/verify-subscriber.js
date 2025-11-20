// Netlify Function to verify if email is subscribed to Mailchimp list
// Path: netlify/functions/verify-subscriber.js

const crypto = require('crypto');
const https = require('https');

exports.handler = async (event, context) => {
   const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

    // Handle preflight
if (event.httpMethod === 'OPTIONS') {
  return { statusCode: 200, headers, body: '' };
}
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
         headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Mailchimp credentials
   const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    // Create MD5 hash of lowercase email (Mailchimp requirement)
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    // Check Mailchimp API
    const options = {
      hostname: `${SERVER_PREFIX}.api.mailchimp.com`,
      path: `/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    // Wrap https.request in Promise
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: JSON.parse(data)
            });
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    // Check if subscriber exists and is subscribed
    if (response.statusCode === 200 && response.data.status === 'subscribed') {
      return {
        statusCode: 200,
         headers,
        body: JSON.stringify({ 
          verified: true,
          message: 'Access granted'
        })
      };
    } else {
      return {
        statusCode: 200,
           headers,
        body: JSON.stringify({ 
          verified: false,
          message: 'Email not found in subscriber list'
        })
      };
    }

  } catch (error) {
    console.error('Error verifying subscriber:', error);
    return {
      statusCode: 500,
         headers,
      body: JSON.stringify({ 
        error: 'Server error',
        verified: false
      })
    };
  }
};
