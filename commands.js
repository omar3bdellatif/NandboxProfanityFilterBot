const commands = {
    help:{
        regex:/^\/help\s*$/,
        msg:"Hello, I am a bot that makes sure the users in a group chat don't use foul language. If someone uses such language, I will notify the admins, and they will be asked to command me to either give the user a warning, ban him, or remove him from the group"
    }
    ,
    addBadWords:{
        regex:/^\/addBadWords\s+(.+,\s*)*.+$/,
        msg:null
    }
    ,
    removeBadWords:{
        regex:/^\/removeBadWords\s+(.+,\s*)*.+$/,
        msg:null
    }
    ,
    addBadWord:{
        regex:/^\/addBadWord\s+.+$/,
        msg:null
    }
    ,
    removeBadWord:{
        regex:/^\/removeBadWord\s+.+$/,
        msg:null
    }
    ,
    isBadWord:{
        regex:/^\/isBadWord\s+.+$/,
        msg:null
    }
    ,
    clearExtraBadWords:{
        regex:/^\/clearExtraBadWords\s*$/,
        msg:`Removed bad words added by admins from this chat`
    }
    ,
    clearAllBadWords:{
        regex:/^\/clearAllBadWords\s*$/,
        msg:"Removed all bad words from this chat"
    }
    ,
    addDefaultBadWords:{
        regex:/^\/clearAllBadWords\s*$/,
        msg:`Added the default bad words to this chat`
    }
}

module.exports = commands;