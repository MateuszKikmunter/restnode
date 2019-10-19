const sqlite = require("sqlite3").verbose();;
const md5 = require("md5");

const dbSource = "db.sqlite";

const db = new sqlite.Database(dbSource, (err) => {
    //db cannot be initialized
    if (err) {
        console.log(err);
        throw err;
    } else {
        db.run(`CREATE TABLE User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
        )`, (err) => {
            if (err) {
                //table already created
            }
            else {
                //table created, populate with some rows
                const insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
                db.run(insert, ["admin", "admin@example.com", md5("admin1")]);
                db.run(insert, ["user", "user@example.com", md5("user1")]);
            }
        })
    }
});

modeule.exports = db;