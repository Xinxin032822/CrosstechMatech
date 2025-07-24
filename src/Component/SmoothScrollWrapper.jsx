import Scrollbar from 'smooth-scrollbar';
import { useEffect, useRef } from 'react';

function SmoothScrollWrapper({ children }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollbar = Scrollbar.init(scrollRef.current, {
      damping: 0.03, // lower = smoother (0.05–0.2 is good range)
    });

    return () => scrollbar.destroy();
  }, []);

  return (
    <div ref={scrollRef} style={{ height: '100vh', overflow: 'hidden' }}>
      <div>{children}</div>
    </div>
  );
}

export default SmoothScrollWrapper;
