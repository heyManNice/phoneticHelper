/**
 * 将csv格式的数据转换为json格式
 */

const fs = require("fs");
const path = require("path");

class Csv2Json {
    constructor(options) {
        if (!options) {
            throw new Error("options is required");
        }
        if (!options.input) {
            throw new Error("input is required");
        }
        if (!options.output) {
            throw new Error("output is required");
        }
        if (!options.keyName) {
            throw new Error("keyName is required");
        }
        if (!options.valueName) {
            throw new Error("valueName is required");
        }
        if (!options.separator) {
            throw new Error("separator is required");
        }
        this.options = options;
    }
    /**
     * 运行
     */
    run() {
        console.time("readFile");
        const lines = this.readFile();
        console.timeEnd("readFile");

        const header = this.getHeader(lines);

        console.time("\ntoJson");
        const json = this.toJson(lines, header);
        console.timeEnd("\ntoJson");

        console.time("saveFile");
        this.saveFile(json);
        console.timeEnd("saveFile");
        console.log("Done");
    }

    /**
     * 转换为json
     */
    toJson(lines, header) {
        const json = {};
        const linesLength = lines.length;
        for (let i = 0; i < linesLength; i++) {
            //进度条
            //当前数据量小，没必要启用进度条
            /* if(i % 1000 === 0){
                this.showProgress(i,linesLength);
            } */

            //处理数据
            const line = lines[i];
            if (this.isEmpty(line)) {
                continue;
            }
            const data = line.split(this.options.separator);
            if (data.length !== header.length) {
                console.log(`\n${i + 2} line: ${line}`);
                throw new Error("data length is not equal to header length");
            }
            const obj = {};
            //顶层索引key
            let topKey;
            for (let j = 0; j < header.length; j++) {
                const key = header[j];
                if (key === this.options.keyName) {
                    topKey = data[j];
                }
                if (!(this.options.valueName.includes(key))) {
                    continue;
                }
                const value = data[j];
                obj[key] = value;
            }
            if (this.isEmpty(topKey)) {
                console.log(`\n${i + 2} line: ${line}`);
                console.log(data);
                throw new Error(`topKey ${this.options.keyName} is empty`);
            }
            json[topKey] = obj;
        }
        this.showProgress(1, 1);
        return json;
    }

    /**
     * 显示进度条
     * @param {Number} now 当前进度
     * @param {Number} total 总进度
     */
    showProgress(now, total) {
        const progress = Math.floor(now / total * 100);
        const consoleWidth = process.stdout.columns > 80 ? 80 : process.stdout.columns;
        const progressWidth = Math.floor(consoleWidth * progress / 100);
        const progressBar = "=".repeat(progressWidth) + ">" + " ".repeat(consoleWidth - progressWidth);
        process.stdout.write(`\r${progress}% [${progressBar}]`);
    }

    /**
     * 获取csv文件的头字段
     * @returns {Array}
     */
    getHeader(lines) {
        if (!lines) {
            throw new Error("lines is empty");
        }
        const line = lines.shift();
        if (this.isEmpty(line)) {
            throw new Error("header is empty");
        }
        const header = line.split(this.options.separator);
        if (!header) {
            throw new Error("header is empty");
        }
        return header;
    }

    /**
     * 判断字符串是否是空的
     */
    isEmpty(str) {
        if (str === null || str === undefined) {
            return true;
        }
        str = str.trim();
        return str === "";
    }

    /**
     * 读取文件，按行分割返回数组
     * @returns {Array}
     */
    readFile() {
        const inputPath = path.resolve(this.options.input);
        const content = fs.readFileSync(inputPath, "utf-8");
        const lines = content.split("\n");
        return lines;
    }
    /**
     * 保存json文件
     * @param {Object} json
     */
    saveFile(json) {
        if (!json) {
            throw new Error("json is empty");
        }
        const outputPath = path.resolve(this.options.output);
        const content = JSON.stringify(json);
        fs.writeFileSync(outputPath, content, "utf-8");
    }
}

const csv2json = new Csv2Json({
    input: "./data/words.csv",//输入的文件
    output: "./data/words.json",//输出的文件
    keyName: "vc_vocabulary",//顶层键
    valueName: ["vc_phonetic_us", "vc_phonetic_uk"],//值对象包含的内容
    separator: ">"//csv分隔符
})
csv2json.run();