const commands = {
    help:{
        regex:/^\/help\s*$/,
        msg:"Hello, I am a bot that makes sure the users in a group chat don't use foul language. If someone uses such language, I will notify the admins, and they will be asked to command me to either give the user a warning, ban him, or remove him from the group\n\nCommands:\n/isBadWord:\nExample: '/isBadWord test' tells you if the word test is a bad word or not\nUsed by admins and non-admins\n\n/addBadWords:\nExample:'/addBadWords first,second,third' adds the words first,second, and third to the list of bad words\nUsed by admins only\n\n/removeBadWords:\nExample:'/removeBadWords first,second,third' removes the words first,second,and third from the list of bad words\nUsed by admins only\n\n/clearExtraBadWords: Example:\n'/clearExtraBadWords' clears all the extra bad words added by the admins\n\nNote that the words that are bad by default (curse words) cannot be removed by admins from the list of bad words"
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
    listExtraBadWords:{
        regex:/^\/listExtraBadWords\s*$/,
        msg:null
    }
}

module.exports = commands;