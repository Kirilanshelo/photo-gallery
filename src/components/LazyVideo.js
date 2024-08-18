import React, { useRef, useEffect } from 'react';

const LazyVideo = ({ file, index, handleImageLoad }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current.src = file;
                        observer.unobserve(videoRef.current);
                    }
                });
            },
            { threshold: 0.25 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [file]);

    return (
        <video 
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onLoadedMetadata={(event) => handleImageLoad(index, event)}
        />
    );
};

export default LazyVideo;