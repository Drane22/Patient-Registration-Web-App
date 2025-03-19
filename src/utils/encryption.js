const crypto = require('crypto');

// Encryption configuration
// Ensure encryption key is exactly 32 bytes
const rawKey = process.env.ENCRYPTION_KEY || 'patient-data-encryption-key-32bytes';
const ENCRYPTION_KEY = Buffer.from(rawKey).slice(0, 32).toString('utf8').padEnd(32, '!'); // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypts text using AES-256-CBC algorithm
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text as a hex string with IV prepended
 */
const encrypt = (text) => {
  if (!text) return text;
  
  try {
    // Create an initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend IV to encrypted data for use in decryption
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text on error to prevent data loss
  }
};

/**
 * Decrypts text using AES-256-CBC algorithm
 * @param {string} encryptedText - The encrypted text with IV prepended
 * @returns {string} - The decrypted text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  
  try {
    // Extract IV and encrypted text
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedData = textParts[1];
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return original text on error to prevent data loss
  }
};

module.exports = {
  encrypt,
  decrypt
};