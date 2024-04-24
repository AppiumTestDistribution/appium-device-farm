import DeviceFarmApiService from '../../api-service';

export const uploadFile = async (file: any, getParamsFromUrl: any) => {
  if (!file) {
    console.error('No file selected');
    return;
  }
  console.log(file);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/device-farm/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      alert('Failed to upload file');
    }

    const data = await response.json();
    console.log('File uploaded successfully:', data);

    const { udid } = getParamsFromUrl() as any;
    console.log(udid);
    await DeviceFarmApiService.installApp(udid, data.file.path);
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle error, if needed
  }
};

export async function toolBarControl(ws: WebSocket | undefined, controlAction: string, getParamsFromUrl: any) {
  console.log('Sending event', ws, JSON.stringify({ action: controlAction }));
  if (controlAction === 'close') {
    console.log('Closing session');
    const { udid } = getParamsFromUrl() as any;
    const response = await DeviceFarmApiService.closeSession(udid);
    if (response.status === 200) {
      window.location.href = '/device-farm/#';
    }
  } else {
    //const { udid } = getWebSocketPort() as any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ws.send(JSON.stringify({ action: controlAction }));
  }
}
