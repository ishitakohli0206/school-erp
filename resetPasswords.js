require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./models');

(async ()=>{
  try {
    const usersToReset = [
      { email: 'admin@test.com', pass: 'password123' },
      { email: 'student@test.com', pass: 'password123' }
    ];

    for (const u of usersToReset) {
      const user = await db.User.findOne({ where: { email: u.email } });
      if (!user) {
        console.log('User not found:', u.email);
        continue;
      }
      const hashed = await bcrypt.hash(u.pass, 10);
      user.password = hashed;
      await user.save();
      console.log('Password reset for', u.email);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error resetting passwords', err);
    process.exit(1);
  }
})();
