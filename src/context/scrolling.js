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
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    const c = containerRef.current;

    const scroll = (event) => {
      const closestToTop = Array.from(anchors).filter(
        (anchor) => anchor.getBoundingClientRect().top >= 0
      );

      setCurrentItem(anchors.findIndex((anchor) => anchor === closestToTop[0]));
    };

    c.addEventListener("scroll", scroll);

    return () => c.removeEventListener("scroll", scroll);
  }, [anchors]);

  useEffect(() => {
    window.location.hash = `#${items[currentItem].id}`;
  }, [currentItem, items]);

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

  const selectItem = useCallback(
    (index) => anchors[index].scrollIntoView({ behavior: "smooth" }),
    [anchors]
  );

  return (
    <ScrollingContext.Provider
      value={{
        items,
        registerContainer,
        addAnchor,
        removeAnchor,
        currentItem,
        selectItem,
      }}
    >
      {children}
    </ScrollingContext.Provider>
  );
}
