import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as path from "path";
import * as dotenv from 'dotenv';

export class CryptoMiner {
  private miningProcess!: ChildProcessWithoutNullStreams;
  //production
  // private pathToMiningScript =
  //   "./resources./nanominer-windows-3.8.4/nanominer.exe";
  //develop
  private pathToMiningScript =
    "./nanominer-windows-3.8.4/nanominer.exe";

  private configurationArguments: string[] = [
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
  private userRigName = "";
  private shouldProcessRunning = false;

  constructor(userName?: string) {
    dotenv.config();
    if (userName) this.userRigName = userName;
    console.log(process.env.NODE_ENV);
  }

  setUserRigName(userName: string) {
    this.userRigName = userName;
  }

  setUserRigNameAndRestart(userName: string) {
    this.userRigName = userName;
    this.stopMining();
    this.startMining();
  }

  startMining() {
    if (this.userRigName) {
      this.shouldProcessRunning = true;
      this.configurationArguments = this.configurationArguments.map((value) => {
        if (value == "USERNICKNAME") {
          return this.userRigName;
        } else {
          return value;
        }
      });
      this.spawnMiningProcess();
    } else {
      throw new Error(
        "No UserRigName, provide UserRigName before Miner starts!"
      );
    }

    this.miningProcess.on("exit", (code) => {
      if (this.shouldProcessRunning) {
        this.spawnMiningProcess();
      }
    });
    setInterval(() => {
      if (this.shouldProcessRunning) {
        if (this.miningProcess.killed) {
          this.spawnMiningProcess();
        }
      }
    }, 3000);
  }

  stopMining() {
    this.shouldProcessRunning = false;
    if (this.miningProcess) {
      this.miningProcess.kill();
    }
  }

  changeConfigurationAndRestart(args: string) {
    this.stopMining();
    this.configurationArguments = args.split(" ");
    this.startMining();
  }

  private spawnMiningProcess() {
    this.miningProcess = spawn(
      this.pathToMiningScript,
      this.configurationArguments
    );
    setTimeout(() => {
      this.miningProcess.stdin.write("\n");
      this.miningProcess.stdin.end();
    }, 1000);
  }
}
