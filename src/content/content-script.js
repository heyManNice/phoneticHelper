

class PhoneticHerper {
    constructor() {
        this.print("Script loaded");
        this.init();
        this.checkNewWords();
    }
    /**
     * 初始化代码
     * 
     */
    init(){
        //添加弹出框元素
        this.popupElement = document.createElement("div");
        this.popupElement.id = "phoneticHelper-popup";
        document.body.appendChild(this.popupElement);

        //防抖的加载新单词
        const debounceCheckNewWords = this.debounce(this.checkNewWords.bind(this), 500);

        //监听body的变化
        const config = { childList: true, subtree: true, attributes: false };
        const observer = new MutationObserver((mutationsList) => {
            if(mutationsList.length < 10){
                return;
            }
            const isPluginRelated = mutationsList.some((mutation) => 
                mutation.target.closest('#phoneticHelper-popup')
            );
            if(isPluginRelated){
                return; 
            }
            debounceCheckNewWords();
        });
        observer.observe(document.body, config);
          
    }
    /**
     * 防抖函数
     * @param {Function} func
     * @param {Number} wait
     * @returns
     */
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        }; 
    }
    /**
     * 检测网页上还没有被处理的单词
     * 为其绑定事件
     */
    checkNewWords(){
        const now = Date.now();
        const textNodes = this.getAllTextNodes(document.body);
        this.wrapWords(textNodes);
        const spanList = document.querySelectorAll(".ph-span:not(.ph-checked):not(#phoneticHelper-popup *)");
        this.bindEvents(spanList);
        this.print(`Found ${spanList.length} new words in ${Date.now() - now}ms`);
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
        //设置单词
        const res = await this.query(element.innerText);
        const us = res?res.us:"not found";
        this.popupElement.innerText = `/${us}/`
        this.popupElement.style.display = "block";//先显示才获取大小信息

        //单词与弹窗间隔
        const space = 10;

        //获取位置信息
        const rect = element.getBoundingClientRect();
        const popupWidth = this.popupElement.offsetWidth;
        const popupHeight = this.popupElement.offsetHeight;

        //设置位置
        const popupLeft = rect.left + (rect.width - popupWidth) / 2;//左右居中
        let popupTop = rect.top - popupHeight - space;//在单词上方

        
        //如果弹窗顶部超出屏幕，则调整位置到下方
        if(popupTop < 0){
            popupTop = rect.bottom + space;
        }

        //位置生效
        this.popupElement.style.left = popupLeft + "px";
        this.popupElement.style.top = popupTop + "px";
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
            element.classList.add("ph-checked");
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
    /**
     * 打印信息
     */
    print(...args){
        console.log("[phoneticHelper]",...args); 
    }
}

const phoneticHelper = new PhoneticHerper();
