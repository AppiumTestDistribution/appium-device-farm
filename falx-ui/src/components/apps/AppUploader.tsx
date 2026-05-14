import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DeviceFarmApiService from '../../api-service';

enum FILE_UPLOAD_STATE {
  IDLE,
  UPLOADING,
  UPLOAD_SUCCESS,
  UPLOAD_ERROR,
}

export function AppUploader({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<FILE_UPLOAD_STATE>(FILE_UPLOAD_STATE.IDLE);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [appFileName, setAppFileName] = useState<string>('');

  const onModalClose = () => {
    setStatus(FILE_UPLOAD_STATE.IDLE);
    setStatusMessage('');
    onClose();
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
    backgroundColor: 'rgb(55 65 81 / var(--tw-bg-opacity));',
    color: 'rgb(255 255 255 / var(--tw-text-opacity));',
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
      maxFiles: 1,
      accept: {
        'application/vnd.android.package-archive': ['.apk', '.aab'],
        'application/x-ios-app': ['.ipa', '.app'],
        'application/zip': ['.zip'],
        'application/octet-stream': ['.apk', '.aab', '.ipa', '.app', '.zip'],
      },
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

  const uploadApp = async (file: any) => {
    setStatus(FILE_UPLOAD_STATE.UPLOADING);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/device-farm/api/dashboard/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      setStatus(FILE_UPLOAD_STATE.UPLOAD_ERROR);
      setStatusMessage('Unable to upload the app');
      return;
    }
    const data = await response.json();
    if (data.success === true) {
      await DeviceFarmApiService.appInformation(data.file, data.bundleId);
      setStatus(FILE_UPLOAD_STATE.UPLOAD_SUCCESS);
      setAppFileName(data.file.filename);
    }
  };

  const getComponentToRender = () => {
    switch (status) {
      case FILE_UPLOAD_STATE.IDLE:
        return (
          <div className="container">
            <div {...getRootProps({ style })} className="bg-gray-700 text-white">
              <input {...getInputProps()} />
              <p>Drag 'n' drop the app (.apk, .aab, .ipa, .app, .zip) here, or click to select a file</p>
            </div>
          </div>
        );
      case FILE_UPLOAD_STATE.UPLOAD_ERROR:
        return <div>{statusMessage}</div>;
      case FILE_UPLOAD_STATE.UPLOADING:
        return (
          <div className="flex flex-row items-center justify-center">
            {' '}
            <CircularProgress />
            Please wait.. We are uploading the app
          </div>
        );
      case FILE_UPLOAD_STATE.UPLOAD_SUCCESS:
        return (
          <div className="flex flex-row items-center justify-center">
            {' '}
            <DoneIcon color="success" fontSize="large" />
            <div>
              {appFileName.includes('wda')
                ? 'Resigned WDA has been uploaded successfully.'
                : `App has been uploaded successfully. Pass this in your appium app capability as app:${appFileName}`}
            </div>
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
      try {
        await uploadApp(acceptedFiles[0]);
      } catch (err: Error | any) {
        setStatus(FILE_UPLOAD_STATE.UPLOAD_ERROR);
        setStatusMessage(err?.message);
      }
    })();
  }, [acceptedFiles]);

  return (
    <>
      {open && (
        <div
          data-testid="modal-overlay"
          className="fixed top-0 right-0 left-0 z-50 h-modal overflow-y-auto overflow-x-hidden md:inset-0 md:h-full items-center justify-center flex bg-opacity-50 dark:bg-opacity-80 text-white bg-gray-600"
          style={{ position: 'fixed', overflow: 'auto', inset: '0px' }}
        >
          <div
            tabIndex={-1}
            role="dialog"
            className="relative h-full w-full p-4 md:h-auto max-w-2xl"
          >
            <div className="relative rounded-lg shadow bg-gray-700 flex flex-col max-h-[90dvh]">
              <div className="flex items-start justify-between rounded-t border-gray-600 border-b p-5">
                <h3 className="text-xl font-medium text-white">
                  Upload Apps/Assets
                </h3>
                <button
                  aria-label="Close"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  type="button"
                  onClick={onModalClose}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-auto bg-gray-800 text-white">
                <input multiple type="file" tabIndex={-1} style={{ display: 'none' }} />
                {getComponentToRender()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
