
class PhoneticHelperSettings{
    constructor() {
        window.addEventListener("blur",()=>{
            window.close();
        })
        this.options = this.initOptions();
        this.loadAllSettings(()=>{
            this.render();
        });
        
    }
    /**
     * 储存设置
     * @param {string} key 键
     * @param {any} value 值
     */
     
    save(key,value){
        chrome.storage.local.set({[key]:value},()=>{
            console.log(key,value);
        });
    }
    /**
     * 加载所有设置后执行操作
     * @param {Function} callback 回调函数
     */
    loadAllSettings(callback){
        chrome.storage.local.get(null,(res)=>{
            for(const key in res){
                console.log(key,res[key]);
                const option = this.options.find((option)=>option.id === key);
                if(option){
                    option.value = res[key];
                }
                
            }
            if(callback){
                callback(); 
            }
        });
    }
    /**
     * 初始化选项
     */
    initOptions(){
        return [
            {
                id:"enable",
                name:"启用",
                type:"checkbox",
                value:true,
                description:"启用插件",
                onChange:(value)=>{
                    this.save("enable",value);
                }
            },
            {
                id:"phonetic",
                name:"音标发音",
                type:"select",
                value:"us",
                options:[
                    {
                        name:"美式音标",
                        value:"us"
                    },
                    {
                        name:"英式音标",
                        value:"uk"
                    }
                ],
                description:"选择音标发音",
                onChange:(value)=>{
                    this.save("phonetic",value);
                } 
            },
            {
                id:"popupBackgroundColor",
                name:"弹窗背景颜色",
                type:"color",
                value:"#000000",
                description:"选择弹窗背景颜色",
                onChange:(value)=>{
                    this.save("popupBackgroundColor",value);
                }
            },
            {
                id:"popupColor",
                name:"弹窗文字颜色",
                type:"color",
                value:"#ffffff",
                description:"选择弹窗文字颜色",
                onChange:(value)=>{
                    this.save("popupColor",value);
                }
            },
            {
                id:"popupFontSize",
                name:"弹窗字体大小",
                type:"number",
                value:32,
                description:"选择弹窗字体大小",
                onChange:(value)=>{
                    this.save("popupFontSize",value);
                } 
            },
            {
                id:"popupBorder",
                name:"弹窗启用边框",
                type:"checkbox",
                value:false,
                description:"选择是否启用边框",
                onChange:(value)=>{
                    this.save("popupBorder",value);
                }
            },
            {
                id:"popupBorderColor",
                name:"弹窗边框颜色",
                type:"color",
                value:"#000000",
                description:"选择边框颜色",
                onChange:(value)=>{
                    this.save("popupBorderColor",value);
                }
            },
            {
                id:"popupBorderWidth",
                name:"弹窗边框宽度",
                type:"number",
                value:1,
                description:"选择边框宽度",
                onChange:(value)=>{
                    this.save("popupBorderWidth",value);
                } 
            },
            {
                id:"popupBorderRadius",
                name:"弹窗圆角",
                type:"number",
                value:0,
                description:"选择边框圆角",
                onChange:(value)=>{
                    this.save("popupBorderRadius",value);
                }  
            },
            {
                id:"popupSpace",
                name:"弹窗与单词的距离",
                type:"number",
                value:10,
                description:"选择弹窗与单词的距离",
                onChange:(value)=>{
                    this.save("popupSpace",value);
                }
            },
        ];
    }
    /**
     * 渲染设置页面
     */
    render(){
        const settingsElement = document.createElement("div");
        settingsElement.id = "phoneticHelper-settings";
        for(const option of this.options){
            const element = document.createElement("div");
            element.innerText = option.name;
            element.appendChild(this.generateOptionElement(option));
            settingsElement.appendChild(element);
        }
        document.body.appendChild(settingsElement);
    }
    /**
     * 生成选项的操作元素
     * @param {Object} option 选项
     * @returns {HTMLElement} 操作元素
     */
    generateOptionElement(option){
        switch(option.type){
            case "checkbox":
                const element = document.createElement("input");
                element.type = "checkbox";
                element.checked = option.value;
                element.addEventListener("change",()=>{
                    option.value = element.checked;
                    option.onChange(element.checked); 
                })
                return element;
            case "select":
                const selectElement = document.createElement("select");
                for(const item of option.options){
                    const element = document.createElement("option");
                    element.value = item.value;
                    element.innerText = item.name;
                    selectElement.appendChild(element);
                }
                selectElement.value = option.value;
                selectElement.addEventListener("change",()=>{
                    option.value = selectElement.value;
                    option.onChange(selectElement.value); 
                })
                return selectElement;
            case "color":
                const colorElement = document.createElement("input");
                colorElement.type = "color";
                colorElement.value = option.value;
                colorElement.addEventListener("change",()=>{
                    option.value = colorElement.value;
                    option.onChange(colorElement.value); 
                })
                return colorElement;
            case "number":
                const numberElement = document.createElement("input");
                numberElement.type = "number";
                numberElement.value = option.value;
                numberElement.addEventListener("change",()=>{
                    option.value = numberElement.value;
                    option.onChange(numberElement.value); 
                })
                return numberElement;
            default:
                return null;
        } 
    }
}

const settings = new PhoneticHelperSettings();