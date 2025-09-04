import React, { useRef, useState, useEffect } from "react";

function LazyImage({ src, alt, className }) {
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={visible ? src : ""}
      alt={alt}
      className={className}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease-in" }}
    />
  );
}

export default LazyImage;
