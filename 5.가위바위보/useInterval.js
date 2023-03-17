import { useRef, useEffect } from 'react';

// const [isRunning, setIsRunning] = useState(true)
//  useInterval(() => {
//      console.log('hello');
//  }, isRunning ? 1000 : null);
// delay가 null이 되면 interval이 멈춰버림.

function useInterval(callback, delay) {

    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);

    return savedCallback.current;
}

export default useInterval;