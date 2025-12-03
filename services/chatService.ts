import { WebhookResponse } from '../types';

export const sendMessageToWebhook = async (
  message: string,
  sessionId: string,
  webhookUrl: string
): Promise<WebhookResponse> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Read response as text first to handle cases where n8n returns raw string instead of JSON
    const text = await response.text();
    
    try {
      // Try parsing as JSON
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      // If parsing fails, assume it's a plain text response from the webhook.
      // This is expected behavior for some n8n nodes returning raw strings.
      return {
        output: text
      };
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};