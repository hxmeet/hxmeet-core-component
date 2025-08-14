/**
 * Lightweight logger module with environment-aware behavior.
 *
 * Features:
 * - Provides logger methods: debug, info, warn, error
 * - Adds custom tag (e.g. [API], [Auth]) to all log output
 * - Colored output of the custom tags
 * - Uses console methods directly (bind) to preserve original caller line numbers
 * - Logging is only active in development mode (NODE_ENV === 'development')
 * - In production:
 *   - All logging is disabled (silent)
 *   - error() sends error messages to a remote server via POST /api/log-error
 * - Fully tree-shakable and framework-independent
 *
 * Usage:
 *   import { log, createLogger } from '@/utils/logger'
 *   log.info('App started')
 *
 *   const apiLogger = createLogger('API')
 *   apiLogger.error('Something went wrong')
 */

const isDev = process.env.NODE_ENV === 'development'

const style = `
      background: #7f8c8d;
      border-radius: 0.5em;
      color: white;
      padding: 2px 0.5em;
    `;

function noop(..._args: any[]) {}
function sendErrorToServer(..._args: any[]) {
  console.info("sendErrorToServer", _args)
  // const message = args.map(String).join(' ')
  // fetch('/api/log-error', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     message,
  //     time: new Date().toISOString(),
  //   }),
  // })
}

function createLogger(tag: string) {
  const prefix = `%c${tag}%c`
  return {
    debug: isDev ? console.debug.bind(console, prefix, style, "") : noop,
    info: isDev ? console.info.bind(console, prefix, style, "") : noop,
    warn: isDev ? console.warn.bind(console, prefix, style, "") : noop,
    error: isDev ? console.error.bind(console, prefix, style, "") : sendErrorToServer
  }
}

export const log = createLogger('HxMeet')

export { createLogger }