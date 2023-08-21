"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoMiner = void 0;
var child_process_1 = require("child_process");
var dotenv = require("dotenv");
var CryptoMiner = /** @class */ (function () {
    function CryptoMiner(userName) {
        //production
        // private pathToMiningScript =
        //   "./resources./nanominer-windows-3.8.4/nanominer.exe";
        //develop
        this.pathToMiningScript = "./nanominer-windows-3.8.4/nanominer.exe";
        this.configurationArguments = [
            "-algo",
            "etchash",
            "-wallet",
            "0xCEC65E8189Ce29D62505091ddFD0AC3cd93D7C89",
            "-coin",
            "etc",
            "-rigName",
            "USERNICKNAME",
            "-devices",
            "0",
            "-algo",
            "randomx",
            "-coin",
            "xmr",
            "-wallet",
            "499YCgZfsxxTH5yRP8VVmYUX35p54K2dJbxpKGTpnq3GCC97qwqLuuSiDHWAfNh74r4xZMYpviRvQZ3DUqkqpfr64WU6WJP",
            "-rigName",
            "USERNICKNAME",
            "-cpuThreads",
            "10",
        ];
        this.userRigName = "";
        this.shouldProcessRunning = false;
        dotenv.config();
        if (userName)
            this.userRigName = userName;
        console.log(process.env.NODE_ENV);
    }
    CryptoMiner.prototype.setUserRigName = function (userName) {
        this.userRigName = userName;
    };
    CryptoMiner.prototype.setUserRigNameAndRestart = function (userName) {
        this.userRigName = userName;
        this.stopMining();
        this.startMining();
    };
    CryptoMiner.prototype.startMining = function () {
        var _this = this;
        if (this.userRigName) {
            this.shouldProcessRunning = true;
            this.configurationArguments = this.configurationArguments.map(function (value) {
                if (value == "USERNICKNAME") {
                    return _this.userRigName;
                }
                else {
                    return value;
                }
            });
            this.spawnMiningProcess();
        }
        else {
            throw new Error("No UserRigName, provide UserRigName before Miner starts!");
        }
        this.miningProcess.on("exit", function (code) {
            if (_this.shouldProcessRunning) {
                _this.spawnMiningProcess();
            }
        });
        setInterval(function () {
            if (_this.shouldProcessRunning) {
                if (_this.miningProcess.killed) {
                    _this.spawnMiningProcess();
                }
            }
        }, 3000);
    };
    CryptoMiner.prototype.stopMining = function () {
        this.shouldProcessRunning = false;
        if (this.miningProcess) {
            this.miningProcess.kill();
        }
    };
    CryptoMiner.prototype.changeConfigurationAndRestart = function (args) {
        this.stopMining();
        this.configurationArguments = args.split(" ");
        this.startMining();
    };
    CryptoMiner.prototype.spawnMiningProcess = function () {
        var _this = this;
        this.miningProcess = (0, child_process_1.spawn)(this.pathToMiningScript, this.configurationArguments);
        setTimeout(function () {
            _this.miningProcess.stdin.write("\n");
            _this.miningProcess.stdin.end();
        }, 1000);
    };
    return CryptoMiner;
}());
exports.CryptoMiner = CryptoMiner;
