/**
 * 将单词和音标数据库使用huffman编码为二进制，节约空间
 */

/**
 * 分割符号:
 * |
 * 所有小写字母符号:
 * abcdefghijklmnopqrstuvwxyz
 * 所有英文音标符号:(根据数据文件生成)
 * supɚˈiʃz:ərfɔʌmbdɪoʊnɑtɒðweθŋkæɜɡlˌahɝvjɛ ʒg() ̃
 */

const fs = require('fs');
const path = require('path');

/**
 * 编码映射
 */
class CodeMap {
    constructor() {
        this.map = {};
    }

}

/**
 * 编码器
 */

class hmEncoder{
    constructor(){}
    
    /**
     * 获取字符出现的次数
     */
    getCharCount(str){
        const map = {};
        for(const i in str){
            const char = str[i];
            if(!map[char]){
                map[char] = 1;
            }else{
                map[char]++;
            }
        }
        return map;
    }
    /**
     * 获取json数据中对应字段字符出现的次数
     */
    getCharCountFromJson(json, field){
        let string="";
        for(const key in json){
            if(!field){
                string += key;
            }else{
                string += json[key][field]
            }
        }
        const counters = this.getCharCount(string);
        //添加分隔符
        counters["◇"] = Object.keys(json).length;
        return counters;
    }
}


/**
 * 解码器
 */

class hmDecoder{
    
}

/**
 * 文件操作
 */

class FileOp{
    constructor(){}
    /**
     * 读取json文件
     */
    readJsonFile(file){
        const filePath = path.resolve(file);
        const content = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(content);
        return json;
    }
    writeFile(file, content){
        const filePath = path.resolve(file);
        fs.writeFileSync(filePath, content);
        console.log("write:", file);
        
    }
    /**
     * 找出文件中包含的所有音标符号
     */
    collectPhoneticSymbols(json){
        const symbolSet = new Set();
        for(const key in json){
            const us = json[key].vc_phonetic_us;
            for(const i in us){
                symbolSet.add(us[i]); 
            }
            const uk = json[key].vc_phonetic_uk;
            for(const i in uk){
                symbolSet.add(uk[i]);
            }
        }
        const symbolsStr = Array.from(symbolSet).join("");
        console.log(`length:${symbolsStr.length} [${symbolsStr}]`);
        return symbolsStr;
    }
}


function test(){
    const fo = new FileOp();
    const json = fo.readJsonFile("./data/words-split.json");
    //const symbols = fo.collectPhoneticSymbols(json);
    //fo.writeFile("./data/symbols.txt", symbols);

    const encoder = new hmEncoder();
    const cc = encoder.getCharCountFromJson(json);
    console.log(cc);
}

if(require.main === module){
    test(); 
}


module.exports = {
    CodeMap,
    hmEncoder,
    hmDecoder 
}