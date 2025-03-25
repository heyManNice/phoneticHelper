import words from "./wordsResource.js";

class QueryExecutor {
    constructor(options) {
        
    }
    /**
     * 事件的入口函数
     * @param request 
     * @param sender
     * @returns {string} 音标结果
     */
    onEvent(request, sender) {
        let result = this.query(request.word);
        if (!result) {
            result = this.queryAdvanced(request.word);
        }
        return result;
    }
    /**
     * 查询单词的音标
     * @param {string} word
     * @returns {null|{us: string, uk: string}} 音标结果
     */
    query(word) {
        let result = words[word]??null;

        //尝试全部转换为小写再查询
        if (!result && word !==word.toLowerCase()) {
            result = this.query(word.toLowerCase());
        }
        //尝试去掉末尾的s再查询
        if (!result && word.endsWith("s")) {
            result = this.query(word.slice(0, -1));
        }
        //尝试去掉末尾的ed再查询
        if (!result && word.endsWith("ed")) {
            result = this.query(word.slice(0, -2));
        }
        //尝试去掉末尾的ing再查询
        if (!result && word.endsWith("ing")) {
            result = this.query(word.slice(0, -3));
        }
        
        return result;
    }

    /**
     * 高级查询，查询复杂的情况
     * @param {string} complexWord 复杂的字符串
     * @returns {null|{us: string, uk: string}} 音标结果
     */
    queryAdvanced(complexWord) {
        let result = null;
        const word = complexWord;

        //如果全都是大写，返回每个字母的音标
        if (!result && word === word.toUpperCase()) {
            const words = word.split("");
            result = this.queryMultiple(words);
        }

        //如果是小写大写混合，以驼峰命名法分词查询
        if (!result && word.split(/(?=[A-Z])/).length > 1) {
            const words = word.split(/(?=[A-Z])/);
            result = this.queryMultiple(words);
        }
        return result; 
    }

    /**
     * 查询多个词组合成一个音标
     * @param {string[]} words 单词数组
     * @returns {null|{us: string, uk: string}} 音标结果
     */
    queryMultiple(words) {
        const uss = [];
        const uks = [];
        for (const word of words) {
            const phonetic = this.query(word);
            if (phonetic) {
                uss.push(phonetic.us);
                uks.push(phonetic.uk);
            }else {
                uss.push("??");
                uks.push("??");
            }
        }
        if (uss.length > 0) {
            return {
                us: uss.join(" "),
                uk: uks.join(" ") 
            } 
        }
        return null;
    }

}


const querier = new QueryExecutor();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        // 处理查询请求
        case "query":
            sendResponse(querier.onEvent(request, sender));
            break; 
    }
});