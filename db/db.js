//connect to postgres
const Pool = require("pg").Pool;

<<<<<<< HEAD
const pool = new Pool({
  host: "ec2-54-157-78-113.compute-1.amazonaws.com",
  user: "hjxurrvtkidtez",
  database: "ddka4gdca2tlbm",
  password: "9ca927314ab660622d9389731e08b994eb893428ff547d08d2b90deb90b70416",
  port: 5432,
  ssl: true
});
=======
const pool = new Pool({  
        host: 'ec2-54-157-78-113.compute-1.amazonaws.com',  
        user: 'hjxurrvtkidtez',  
        database: 'ddka4gdca2tlbm',  
        password: '9ca927314ab660622d9389731e08b994eb893428ff547d08d2b90deb90b70416',
        port: 5432,
        ssl: true
});  
>>>>>>> db8194fe7e5414a811486a2678c44fcf1801fbeb

module.exports = pool;
