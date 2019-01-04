export interface IMessage {
  command: string;
  payload: any;
}

export interface IUpdatePreviewPayload {
  uri: string;
  data: string;
}

export function updatePreview(payload: IUpdatePreviewPayload) : IMessage {
  return {
      command: 'source:update',
      payload
  };
}