//import DeviceFarmApiService from '../../api-service';

export const uploadFile = async (file: any, getParamsFromUrl: any) => {
  if (!file) {
    console.error('No file selected');
    return;
  }
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
    //await DeviceFarmApiService.installApk(udid, data.path);
    // Handle success, if needed
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle error, if needed
  }
};