import { useEffect, useRef, useState } from 'react';

export function useInfiniteScroll(callback: () => void) {
    const [isFetching, setIsFetching] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isFetching) {
                    setIsFetching(true);
                    callback();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observerTarget, isFetching]); // Removed callback to prevent infinite loop

    useEffect(() => {
        if (isFetching) {
            // Reset fetching state after a delay or moved by parent
            // This simple hook relies on parent getting new data and re-rendering
            // For now self-reset after timeout if no external control
            const timer = setTimeout(() => setIsFetching(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isFetching]);

    return { observerTarget, isFetching, setIsFetching };
}
