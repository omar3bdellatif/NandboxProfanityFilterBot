const Promise = require("bluebird")
const { removeBadWords } = require('./commands');

const sqlite3 = require('sqlite3').verbose();

class dataBase {
    constructor(dbPath){
        this.db = new sqlite3.Database(dbPath,(err) => {
            if(err)
            {
                return console.error(err.message)
            }
            console.log("connected to the database successfully")
        })
    }

    all(sql)
    {
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                let result = new Array()
                rows.forEach((row) =>{
                    result.push(row.word)
                })
                resolve(result)
            })
        })
    }

    run(sql,msg)
    {   
        return new Promise((resolve,reject) => {
            this.db.run(sql,(err) =>{
                if(err)
                {
                    reject(err.message)
                }
                resolve(msg)
            })
        })
    }

    createTable(chatId)
    {
        let sql = `CREATE TABLE IF NOT EXISTS Table${chatId} (
                    words varchar(255) NOT NULL,
                    PRIMARY KEY (words)
                    );`
        this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Table Table${chatId} has been created successfully`)
        })
    }

    addWord(chatId,word)
    {
        let sql = `INSERT INTO Table${chatId}(words) VALUES("${word}")`
        this.db.run(sql,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Word ${word} has been registered as a bad word for chat with ID ${chatId}`)
        })
    }

    addWords(chatId,words)
    {
        let placeholders = words.map((word) => '(?)').join(',');
        let sql = `INSERT INTO Table${chatId}(words) VALUES ${placeholders}`;

        this.db.run(sql,words,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Words ${words} have been registered as bad words for chat with ID ${chatId}`)
        })
    }




    removeWord(chatId,word)
    {
        let sql = `DELETE FROM Table${chatId} where words = "${word}"`
        this.db.run(sql,(err) =>{
            if(err)
            {
               return console.log(err.message)
            }
            console.log(`Word ${word} has been removed from the list of bad words for chat with ID ${chatId}`)
        })
    }

    removeWords(chatId,words)
    {
        let placeholders = words.map((word) => '?').join(',');
        let sql = `DELETE FROM Table${chatId} WHERE words IN (${placeholders})`;

        this.db.run(sql,words,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Words ${words} have been removed from bad words list for chat with ID ${chatId}`)
        })
    }


    getAllBadWords(chatId)
    {
        let sql = `SELECT words word FROM Table${chatId}`

        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                let badWords = new Array()
                rows.forEach((row) =>{
                    badWords.push(row.word)
                })
                resolve(badWords)
            })
        })
    }

    dropTable(chatId)
    {
        let sql = `DROP TABLE Table${chatId}`
        this.db.run(sql,(err) =>{
            if(err)
            {
               return console.log(err.message)
            }
            console.log(`Table Table${chatId} has been dropped successfully`)
        })
    }

    clearBadWords(chatId)
    {
        let sql = `DELETE FROM Table${chatId}`
        this.db.run(sql,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Additional bad words have been cleared for chat with ID ${chatId}`)
        })
    }

    getTableNames(){
        let sql = 'SELECT name FROM sqlite_master WHERE type="table"'
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                let tableNames = new Array()
                rows.forEach((row) =>{
                    tableNames.push(row.name)
                })
                resolve(tableNames)
            })
        })
    }


}


module.exports = dataBase