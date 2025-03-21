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
    const symbols = fo.collectPhoneticSymbols(json);
    fo.writeFile("./data/symbols.txt", symbols);
}

if(require.main === module){
    test(); 
}


module.exports = {
    CodeMap,
    hmEncoder,
    hmDecoder 
}