type WSEventType =
  | "run.started"
  | "run.progress"
  | "run.completed"
  | "run.failed"
  | "run.log"
  | "alert.triggered"

interface WSMessage {
  type: WSEventType
  data: Record<string, unknown>
  timestamp: string
}

type WSHandler = (message: WSMessage) => void

class ScraperWebSocket {
  private handlers: Map<WSEventType, WSHandler[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnects = 5

  connect(url: string): void {
    console.info(`[WS] Connected to ${url}`)
    this.reconnectAttempts = 0
  }

  on(event: WSEventType, handler: WSHandler): () => void {
    const handlers = this.handlers.get(event) || []
    handlers.push(handler)
    this.handlers.set(event, handlers)
    return () => {
      const h = this.handlers.get(event) || []
      this.handlers.set(event, h.filter((fn) => fn !== handler))
    }
  }

  off(event: WSEventType, handler: WSHandler): void {
    const handlers = this.handlers.get(event) || []
    this.handlers.set(
      event,
      handlers.filter((fn) => fn !== handler)
    )
  }

  simulateMessage(message: WSMessage): void {
    const handlers = this.handlers.get(message.type) || []
    handlers.forEach((h) => h(message))
  }

  disconnect(): void {
    this.handlers.clear()
    this.reconnectAttempts = 0
  }
}

export const ws = new ScraperWebSocket()
export type { WSEventType, WSMessage, WSHandler }
