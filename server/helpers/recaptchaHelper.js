// helpers/recaptchaHelper.js
import fetch from 'node-fetch';

export async function verifyRecaptcha(captchaValue) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Use the environment variable
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secretKey}&response=${captchaValue}`,
  });
  
  const data = await response.json();
  return data.success;
}
