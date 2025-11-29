import type { LokiConfig } from '@/config/loki';

// The structure Loki expects for a log stream
interface LokiStream {
  stream: Record<string, string>; // Labels
  values: [string, string][]; // Array of [timestamp, log_line]
}

interface LokiPushRequest {
  streams: LokiStream[];
}

export interface ILokiClient {
  send(message: string, extraLabels?: Record<string, string>): Promise<void>;
}

export class LokiClient implements ILokiClient {
  readonly config: LokiConfig;

  constructor(config: LokiConfig) {
    this.config = config;
  }

  buildPushRequest(message: string, extraLabels?: Record<string, string>): LokiPushRequest {
    const labels = { ...this.config.labels, ...extraLabels };
    const timestamp = (Date.now() * 1_000_000).toString();

    return {
      streams: [
        {
          stream: labels,
          values: [[timestamp, message]],
        },
      ],
    };
  }

  async send(message: string, extraLabels?: Record<string, string>): Promise<void> {
    const body = this.buildPushRequest(message, extraLabels);

    try {
      const response = await fetch(`${this.config.url}/loki/api/v1/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.status !== 204) {
        console.error(
          `[LokiClient] Failed to send log. Status: ${response.status}`,
          await response.text(),
        );
      }
    } catch (error) {
      console.error('[LokiClient] Error sending log to Loki:', error);
    }
  }
}
