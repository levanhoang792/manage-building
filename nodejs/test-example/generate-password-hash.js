/**
 * Script to generate a bcrypt hash for a password
 * 
 * Run with: node generate-password-hash.js
 */
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash password with salt
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Password:', password);
    console.log('Salt rounds:', saltRounds);
    console.log('Bcrypt hash:', hash);
    
    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification:', isValid ? 'Success' : 'Failed');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();