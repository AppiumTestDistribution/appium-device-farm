
function IOSStream() {

  const getParamsFromUrl = () => {
    if (window.location.hash.includes('?')) {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      return {
        port: params.get('port'),
        host: params.get('host'),
      };
    } else {
      return { port: 8004, host: '127.0.0.1', udid: '' };
    }
  };
  const params = getParamsFromUrl(); // Call the function to get parameters
    return (
      <div>
        <div>
          <img
            style={{
              maxHeight: 730 + 'px',
              maxWidth: 730 + 'px',
              width: 'auto',
              position: 'absolute',
            }}
            src={`http://${params.host}:${params.port}`}
          />
        </div>
      </div>
    );
}

export default IOSStream;