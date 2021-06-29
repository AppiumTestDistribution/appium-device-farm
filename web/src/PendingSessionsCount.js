import {useEffect, useState} from "react";
import axios from "axios";

const PendingSessionsCount = ({children}) => {
    const [pendingTests, setPendingTests] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        axios.get("http://localhost:3333/info")
            .then(res => {
                setPendingTests(res.data);
                setLoading(false);
            })
            .catch((error) => {
                    setLoading(false);
                    setError(error);
                    console.log(error)
                }
            );
    }, []);
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
        return <div className="pending-tests mt-4 p-2 bd-highlight">{children}Pending Tests : {pendingTests}  </div>;
    }
};
export default PendingSessionsCount;