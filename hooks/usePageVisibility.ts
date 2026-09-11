import { useState, useEffect } from 'react';

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        // Set initial state
        setIsVisible(!document.hidden);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return isVisible;
}
