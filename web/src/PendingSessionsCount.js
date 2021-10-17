import { useEffect, useState } from 'react';

const PendingSessionsCount = ({ children }) => {
  const [pendingTests, setPendingTests] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/queue')
        .then((res) => res.json())
        .then(
          (data) => {
            setLoading(false);
            setPendingTests(data);
          },
          (error) => {
            setLoading(false);
            setError(error);
          }
        );
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (loading) {
    return <div>Loading pending tests</div>;
  } else if (error) {
    return <div>Something went wrong</div>;
  } else {
    return (
      <div className="pending-tests">
        {children}Queued Tests : {pendingTests}{' '}
      </div>
    );
  }
};
export default PendingSessionsCount;
