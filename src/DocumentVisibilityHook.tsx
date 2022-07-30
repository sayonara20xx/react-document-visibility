import { useEffect, useState } from 'react';

interface HookReturns {
  count: number;
  isVisible: boolean;
  onVisibilityChange: (callback: (isVisible: boolean) => void) => void;
}

const useDocumentVisibility: () => HookReturns = () => {
  const [isActive, setIsActive] = useState(true);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    function updateActive() {
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

  const addVisibleListener = (callback: (isVisible: boolean) => void) => {
    const callbackDecorator = function () {
      callback(!document.hidden);
    };

    document.addEventListener('visibilitychange', callbackDecorator);
  };

  return {
    count: activeCount,
    isVisible: isActive,
    onVisibilityChange: addVisibleListener,
  };
};

export default useDocumentVisibility;
