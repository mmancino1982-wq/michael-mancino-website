// Netlify Function to verify if email is subscribed to Mailchimp list
// Path: netlify/functions/verify-subscriber.js

const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
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
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Check if subscriber exists and is subscribed
    if (response.ok && data.status === 'subscribed') {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          verified: true,
          message: 'Access granted'
        })
      };
    } else {
      return {
        statusCode: 200,
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
      body: JSON.stringify({ 
        error: 'Server error',
        verified: false
      })
    };
  }
};
