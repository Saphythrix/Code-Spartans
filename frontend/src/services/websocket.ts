export class WebcamWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessageCallback: (data: any) => void;

  constructor(url: string = 'ws://localhost:8000/ws/webcam', onMessage: (data: any) => void) {
    this.url = url;
    this.onMessageCallback = onMessage;
  }

  public connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('Webcam WebSocket Stream Connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.onMessageCallback(parsed);
        } catch (err) {
          console.error('Error parsing WS frame response:', err);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('Websocket error:', err);
      };

      this.ws.onclose = () => {
        console.log('Webcam WebSocket Closed');
      };
    } catch (err) {
      console.warn('Failed to establish WebSocket connection');
    }
  }

  public sendFrame(base64Image: string, videoId: string, timestampSeconds: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        image: base64Image,
        video_id: videoId,
        timestamp_seconds: timestampSeconds
      }));
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
