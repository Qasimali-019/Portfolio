import bcrypt from 'bcrypt';
const password = 'Q@sim1234'; // <-- change this!
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});