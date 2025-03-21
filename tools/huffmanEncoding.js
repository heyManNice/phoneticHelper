/**
 * 将单词和音标数据库使用huffman编码为二进制，节约空间
 */

/**
 * 分割符号:
 * |
 * 所有小写字母符号:
 * abcdefghijklmnopqrstuvwxyz
 * 所有英文音标符号:
 * 
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
    readJsonFile(path){
        const filePath = path.resolve(path);
        const content = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(content);
        return json;
    }
    /**
     * 找出文件中包含的所有音标
     */
}

const fo = new FileOp();
const json = fo.readJsonFile("./data/words-split.json");
console.log(json);

module.exports = {
    CodeMap,
    hmEncoder,
    hmDecoder 
}