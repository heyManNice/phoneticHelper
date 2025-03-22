import words from "./wordsResource.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        // 处理查询请求
        case "query":
            sendResponse(words[request.word]);
            break; 
    }
});