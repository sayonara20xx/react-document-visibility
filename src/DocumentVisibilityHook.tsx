import { useEffect, useState, useRef } from 'react';

type InternalCallback = (isVisible: boolean) => void;
type SubscriberCallback = (callback: InternalCallback) => void;

const useDocumentVisibility = () => {
  const [isActive, setIsActive] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const subscribers = useRef<InternalCallback[]>([]);

  const callSubscribers = () => {
    subscribers.current.forEach((callback) => {
      callback(!document.hidden);
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

  const addVisibleListener : SubscriberCallback = (callback) => {
    subscribers.current = [...subscribers.current, callback];
  };

  return {
    count: activeCount,
    visible: isActive,
    onVisibilityChange: addVisibleListener,
  };
};

export { useDocumentVisibility };
