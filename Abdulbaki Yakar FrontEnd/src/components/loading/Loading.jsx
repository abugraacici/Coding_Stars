import './LoadingStyle.css'; // stil aşağıda
import { useSelector } from 'react-redux';

export default function Loading() {
    const isLoading = useSelector((state) => state.loading.isLoading);

    if (!isLoading) return null;

    return (
        <div className="global-loading-overlay">
            <div className="spinner"></div>
        </div>
    );
}
