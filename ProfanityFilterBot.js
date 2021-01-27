const { createRequire } = require("module");
const NandBox = require("nandbox-bot-api/src/NandBox");
const Nand = require("nandbox-bot-api/src/NandBoxClient");
const NandBoxClient = Nand.NandBoxClient;

const TextOutMessage = require("nandbox-bot-api/src/outmessages/TextOutMessage");
const Utils = require("nandbox-bot-api/src/util/Utility");
const Id = Utils.Id;

const Filter = require("bad-words");

const commands = require("./commands")
const funcs = require("./funcs")
const db = require("./db.js")

//ChatId:{{badUserID,badUserName},{},{}}
let badUsers = {};
let chatsToFilters = {}
let defaultFilter = new Filter()


//add to a JSON file and read the data from there
const TOKEN = "90091850437700960:0:Y2kMqpPXKYYqAveAJ1jKYQAc0sscTM"
const TOKENB = "90091784170452409:0:szMrvEDDq0JCKdZ4rpKeqePuQ4Ayco"; // replace it with your token
const config = {
    URI: "wss://w1.nandbox.net:5020/nandbox/api/",
    DownloadServer: "https://w1.nandbox.net:5020/nandbox/download/",
    UploadServer: "https://w1.nandbox.net:5020/nandbox/upload/"
}
const botId = TOKEN.substring(0,TOKEN.indexOf(':'))
const dbPath = "../../db/bad_words.db"
const database = new db(dbPath)

var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;

async function myasync(promise)
{
    const x = await promise
    return x
}

nCallBack.onConnect = (_api) => {
    // it will go here if the bot connected to the server successfuly 

    api = _api;
    console.log("Authenticated");

    //get table names
    database.getTableNames().then((res)=>{
        let tableNames = res
        console.log(tableNames)
        let chatIds = funcs.getChatIdsFromTableNames(tableNames)
        console.log(chatIds)

        for(i in chatIds)
        {
            let chatId = chatIds[i]
            let filter = new Filter()
            //access the db to find bad words associated with this chatId
            database.getAllBadWords(chatId).then((resIn)=>{
                let badWordsArr = resIn
                filter.addWords(...badWordsArr)
                chatsToFilters[chatId] = filter
            })
            
        }
    })
    


}



nCallBack.onReceive = incomingMsg => {
    let chatId = incomingMsg.chat.id; // get your chat Id
    let filter = chatsToFilters[chatId]
    if(filter === undefined)
    {
        filter = new Filter()
        chatsToFilters[chatId] = filter
        database.createTable(chatId)
    }
    
    if (incomingMsg.isTextMsg() && filter.isProfane(incomingMsg.text) && incomingMsg.from_admin !== 1 && incomingMsg.chat_settings !== 1 && incomingMsg.chat.type=="Group") {

            let userId = incomingMsg.from.id;
            let userName = incomingMsg.from.name;
            if(chatId in badUsers)
            {
                if(!(userId in badUsers[chatId]))
                {
                    badUsers[chatId][userId] = userName
                }
                    
            }
            else
            {
                //initialize the chat object by an external function
                badUsers[chatId] = {};
                badUsers[chatId][userId] = userName
                console.log(badUsers)
                api.getChatAdministrators(chatId);
            }
            
 
        

    }
    else if(incomingMsg.isTextMsg() && incomingMsg.chat_settings === 1){

        let chatId = incomingMsg.chat.id;

        //check if it matches a command
        let isCommand = false
        let commandKey = ""

        for (commandKey in commands){
            let regex = commands[commandKey].regex
            if(regex.test(incomingMsg.text)){
                isCommand = true
                break
            }
        }

        if(isCommand){

            let outmsg = new TextOutMessage()
                outmsg.chat_settings = 1
                outmsg.chat_id = chatId;
                reference = Id()
                outmsg.reference = reference;
                outmsg.to_user_id = incomingMsg.from.id;
            
           

            switch (commandKey)
            {
                case "help":
                    outmsg.text = commands[commandKey].msg
                    break
                
                case "isBadWord":
                    let candidateBadWord = funcs.getBadWords(incomingMsg.text,null)[0]
                    if(filter.isProfane(candidateBadWord))
                    {
                        outmsg.text= `Word ${candidateBadWord} is a bad word`
                    }
                    else
                    {
                        outmsg.text= `Word ${candidateBadWord} is not a bad word`
                    }
                    break
                    
                case "addBadWords":
                    if(incomingMsg.from_admin === 1)
                    {
                        let addedBadWords = funcs.getBadWords(incomingMsg.text,filter)
                        database.addWords(chatId,addedBadWords)
                        filter.addWords(...addedBadWords)
                        chatsToFilters[chatId] = filter
                        outmsg.text=`Words have been added to the list of bad words, you will be notified if anyone uses them`
                    }
                    break

                case "removeBadWords":
                    if(incomingMsg.from_admin === 1)
                    {
                        let removedBadWords = funcs.getBadWords(incomingMsg.text,defaultFilter)
                        //removedBadWords = funcs.filterArr(removedBadWords,resIn)
                        database.removeWords(chatId,removedBadWords)
                        filter.removeWords(...removedBadWords)
                        chatsToFilters[chatId] = filter

                        outmsg.text=`Words have been removed from the list of bad words, you will no longer be notified if anyone uses them`
                    }
                    break
                

                case "clearExtraBadWords":
                    if(incomingMsg.from_admin === 1)
                    {
                        database.getAllBadWords(chatId).then((resIn)=>{
                            let removedBadWords = resIn
                            filter.removeWords(...removedBadWords)
                            database.removeWords(chatId,removedBadWords)
                            chatsToFilters[chatId] = filter
                        })
                        outmsg.text = commands[commandKey].msg
                    }
                    break
                
                /*case "clearAllBadWords":
                    if(incomingMsg.from_admin === 1)
                    {
                        filter = new Filter({ emptyList: true });
                        chatsToFilters[chatId] = filter
                        outmsg.text = commands[commandKey].msg
                    }
                    break*/
                
                /*case "addDefaultBadWords":
                    if(incomingMsg.from_admin === 1)
                    {
                        filter = new Filter();
                        chatsToFilters[chatId] = filter
                        outmsg.text = commands[commandKey].msg
                    }
                    break*/

                default:
                    break
            }
            api.send(JSON.stringify(outmsg));
        }

        

        else if(chatId in badUsers && incomingMsg.from_admin === 1 && incomingMsg.chat.type=="Group"){
            let pattern = /[1-3]\s*/
            let msgText = incomingMsg.text;

            if(pattern.test(msgText))
            {
                let badUserId = Object.keys(badUsers[chatId])[0];
                let badUserName = badUsers[chatId][badUserId];
                console.log(badUserId)
                console.log(badUserName)

                if(/1\s*/.test(msgText))
                {
                    //Warn
                    console.log("Warn");
                    let outmsg = new TextOutMessage();
                    outmsg.chat_settings = 1;
                    outmsg.chat_id = chatId;
                    outmsg.text = `Hello ${badUserName}, Please don't use foul language in this channel again, as this is against our rules. Further usage of such language might result in you getting removed or banned from the channel`;
                    reference = Id();
                    outmsg.reference = reference;
                    outmsg.to_user_id = badUserId;
                    api.send(JSON.stringify(outmsg));

                }
                else if(/2\s*/.test(msgText))
                {
                    //Remove
                    console.log("Remove");
                    let outmsg = new TextOutMessage()
                    outmsg.chat_settings = 1
                    outmsg.chat_id = chatId;
                    outmsg.text = `Hello ${badUserName}, we regret to inform you that you have been removed from this channel due to using foul language`;
                    reference = Id()
                    outmsg.reference = reference;
                    outmsg.to_user_id = badUserId;
                    api.send(JSON.stringify(outmsg));
                    api.removeChatMember(chatId,badUserId);

                }
                else if(/3\s*/.test(msgText))
                {
                    //Ban
                    console.log("Ban");
                    let outmsg = new TextOutMessage()
                    outmsg.chat_settings = 1
                    outmsg.chat_id = chatId;
                    outmsg.text = `Hello ${badUserName}, we regret to inform you that you have been banned from this channel due to using foul language`;
                    reference = Id()
                    outmsg.reference = reference;
                    outmsg.to_user_id = badUserId;
                    api.send(JSON.stringify(outmsg));
                    api.banChatMember(chatId,badUserId);
                }

                delete badUsers[chatId][badUserId]
                if(Object.keys(badUsers[chatId]).length === 0){
                    delete badUsers[chatId]
                }
                else{
                    api.getChatAdministrators(chatId);
                }

            }

            else
            {
                let outmsg = new TextOutMessage()
                outmsg.chat_settings = 1
                outmsg.chat_id = chatId;
                outmsg.text = "Please choose 1,2, or 3 only, or type '/help' to see the commands"
                reference = Id()
                outmsg.reference = reference;
                outmsg.to_user_id = incomingMsg.from.id;
                api.send(JSON.stringify(outmsg));
            }
        }
        
    }

}

// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => {
    console.log("received object: ", obj);
}

nCallBack.onClose = () => { }
nCallBack.onError = () => { }
nCallBack.onChatMenuCallBack = chatMenuCallback => {}
nCallBack.onInlineMessageCallback = inlineMsgCallback => {}
nCallBack.onMessagAckCallback = msgAck => {}
nCallBack.onUserJoinedBot = user => {}

nCallBack.onChatMember = chatMember => {
    let chatId = chatMember.chat.id

    if(chatMember.user.id == botId)
    {
        if(chatMember.chat.type === 'Group' && chatMember.type === 'Admin')
        {
            
            database.createTable(chatId)
            //create a new filter
            let filter = new Filter()
            chatsToFilters[chatId] = filter

        }
        else
        {
            database.dropTable(chatId)
            delete chatsToFilters[chatId]
        }
        
    }
}


nCallBack.onChatAdministrators = chatAdministrators => {
    let admins = chatAdministrators.administrators

    let chatId = chatAdministrators.chat.id;
    let badUserId = Object.keys(badUsers[chatId])[0];
    let badUserName = badUsers[chatId][badUserId]


    let outmsg = new TextOutMessage()
    outmsg.chat_settings = 1
    outmsg.chat_id = chatAdministrators.chat.id;
    outmsg.text = `User ${badUserName} has said a bad word\nWhat would you like to do?\n1-Warn\n2-Remove\n3-Ban`;
    for (admin in admins){
        reference = Id()
        outmsg.reference = reference;
        outmsg.to_user_id = admins[admin].id
        api.send(JSON.stringify(outmsg));
    }
    
 }


nCallBack.userStartedBot = user => { }
nCallBack.onMyProfile = user => { }
nCallBack.onUserDetails = user => { }
nCallBack.userStoppedBot = user => { }
nCallBack.userLeftBot = user => { }
nCallBack.permanentUrl = permenantUrl => { }
nCallBack.onChatDetails = chat => { }
nCallBack.onInlineSearh = inlineSearch => { }
nCallBack.onBlackList = blackList => { }
nCallBack.onWhiteList = whiteList => { }

client.connect(TOKEN, nCallBack);