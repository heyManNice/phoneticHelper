class Settings {
    constructor() {
        this.storager = chrome.storage.local;
        this.messager = {
            on:chrome.runtime.onMessage,
            send:chrome.runtime.sendMessage
        };
        this.TYPE=Object.freeze({
            change:"change"
        });

        /**
         * @type {Map<string, (value: any) => any>}
         */
        this.eventMap=new Map();
        this.init();
    }
    /**
     * 初始化
     */
    init() {
        this.messager.on.addListener((message, sender, sendResponse) => {
            switch (message.type) {
                case this.TYPE.change:
                    if(!message.data){
                        return;
                    }
                    const callback = this.eventMap.get(message.data.key);
                    if (callback) {
                        callback(message.data.value);
                    }
                    break;
            } 
        }) 
    }
    /**
     * 获取设置值
     * @param {String} key 获取键对应的值
     * @param {null|(value:any)=>any} callback 当该键值改变时触发的回调函数
     * @returns {Promise<any>}
     */
    get(key,callback) {
        if (typeof callback === "function") {
            this.eventMap.set(key, callback);
        }
        return new Promise((resolve, reject) => {
            this.storager.get(key, (result) => {
                console.log(result);
                
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                return resolve(result[key]??null);
            });
        })
    }
    /**
     * 设置键值
     * @param {String} key 
     * @param {any} value 
     * @returns {Promise<{key:any}}
     */
    set(key, value) {
        return new Promise((resolve, reject) => {
            this.storager.set({[key]: value}, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError); 
                }
                this.messager.send({
                    type: this.TYPE.change,
                    data: { key, value }
                });
                return resolve({ key: value });
            });
        })
    }
}
