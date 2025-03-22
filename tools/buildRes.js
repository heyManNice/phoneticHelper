/**
 * 构建单词的资源js模块文件
 */

const fs = require("fs");
const path = require("path");


class Builder {
    constructor(options) {
        if (!options) {
            throw new Error("opstions is required");
        }
        if (!options.input) {
            throw new Error("input is required"); 
        }
        if (!options.output) {
            throw new Error("output is required"); 
        }
        this.options = options;
    }
    /**
     * 读取json文件
     * @param {String} file
     * @returns {Object}
     */
    readFile(file) {
        const filePath = path.resolve(file);
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    }
    /**
     * 写入文件
     * @param {String} file
     * @param {String} data
     */
    writeFile(file, data) {
        const filePath = path.resolve(file);
        fs.writeFileSync(filePath, data);
        console.log(`write file success: ${file}`);
    }
    /**
     * 格式化数据
     * 去除包含数字、特殊字符的单词
     * 因为这些单词在该软件中基本上不会用到
     * 把音标的键缩短，减少文件大小
     * @param {Object} data
     * @returns {Object}
     */
    format(data){
        const result = {};
        //检测只有英文 正则
        const reg = /^[a-zA-Z]+$/;
        for (const key in data) {
            if (!reg.test(key)) {
                continue;
            }
            const item = data[key];
            result[key] = {
                us: item.vc_phonetic_us,
                uk: item.vc_phonetic_uk
            };
        }
        return result;
    }

    /**
     * 开始构建
     */
    build() {
        const startTime = Date.now();
        const json = this.readFile(this.options.input);
        const fjson = this.format(json);
        console.log(`Before:${Object.keys(json).length}  now:${Object.keys(fjson).length}`);
        const data = `export default ${JSON.stringify(fjson)};`;
        this.writeFile(this.options.output, data);
        console.log(`Done. ${Date.now() - startTime}ms`);
        
    }
}

const builder = new Builder({
    input: "./data/words-split.json",
    output: "./data/wordsResource.js",
});

builder.build();