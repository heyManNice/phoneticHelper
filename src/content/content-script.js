

class PhoneticHerper {
    constructor() {
        console.log("[phoneticHelper] Script loaded");
        console.time("[phoneticHelper] Initialization time");
        this.updateElements();
        this.addEventListener(this.elements);
        console.timeEnd("[phoneticHelper] Initialization time");
    }

    /**
     * 刷新含有英文的元素
     */
    updateElements(){
        let elements = document.body.querySelectorAll("p,div,a,li,h1,h2,h3");
        elements = Array.from(elements).filter((element)=>{
            return element.children.length === 0 && element.innerText!== ""; 
        })
        elements=elements.filter((element)=>{
            return /[a-zA-Z]/.test(element.innerText);
        })
        this.elements = elements;
    }
    /**
     * 弹窗显示单词信息
     * @param {HTMLElement}单词所在的元素
     */
    popup(element){
        console.log("popup:"+element.innerText);
        let popup = document.querySelector("#phoneticHelper-popup");
        if(!popup){
            popup = document.createElement("div");
            popup.id = "phoneticHelper-popup";
            document.body.appendChild(popup);
        }
        //设置单词
        popup.innerText = element.innerText;
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
     */
    addEventListener(elements){
        const callback = (event)=>{
            const text = event.target.innerText.trim();
            //判断文本是否是单个单词
            //可以直接解析
            if(/^[a-zA-Z]+$/.test(text)){
                this.popup(event.target);
                return;
            }
            //是否有中文
            //不可直接解析，需要拆分单词重新细分
            if(/[\u4e00-\u9fa5]/.test(text)){
                console.log("包含中文");
                const words = text.match(/[a-zA-Z]+/g);
                let str = text;
                for(const word of words){
                    str = str.replace(word,`<span class="ph-span">${word}</span>`);
                }
                event.target.innerHTML = str;
                event.target.removeEventListener("mouseover",callback);
                const spans = event.target.querySelectorAll("span");
                this.addEventListener(spans);
                return;
            }
            //是否没有空格的混合物
            //不可直接解析，需要拆分单词重新细分
            if(!/ /.test(text)){
                const words = text.match(/[a-zA-Z]+/g);
                if(!words){
                    event.target.removeEventListener("mouseover",callback);
                    return;
                }
                let str = text;
                for(const word of words){
                    str = str.replace(word,`<span class="ph-span">${word}</span>`);
                }
                event.target.innerHTML = str;
                event.target.removeEventListener("mouseover",callback);
                const spans = event.target.querySelectorAll("span");
                this.addEventListener(spans);
                return;
            }

            //多单词的句子
            //不可直接解析，需要拆分单词重新细分
            console.log("多单词的句子");
            const words = text.split(" ");
            const html = words.join(`</span> <span class="ph-span">`);
            event.target.innerHTML = `<span class="ph-span">${html}</span>`;
            event.target.removeEventListener("mouseover",callback);
            const spans = event.target.querySelectorAll("span");
            this.addEventListener(spans);
        }
        elements.forEach((element)=>{
            element.addEventListener("mouseover",callback);
            element.addEventListener("mouseout",()=>{
                this.hidePopup();
            })
        }) 
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