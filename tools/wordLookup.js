/**
 * 单词查找
 */
const readline = require('readline');
const fs = require('fs');
const path = require('path');

class WordLookup {
    constructor(options) {
        console.clear();
        this.showTitle();
        if (!options) {
            throw new Error("options is required");
        }
        if (!options.input) {
            throw new Error("input is required");
        }
        this.options = options;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const now = Date.now();
        this.dicJson = this.readFile();
        const cost = Date.now() - now;

        console.log("\n\n\n\n\n");
        this.printCard(`Load data...ok.     ${cost}ms     >_ type exit. to exit.`);
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
     * 运行
     */
    run() {
        //接收用户输入
        this.rl.question(">_ what are you looking for?\n\ttype:", (word) => {
            if (word === "exit.") {
                this.rl.close();
                console.log(">_ Goodbye!");
                return;
            }
            this.lookup(word.trim());
            this.run();
        })
    }
    /**
     * 查找单词
     * @param {String} word
     */
    lookup(word) {
        if (!word) {
            this.printCard("Please input a word");
            return;
        }
        if (word.split(" ").length > 1) {
            switch (word) {
                case "a word":
                    this.printCard("Try once more");
                    return;
                case "once more":
                    this.printCard("Try another word");
                    return;
                case "another word":
                    this.printCard("Try something else");
                    return;
            }
            this.printCard("One word at a time, please! I'm not a mind reader... yet.");
            return;
        }
        if (!this.dicJson) {
            throw new Error("DicJson is empty");
        }
        let wordInfo = this.dicJson[word];
        if (!wordInfo) {
            wordInfo = this.dicJson[word.toLowerCase()];
        }
        if (!wordInfo) {
            this.printCard("Not found: " + word);
            return;
        }
        this.showWordInfo({
            word: word,
            us: wordInfo.vc_phonetic_us.replace("[", "").replace("]", ""),
            uk: wordInfo.vc_phonetic_uk.replace("[", "").replace("]", "")
        });
    }
    /**
     * 显示单词信息
     */
    showWordInfo(obj) {
        this.printCard(
            `\x1b[33m${obj.word}\x1b[0m    us: \x1b[36m/${obj.us}/\x1b[0m uk: \x1b[32m/${obj.uk}/\x1b[0m`
            + (obj.word == "exit" ? "     >_ type exit. to exit." : "")
        );
    }
    printCard(msg) {
        process.stdout.write('\x1B[7A\x1B[1G');
        console.log("╔".padEnd(79, "═") + "╗");
        console.log("║".padEnd(79, " ") + "║");
        console.log("║".padEnd(79, " ") + "║");
        process.stdout.write('\x1B[1A\x1B[1G');
        console.log("║     " + msg);
        console.log("║".padEnd(79, " ") + "║");
        console.log("╚".padEnd(79, "═") + "╝");
    }
    /**
     * 在控制台打印软件标题
     */
    showTitle() {
        console.log(String.raw`
 _  _ ____ ____ ___  __   ____ ____ __ _ _    ____ 
 ||| \|   || . \|  \ | |  |   ||   || V \|| \ | . \
 ||\ /| . ||  <_| . \| |__| . || . ||  <_||_|\| __/
 |/\/ |___/|/\_/|___/|___/|___/|___/|/\_/|___/|/   
        `);
    }
}
const wordLookup = new WordLookup({
    input: "./data/words.json"
})
wordLookup.run();