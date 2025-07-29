console.log('Running generateToken...');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mysecret123';  // Make sure this matches your backend

const payload = {
  id: 'test-user-id',
  email: 'test@example.com'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

console.log('\n✅ Generated JWT token:\n');
console.log(token);
