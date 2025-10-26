// Custom logger formatter for cleaner development output
import { createWriteStream } from 'fs';
import * as path from 'path';

interface LogEntry {
  context?: string;
  message?: string;
  req?: any;
  res?: any;
  correlationId?: string;
  responseTime?: number;
  [key: string]: any;
}

// Almacena el último log para detectar repeticiones
let lastLog: { context?: string; message?: string; count: number } | null = null;
let logTimeout: NodeJS.Timeout | null = null;

/**
 * Formatea un log entry para salida limpia en desarrollo
 */
export function formatDevLog(logObj: LogEntry): string {
  // Filtrar logs vacíos o sin información útil
  if (!logObj.message && !logObj.context && !logObj.req) {
    return ''; // No mostrar logs vacíos
  }

  const { context, message, req, res, correlationId, responseTime, ...extra } = logObj;

  // Si el log es idéntico al anterior, incrementar contador
  if (lastLog && lastLog.context === context && lastLog.message === message) {
    lastLog.count++;
    
    // Resetear timeout
    if (logTimeout) {
      clearTimeout(logTimeout);
    }
    
    // Mostrar contador después de 500ms sin nuevos logs idénticos
    logTimeout = setTimeout(() => {
      if (lastLog && lastLog.count > 1) {
        console.log(`  ↳ (repetido ${lastLog.count}x)`);
      }
      lastLog = null;
    }, 500);
    
    return ''; // No mostrar el log repetido inmediatamente
  }

  // Si hay un log anterior con contador, mostrarlo antes del nuevo
  if (lastLog && lastLog.count > 1) {
    console.log(`  ↳ (repetido ${lastLog.count}x)`);
  }

  // Actualizar último log
  lastLog = { context, message, count: 1 };

  // Construir salida formateada
  let output = '';

  // Logs de HTTP requests (más detallados)
  if (req) {
    const method = req.method || '';
    const url = req.url || '';
    const status = res?.statusCode || '';
    const time = responseTime ? `${responseTime}ms` : '';
    
    output = `🌐 ${method} ${url}`;
    if (status) output += ` → ${status}`;
    if (time) output += ` (${time})`;
    if (correlationId) output += `\n   📝 ID: ${correlationId.substring(0, 8)}...`;
    
    return output;
  }

  // Logs normales con contexto
  if (context && message) {
    // Emojis para diferentes contextos
    const emoji = getContextEmoji(context);
    output = `${emoji} [${context}] ${message}`;
    
    // Si hay información extra relevante, mostrarla
    const extraKeys = Object.keys(extra).filter(k => 
      !['level', 'time', 'pid', 'hostname', 'v'].includes(k)
    );
    
    if (extraKeys.length > 0 && extraKeys.length < 3) {
      const extraInfo = extraKeys.map(k => `${k}: ${JSON.stringify(extra[k])}`).join(', ');
      output += `\n   ℹ️  ${extraInfo}`;
    }
    
    return output;
  }

  // Log solo con contexto
  if (context && !message) {
    return ''; // Ignorar logs vacíos con solo contexto
  }

  // Log solo con mensaje
  if (message) {
    return `📄 ${message}`;
  }

  return '';
}

/**
 * Obtiene emoji apropiado según el contexto
 */
function getContextEmoji(context: string): string {
  const emojiMap: Record<string, string> = {
    'NestFactory': '🏭',
    'InstanceLoader': '📦',
    'RoutesResolver': '🛣️',
    'RouterExplorer': '🗺️',
    'NestApplication': '🚀',
    'ResponseInterceptor': '🔄',
    'DomainErrorFilter': '❌',
    'MongooseModule': '🍃',
    'ConfigService': '⚙️',
    'AuthGuard': '🔐',
    'ValidationPipe': '✅',
  };

  return emojiMap[context] || '📌';
}

/**
 * Agrupa logs similares del mismo contexto
 */
export function shouldGroupLog(context?: string): boolean {
  const groupableContexts = [
    'InstanceLoader',
    'RouterExplorer',
  ];

  return context ? groupableContexts.includes(context) : false;
}
