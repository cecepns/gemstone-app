const bcrypt = require('bcryptjs');

bcrypt.hash('admin123', 10, (err, hash) => {
    console.log('New correct hash for admin123:');
    console.log(hash);
});