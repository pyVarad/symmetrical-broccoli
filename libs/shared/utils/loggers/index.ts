import * as fs from "fs";
import * as path from "path";

const LOGS_DIR = path.resolve(process.cwd(), "logs");
const LOG_RETENTION_DAYS = 5;

const getLogFileName = (date = new Date()) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return path.join(LOGS_DIR, `appGenLogs_${mm}${dd}${yyyy}.log`);
};

const ensureLogsDir = () => {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
};

const cleanupOldLogs = () => {
  ensureLogsDir();
  const files = fs
    .readdirSync(LOGS_DIR)
    .filter((f) => /^appGenLogs_\d{8}\.log$/.test(f))
    .map((f) => ({
      file: f,
      date: new Date(f.slice(8, 16)),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  files.slice(LOG_RETENTION_DAYS).forEach(({ file }) => {
    fs.unlinkSync(path.join(LOGS_DIR, file));
  });
};

function getTimestamp() {
  return new Date().toISOString();
}

function getRunDemarcation() {
  return `\n===== LOG RUN START (${getTimestamp()}) =====\n`;
}

let runStarted = false;

export class Logger {
  private logFile: string;

  constructor() {
    ensureLogsDir();
    cleanupOldLogs();
    this.logFile = getLogFileName();
    if (!runStarted) {
      fs.appendFileSync(this.logFile, getRunDemarcation());
      runStarted = true;
    }
  }

  log(message: string, ...args: any[]) {
    const line = `[${getTimestamp()}] ${message} ${args.map((a) => JSON.stringify(a)).join(" ")}\n`;
    fs.appendFileSync(this.logFile, line);
  }

  info(message: string, ...args: any[]) {
    this.log(`INFO: ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(`WARN: ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log(`ERROR: ${message}`, ...args);
  }
}

export const logger = new Logger();
