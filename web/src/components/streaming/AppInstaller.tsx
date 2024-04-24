import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';
import { useMemo, useEffect, useState } from 'react';
import DeviceFarmApiService from '../../api-service';
import { CircularProgress } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

enum FILE_UPLOAD_STATE {
  IDLE,
  UPLOADING,
  INSTALLING,
  INSTALLATION_SUCCESS,
  INSTALLATION_ERROR,
}

export function AppInstaller({
  platform,
  open,
  onClose,
  deviceUdid,
}: {
  platform: 'ios' | 'android';
  open: boolean;
  onClose: () => void;
  deviceUdid: string;
}) {
  const [status, setStatus] = useState<FILE_UPLOAD_STATE>(FILE_UPLOAD_STATE.IDLE);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const onModalClose = () => {
    setStatus(FILE_UPLOAD_STATE.IDLE);
    setStatusMessage('');
    onClose();
  };

  const acceptedAppType = {
    android: {
      'application/vnd.android.package-archive': ['.apk'],
    },
    ios: {
    },
  };

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  const focusedStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } =
    useDropzone({
      accept: acceptedAppType[platform],
      maxFiles: 1,
    });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const installApp = async (file: any) => {
    setStatus(FILE_UPLOAD_STATE.UPLOADING);
    const formData = new FormData();
    formData.append('file', file);

    let response = await fetch('/device-farm/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      setStatus(FILE_UPLOAD_STATE.INSTALLATION_ERROR);
      setStatusMessage('Unable to upload the app');
    }

    const data = await response.json();
    setStatus(FILE_UPLOAD_STATE.INSTALLING);

    response = await DeviceFarmApiService.installApp(deviceUdid, data.file.path);
    if (response.status === 200) {
      setStatus(FILE_UPLOAD_STATE.INSTALLATION_SUCCESS);
    } else {
      setStatus(FILE_UPLOAD_STATE.INSTALLATION_ERROR);
      setStatusMessage((response as any).message);
    }
  };

  const getComponentToRender = () => {
    switch (status) {
      case FILE_UPLOAD_STATE.IDLE:
        return (
          <div className="container">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop the app here, or click to select a file</p>
            </div>
          </div>
        );
      case FILE_UPLOAD_STATE.INSTALLATION_ERROR:
        return <div>{statusMessage}</div>;
      case FILE_UPLOAD_STATE.INSTALLING:
        return (
          <div className="app-upload-status">
            {' '}
            <CircularProgress />
            Please wait.. app is currently installing
          </div>
        );
      case FILE_UPLOAD_STATE.UPLOADING:
        return (
          <div className="app-upload-status">
            {' '}
            <CircularProgress />
            Please wait.. We are uploading the app
          </div>
        );
      case FILE_UPLOAD_STATE.INSTALLATION_SUCCESS:
        return (
          <div className="app-upload-status">
            {' '}
            <DoneIcon color="success" fontSize="large" />
            App has been installed successfully
          </div>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    (async () => {
      if (!acceptedFiles.length) {
        return;
      }
      console.log(acceptedFiles);
      try {
        await installApp(acceptedFiles[0]);
      } catch (err: Error | any) {
        setStatus(FILE_UPLOAD_STATE.INSTALLATION_ERROR);
        setStatusMessage(err?.message);
      }
    })();
  }, [acceptedFiles]);

  return (
    <Modal
      isOpen={open}
      onRequestClose={onModalClose}
      className="modal-small"
      overlayClassName="Overlay"
    >
      {getComponentToRender()}
    </Modal>
  );
}
