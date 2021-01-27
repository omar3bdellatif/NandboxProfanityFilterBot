checkBadWords = (words,filter) => {
    for( i = 0; i < words.length; i++){ 

        if (filter.isProfane(words[i])) { 
            words.splice(i, 1); 
            i--
        }
    
    }
    return words
}

exports.getBadWords = (commandString,filter) => {
    commandString = commandString.replace(/\s+/g," ");
    let words = commandString.split(",")
    console.log(words[0])
    words[0] = words[0].split(/\s(.*)/,2)[1]
    for (word in words)
    {
        words[word] = words[word].replace(/\s+/,"")
    }
    if(filter != null)
    {
        words = checkBadWords(words,filter)
    }
    return words
}

exports.getChatIdsFromTableNames = tableNames => {
    let chatIds = tableNames.map((name) => name.substring(5))
    return chatIds
}

exports.filterArr = (src,filterArr) =>{
    result = []
    for(i=0;i<src.length;i++)
    {
        if(filterArr.indexOf(src[i]) >=0)
        {
            results.push(src[i])
        }
    }
    return results
}
