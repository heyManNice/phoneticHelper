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
 * 节点
 */
class Node {
    constructor(value,char) {
        this.value = value;
        this.char = char;
        this.left = null;
        this.right = null;
    }
}

/**
 * 编码器
 */

class hmEncoder{
    constructor(){
        this.fileOp = new FileOp();
        this.json = this.fileOp.readJsonFile("./data/words-split.json");
    }
    /**
     * 生成huffman编码二进制文件和编码映射文件
     */
    /**
     * 从对象字符出现次数数据中生成huffman树
     * @param {Object} countData 字符出现次数数据
     * @returns {Node} 根节点
     */
    buildHuffmanTree(countData){
        const nodes = [];
        //初始化节点
        for(const char in countData){
            const node = new Node(countData[char], char);
            nodes.push(node);
        }
        //构建huffman树
        while(nodes.length > 1){
            nodes.sort((a, b) => {
                return a.value - b.value;
            });
            const left = nodes.shift();
            const right = nodes.shift();
            const parent = new Node(left.value + right.value);
            parent.left = left;
            parent.right = right;
            nodes.push(parent);
        }
        return nodes[0];
    }
    /**
     * 从huffman树中生成编码映射
     * @param {Node} root 根节点
     * @returns {Object} 编码映射
     */
    buildCodeMap(root){
        const map = {};
        this.buildCodeMapRecursive(root, "", map);
        return map; 
    }
    /**
     * 生成编码映射递归函数
     * @param {Node} root 根节点
     * @param {String} code 编码
     * @param {Object} map 编码映射
     */
    buildCodeMapRecursive(root, code, map){
        if(!root){
            return;
        }
        if(root.char){
            map[root.char] = code;
            return;
        }
        this.buildCodeMapRecursive(root.left, code + "0", map);
        this.buildCodeMapRecursive(root.right, code + "1", map);
    }
    
    /**
     * 获取字符出现的次数
     * @param {String} str 字符串
     * @returns {Object} 字符出现的次数
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
     * 获取json数据中对应字段的所有文本
     */
    getTextFromJson(json, field){
        let string="";
        for(const key in json){
            if(!field){
                string += key + "◇"; 
            }else{
                string += json[key][field] + "◇";   
            }
        }
        //去除最后一个分隔符
        string = string.slice(0, -1);
        return string;
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
    
}

if(require.main === module){
    test(); 
}


module.exports = {
    hmEncoder,
    hmDecoder 
}