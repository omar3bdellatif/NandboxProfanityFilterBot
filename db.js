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

    createTable()
    {
        let sql = `CREATE TABLE IF NOT EXISTS recordedBadWords (
                    chatId varchar(255) NOT NULL,
                    words varchar(255) NOT NULL,
                    PRIMARY KEY (chatId,words)
                    );`

        return new Promise((resolve,reject) => {
            this.db.run(sql,(err)=>{
                if(err)
                {
                    reject(err.message)
                }
                resolve();
            })
        })
        this.db.run(sql,(err)=>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Table has been created successfully`)
        })
    }


    addWords(chatId,words)
    {
        let sql = `insert into recordedBadWords values `
        for(let i in words)
        {
            sql += `("${chatId}","${words[i]}"),`
        }
        sql = sql.slice(0,sql.length-1)

        this.db.run(sql,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Words ${words} have been registered as bad words for chat with ID ${chatId}`)
        })
    }




    removeWords(chatId,words)
    {
        let placeholders = words.map((word) => '?').join(',');
        let sql = `DELETE FROM recordedBadWords WHERE words IN (${placeholders}) AND chatId = "${chatId}"`;

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
        let sql = `SELECT words word FROM recordedBadWords where chatId = "${chatId}"`

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

    clearBadWords(chatId)
    {
        let sql = `DELETE FROM recordedBadWords where chatId = "${chatId}"`
        this.db.run(sql,(err) =>{
            if(err)
            {
                return console.log(err.message)
            }
            console.log(`Additional bad words have been cleared for chat with ID ${chatId}`)
        })
    }

    getChatIds(){
        let sql = 'select distinct chatId chatid from recordedBadWords'
        return new Promise((resolve,reject) => {
            this.db.all(sql,(err,rows)=>{
                if(err)
                {
                    reject(err.message)
                }
                let chatIds = new Array()
                rows.forEach((row) =>{
                    chatIds.push(row.chatid)
                })
                resolve(chatIds)
            })
        })
    }


}


module.exports = dataBase