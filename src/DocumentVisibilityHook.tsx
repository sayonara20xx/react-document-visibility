import { useEffect, useRef, useState } from 'react';

interface hookReturns {
  count: number;
  isVisible: boolean;
  onVisibilityChange: (callback: (isVisible: boolean | void) => void) => void;
}

let useDocumentVisibility: () => hookReturns = () => {
  const isActivePageRef = useRef<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    function updateActive() {
      isActivePageRef.current = !document.hidden;
      setIsActive(!document.hidden);
      if (document.hidden) {
        setActiveCount((prevState) => prevState + 1);
      }
    }

    document.addEventListener('visibilitychange', function () {
      updateActive();
    });

    return () => document.removeEventListener('visibilitychange', updateActive);
  }, []);

  const addVisibleListener = (callback: (isVisible: boolean | void) => void) => {
    // eslint-disable-next-line no-restricted-globals
    let tempFunction = function () {
      callback(isActivePageRef.current);
    };

    document.addEventListener('visibilitychange', tempFunction);
  };

  return {
    count: activeCount,
    isVisible: isActive,
    onVisibilityChange: addVisibleListener,
  };
};

export default useDocumentVisibility;
