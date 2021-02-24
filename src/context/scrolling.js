import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";

const ScrollingContext = createContext();

export function useScrolling() {
  return useContext(ScrollingContext);
}

export function ScrollingProvider({ children, items }) {
  const containerRef = useRef();

  const [anchors, setAnchors] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const registerContainer = useCallback((container) => {
    containerRef.current = container;
  }, []);

  const addAnchor = useCallback(
    (anchor) => setAnchors((prev) => [...prev, anchor]),
    []
  );

  const removeAnchor = useCallback(
    (anchor) => setAnchors((prev) => prev.filter((a) => a !== anchor)),
    []
  );

  useEffect(() => {
    const c = containerRef.current;

    const scroll = (event) => {
      const [closestToTop] = anchors.filter((anchor) => {
        const { height, top } = anchor.getBoundingClientRect();

        return top + height / 2 >= 0;
      });

      setCurrentItemIndex(
        anchors.findIndex((anchor) => anchor === closestToTop)
      );
    };

    c.addEventListener("scroll", scroll);

    return () => c.removeEventListener("scroll", scroll);
  }, [anchors]);

  useEffect(() => {
    window.location.hash = `#${items[currentItemIndex].id}`;
  }, [currentItemIndex, items]);

  return (
    <ScrollingContext.Provider
      value={{
        registerContainer,
        addAnchor,
        removeAnchor,
        currentItem: items[currentItemIndex] || null,
        items,
        selectItem: setCurrentItemIndex,
      }}
    >
      {children}
    </ScrollingContext.Provider>
  );
}
