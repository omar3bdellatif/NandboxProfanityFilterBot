checkBadWords = (words,filter,mode='filterOut') => {
    let filtered = []

    if(mode === 'filterOut')
    {
        for( i = 0; i < words.length; i++){ 

            if (filter.isProfane(words[i])) { 
                filtered.push(words[i])
                words.splice(i, 1); 
                i--
            }
        
        }
    }
    else if(mode === 'filterIn')
    {
        for( i = 0; i < words.length; i++){ 

            if (!filter.isProfane(words[i])) { 
                filtered.push(words[i])
                words.splice(i, 1); 
                i--
            }
        
        }
    }
    
    console.log(filtered)
    console.log(words)
    return [filtered,words]
}

exports.getBadWords = (commandString,filterA,filterB) => {
    commandString = commandString.replace(/\s+/g," ");
    let words = commandString.split(",")
    console.log(words[0])
    words[0] = words[0].split(/\s(.*)/,2)[1]
    for (word in words)
    {
        //words[word] = words[word].replace(/\s+/,"")
        words[word] = words[word].replace(/^\s+/,"")
        words[word] = words[word].replace(/\s+$/,"")
    }
    let filteredWords_words = [[],words]
    if(filterA != null)
    {
        filteredWords_words = checkBadWords(words,filterA)
    }
    if(filterB != null)
    {
        filteredWords_words = checkBadWords(filteredWords_words[1],filterB,'filterIn')
    }
    return filteredWords_words
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
