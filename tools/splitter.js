/**
 * 单词数据中有的项是由多个单词组成的短语，
 * 这个代码将这些短语分割成单个单词。
 * 重新将新的单词储存到一个新的文件中。
 */

const fs = require('fs');
const path = require('path');

class Splitter {
    constructor(options) {
        if(!options){
            throw new Error("options is empty"); 
        }
        if(!options.input){
            throw new Error("input is empty"); 
        }
        if(!options.output){
            throw new Error("output is empty"); 
        }
        this.options = options;
    }
    /**
     * 读取文件
     * @returns {Object}
     */
    readFile() {
        const inputPath = path.resolve(this.options.input);
        const content = fs.readFileSync(inputPath, "utf-8");
        const json = JSON.parse(content);
        return json;
    }
    /**
     * 写入文件
     */
    saveFile(json) {
        console.log("写入文件"+this.options.output);
        const outputPath = path.resolve(this.options.output);
        const content = JSON.stringify(json);
        fs.writeFileSync(outputPath, content);
    }

    /**
     * 运行
     */
    run() {
        const json = this.readFile();
        const json_split={};
        let counterSingle=0;
        for(let key in json){
            const words = key.split(/[\s-]/).filter((word)=>{
                const regex = /[a-zA-Z]/;
                return regex.test(word);
            });
            if(words.length===1){
                //只有一个单词的情况
                json_split[key]=json[key];
                counterSingle++;
                continue;
            }

            //去除音标两边的[]符号
            const obj = json[key];
            obj.vc_phonetic_us = obj.vc_phonetic_us.replace(/\[|\]/g, '');
            obj.vc_phonetic_uk = obj.vc_phonetic_uk.replace(/\[|\]/g, '');
            
            //分割音符
            const us_phonetics = obj.vc_phonetic_us.split(/[\s-]/).filter((phonetic)=>{
                return phonetic.trim()!=='';
            });
            const uk_phonetics = obj.vc_phonetic_uk.split(/[\s-]/).filter((phonetic)=>{
                return phonetic.trim()!=='';
            });
            //如果美音和英音的音标数量不一致，则跳过
            if(us_phonetics.length!==uk_phonetics.length){
                json_split[key]=json[key];
                continue; 
            }
            
            for(let i=0;i<words.length;i++){
                const word = words[i];
                const us_phonetic = us_phonetics[i];
                const uk_phonetic = uk_phonetics[i];
                json_split[word]={
                    vc_phonetic_us: us_phonetic,
                    vc_phonetic_uk: uk_phonetic,
                }
            }
        }
        console.log(`单个单词数量:${counterSingle}`);
        
        console.log(`分词之前:${Object.keys(json).length}`);
        console.log(`分词之后:${Object.keys(json_split).length}`);
        this.saveFile(json_split);
    }
}

const splitter = new Splitter({
    input: "./data/words.json",
    output: "./data/words-split.json"
});
splitter.run();