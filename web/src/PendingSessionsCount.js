import {useEffect, useState} from "react";

const PendingSessionsCount = ({children}) => {
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
                });
        }, 10000);
        return () => {
            clearInterval(interval);
        };
    },[] );
    if (loading) {
        return (
            <div className="d-flex flex-column bd-highlight mt-4 text-center">
                <div className="p-2 bd-highlight">Loading pending tests</div>
            </div>
        );
    } else if (error) {
        return (
            <div className="d-flex flex-column bd-highlight mb-4 text-center">
                <div className="p-2 bd-highlight">Something went wrong</div>
            </div>
        );
    } else {
        return <div className="pending-tests mt-4 p-2 bd-highlight">{children}Queued Tests : {pendingTests}  </div>;
    }
};
export default PendingSessionsCount;