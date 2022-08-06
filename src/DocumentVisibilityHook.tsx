import { useEffect, useState, useRef } from 'react';

type SubscriberCallback = (callback: (isVisible: boolean) => void) => void;
type decoratedCallback = () => void;

interface HookReturns {
  count: number;
  isVisible: boolean;
  onVisibilityChange: SubscriberCallback;
}

const useDocumentVisibility: () => HookReturns = () => {
  const [isActive, setIsActive] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const subscribers = useRef<decoratedCallback[]>([]);

  const callSubscribers = () => {
    subscribers.current.forEach((callback) => {
      callback();
    });
  };

  useEffect(() => {
    function updateActive() {
      callSubscribers();
      setIsActive(!document.hidden);
      if (document.hidden) {
        setActiveCount((prevState) => prevState + 1);
      }
    }

    document.addEventListener('visibilitychange', updateActive);

    return () => document.removeEventListener('visibilitychange', updateActive);
  }, []);

  const addVisibleListener = (callback: (isVisible: boolean) => void) => {
    const callbackDecorator = function () {
      callback(!document.hidden);
    };

    subscribers.current = [...subscribers.current, callbackDecorator];
  };

  return {
    count: activeCount,
    isVisible: isActive,
    onVisibilityChange: addVisibleListener,
  };
};

export default useDocumentVisibility;
