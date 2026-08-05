import { prisma } from './prisma';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';

function formatLog(level: LogLevel, tag: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = `[SPARK_LOG][${timestamp}][${level}][${tag}]`;
  if (data !== undefined) {
    let serializedData = '';
    try {
      serializedData = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    } catch {
      serializedData = String(data);
    }
    return `${prefix} ${message} -> ${serializedData}`;
  }
  return `${prefix} ${message}`;
}

async function persistDbLog(level: LogLevel, tag: string, message: string, data?: any) {
  // Only persist to DB when running in Node.js server environment
  if (typeof window !== 'undefined') return;
  try {
    let metadataJson: any = null;
    if (data !== undefined) {
      if (typeof data === 'object') {
        metadataJson = data;
      } else {
        metadataJson = { raw: String(data) };
      }
    }
    await prisma.serverLog.create({
      data: {
        level,
        tag,
        message,
        metadata: metadataJson,
      },
    });
  } catch (err) {
    // Silent fail for logging persistence to prevent loop
  }
}

export const logger = {
  info: (tag: string, message: string, data?: any) => {
    console.log(formatLog('INFO', tag, message, data));
    persistDbLog('INFO', tag, message, data);
  },
  warn: (tag: string, message: string, data?: any) => {
    console.warn(formatLog('WARN', tag, message, data));
    persistDbLog('WARN', tag, message, data);
  },
  error: (tag: string, message: string, data?: any) => {
    console.error(formatLog('ERROR', tag, message, data));
    persistDbLog('ERROR', tag, message, data);
  },
  success: (tag: string, message: string, data?: any) => {
    console.log(formatLog('SUCCESS', tag, message, data));
    persistDbLog('SUCCESS', tag, message, data);
  },
  debug: (tag: string, message: string, data?: any) => {
    console.log(formatLog('DEBUG', tag, message, data));
    persistDbLog('DEBUG', tag, message, data);
  },
};
