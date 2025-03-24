

class PhoneticHerper {
    constructor() {
        console.log("[phoneticHelper] Script loaded");
        console.time("[phoneticHelper] Initialization time");
        const textNodes = this.getAllTextNodes(document.body);
        this.wrapWords(textNodes);
        const spanList = document.querySelectorAll(".ph-span");
        this.bindEvents(spanList);
        console.timeEnd("[phoneticHelper] Initialization time");
    }

    /**
     * 获取所有的含有英文的文本节点
     * @param {HTMLElement} root
     */
    getAllTextNodes(element) {
        const textNodes = [];
        const walk = document.createTreeWalker(
            element, 
            NodeFilter.SHOW_TEXT, // 只遍历文本节点
            {
                acceptNode: (node) => {
                    // 过滤掉空文本节点
                    if (node.nodeValue.trim() === '') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 去除父元素为 <script> 或 <style> 的文本节点
                    if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 去除已经处理过的元素，也就是有父元素有.ph-span 类的元素
                    if (node.parentElement.classList.contains('ph-span')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 只留下英文文本节点
                    if (!/[a-zA-Z]/.test(node.nodeValue)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );
    
        let currentNode;
        while (currentNode = walk.nextNode()) {
            textNodes.push(currentNode);
        }
        return textNodes;
    }


    /**
     * 在文本节点中使用span包裹单词
     * @param {TextNode[]} textNodes
     */
    wrapWords(textNodes) {
        for(const textNode of textNodes){
            //将节点用span包裹
            const span = document.createElement("span");
            const str = textNode.nodeValue.trim();
            //将文本中的单词用span包裹，单词不包含前后的空格，其他文字保持在原位
            let html = str.replace(/[a-zA-Z]+/g,`<span class="ph-span">$&</span>`);
            //如果文本末尾是处理的最后一个单词，则要在末尾添加一个空格
            if(html.endsWith("</span>")){
                html += "&nbsp;"; 
            }
            span.innerHTML = html;
            //将span插入到文本节点的位置
            textNode.parentNode.replaceChild(span,textNode);
        } 
    }

    /**
     * 弹窗显示单词信息
     * @param {HTMLElement}单词所在的元素
     */
    async popup(element){
        console.log("popup:"+element.innerText);
        let popup = document.querySelector("#phoneticHelper-popup");
        if(!popup){
            popup = document.createElement("div");
            popup.id = "phoneticHelper-popup";
            document.body.appendChild(popup);
        }
        //设置单词
        const res = await this.query(element.innerText.toLowerCase());
        const us = res?res.us:"not found";
        popup.innerText = `/${us}/`
        popup.style.display = "block";//先显示才获取大小信息

        //单词与弹窗间隔
        const space = 10;

        //获取位置信息
        const rect = element.getBoundingClientRect();
        const wordTop = rect.top;
        const wordLeft = rect.left;
        const wordWidth = rect.width;
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        //设置位置
        let popupLeft = wordLeft + wordWidth / 2 - popupWidth / 2;//左右居中
        let popupTop = wordTop - popup.offsetHeight - space;//在单词上方

        //生效
        popup.style.left = popupLeft + "px";
        popup.style.top = popupTop + "px";
    }
    /**
     * 隐藏弹窗
     */
    hidePopup(){
        const popup = document.querySelector("#phoneticHelper-popup");
        if(popup){
            popup.style.display = "none";
        }
    }
    /**
     * 向目标元素添加监听事件
     * @param {HTMLElement[]} elements 目标元素列表
     */
    bindEvents(elements){
        for(const element of elements){
            element.addEventListener("mouseenter",()=>{
                this.popup(element);
            });
            element.addEventListener("mouseleave",()=>{
                this.hidePopup();
            });
        }
    }
    /**
     * 向后台脚本发生单词查询信息
     * @param {String} word 单词
     * @returns {Promise} 单词音标信息
     */
    query(word){
        return new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage({type:"query",word:word},(response)=>{
                resolve(response);
            })
        })
    }
}

const phoneticHelper = new PhoneticHerper();
