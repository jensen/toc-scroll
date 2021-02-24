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
  const mouseRef = useRef();

  const [index, setIndex] = useState({
    scroll: 0,
    current: 0,
  });
  const [anchors, setAnchors] = useState([]);

  const setScrollToIndex = useCallback(
    (index) => setIndex((prev) => ({ ...prev, scroll: index })),
    []
  );
  const setCurrentItemIndex = useCallback(
    (index) => setIndex((prev) => ({ ...prev, current: index })),
    []
  );

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

  const scrollToIndex = index.scroll;
  const currentItemIndex = index.current;

  const checkScroll = useCallback(
    (id) => {
      const index = items.findIndex((item) => item.id === id);

      if (scrollToIndex === index && currentItemIndex !== index) {
        anchors[index].scrollIntoView(true);
        setCurrentItemIndex(index);
      }
    },
    [anchors, items, scrollToIndex, currentItemIndex, setCurrentItemIndex]
  );

  useEffect(() => {
    const mousemove = (event) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener("mousemove", mousemove);

    return () => window.addEventListener("mousemove", mousemove);
  }, []);

  useEffect(() => {
    const c = containerRef.current;

    const scroll = (event) => {
      const { x: containerX } = c.getBoundingClientRect();
      const { x: mouseX } = mouseRef.current;

      if (mouseX < containerX) {
        return;
      }

      const [closestToTop] = anchors.filter((anchor) => {
        const { height, top } = anchor.getBoundingClientRect();

        return top + height / 2 >= 0;
      });

      const index = anchors.findIndex((anchor) => anchor === closestToTop);

      setIndex({
        scroll: index,
        current: index,
      });
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
        selectItem: setScrollToIndex,
        checkScroll,
      }}
    >
      {children}
    </ScrollingContext.Provider>
  );
}
