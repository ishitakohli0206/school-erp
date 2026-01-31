require('dotenv').config();
(async ()=>{
  const db = require('./models');
  const users = await db.User.findAll({ attributes: ['id','email','role_id','password'] });
  console.log(users.map(u=>u.get({plain:true})));
  process.exit(0);
})();
