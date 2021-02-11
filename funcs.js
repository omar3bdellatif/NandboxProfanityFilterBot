const Button = require("nandbox-bot-api/src/data/Button");
const Row = require("nandbox-bot-api/src/data/Row");
const Menu = require("nandbox-bot-api/src/data/Menu");
const SetNavigationButtonOutMessage = require("nandbox-bot-api/src/outmessages/SetNavigationButtonOutMessage");

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

exports.createButton = (
    label,
    callback,
    order,
    bgColor,
    txtColor,
    buttonURL,
    buttonQuery,
    nextMenuRef,
    span
  ) => {
    let btn = new Button();
  
    btn.button_label = label;
    btn.button_order = order;
    btn.button_callback = callback;
    btn.button_bgcolor = bgColor;
    btn.button_textcolor = txtColor;
    btn.button_query = buttonQuery;
    btn.next_menu = nextMenuRef;
    btn.button_url = buttonURL;
    btn.button_span = span | 1;
  
    return btn;
  }


exports.createRow = (buttons,order) =>{
    return new Row(buttons,order);
}

exports.createStartMenu = (rows,menuRef) =>{
    return new Menu(rows,menuRef);
}
