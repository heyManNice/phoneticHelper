import words from "./wordsResource.js";

class PhoneticHelperBackground {
    constructor(options) {
        
    }
    /**
     * 查询单词的音标
     * @param {string} word
     * @returns {null|{us: string, uk: string}} 音标结果
     */
    query(word) {
        return words[word];
    }
}
const phb = new PhoneticHelperBackground();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        // 处理查询请求
        case "query":
            sendResponse(phb.query(request.word));
            break; 
    }
});