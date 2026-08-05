/**
 * Spark Kids Learning - High-Visibility Structured Logger
 * Emits timestamped, colorized, tagged logs for server & client diagnostics
 */

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

export const logger = {
  info: (tag: string, message: string, data?: any) => {
    console.log(formatLog('INFO', tag, message, data));
  },
  warn: (tag: string, message: string, data?: any) => {
    console.warn(formatLog('WARN', tag, message, data));
  },
  error: (tag: string, message: string, data?: any) => {
    console.error(formatLog('ERROR', tag, message, data));
  },
  success: (tag: string, message: string, data?: any) => {
    console.log(formatLog('SUCCESS', tag, message, data));
  },
  debug: (tag: string, message: string, data?: any) => {
    console.log(formatLog('DEBUG', tag, message, data));
  },
};
