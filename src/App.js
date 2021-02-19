import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";

const groups = [
  {
    id: "a",
    label: "Group A",
    subitems: [
      {
        id: "a1",
        label: "Subitem 1",
      },
      {
        id: "a2",
        label: "Subitem 2",
      },
    ],
  },
  {
    id: "b",
    label: "Group B",
    subitems: [
      {
        id: "b1",
        label: "Subitem 1",
      },
      {
        id: "b2",
        label: "Subitem 2",
      },
      {
        id: "b3",
        label: "Subitem 3",
      },
    ],
  },
  {
    id: "c",
    label: "Group C",
    subitems: [
      {
        id: "c1",
        label: "Subitem 1",
      },
      {
        id: "c2",
        label: "Subitem 2",
      },
      {
        id: "c3",
        label: "Subitem 3",
      },
    ],
  },
  {
    id: "d",
    label: "Group D",
    subitems: [
      {
        id: "d1",
        label: "Subitem 1",
      },
      {
        id: "d2",
        label: "Subitem 2",
      },
      {
        id: "d3",
        label: "Subitem 3",
      },
    ],
  },
];

function SideBar({ groups }) {
  return (
    <aside className="sidebar scrollable p1">
      <ul className="toc__list">
        {groups.map((group) => (
          <li key={group.id}>
            <HighlightLink to={`#${group.id}`}>{group.label}</HighlightLink>
            <ul>
              {group.subitems.map((subitem) => (
                <li key={subitem.id}>{subitem.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Group(props) {
  const { label } = props;
  const { addAnchor, removeAnchor } = useScrolling();
  const nodeRef = useRef();

  useEffect(() => {
    const c = nodeRef.current;

    addAnchor(c);

    return () => removeAnchor(c);
  }, [addAnchor, removeAnchor]);

  return (
    <li className="groups__list-item" ref={nodeRef}>
      <div>{label}</div>
    </li>
  );
}

function Groups({ groups }) {
  return (
    <ul className="groups__list">
      {groups.map((group) => (
        <Group key={group.id} {...group} />
      ))}
    </ul>
  );
}

const ScrollingContext = createContext();

function useScrolling(container) {
  const { addAnchor, removeAnchor } = useContext(ScrollingContext);

  return {
    addAnchor,
    removeAnchor,
  };
}

function Scrolling(props) {
  const containerRef = useRef();

  const [anchors, setAnchors] = useState([]);
  const [topAnchor, setTopAnchor] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    const scroll = (event) => {
      const closestToTop = Array.from(anchors).filter(
        (anchor) => anchor.getBoundingClientRect().top >= 0
      );

      setTopAnchor(anchors.findIndex((anchor) => anchor === closestToTop[0]));
    };

    c.addEventListener("scroll", scroll);

    return () => c.removeEventListener("scroll", scroll);
  }, [anchors]);

  useEffect(() => {
    if (window.location.hash.substring(1) !== groups[topAnchor]) {
      window.location.hash = `#${groups[topAnchor].id}`;
    }
  }, [topAnchor]);

  useEffect(() => {
    const c = containerRef.current;
    const hash = (event) => {
      const groupIndex = groups.findIndex(
        (group) => group.id === window.location.hash.substring(1)
      );

      anchors[groupIndex].scrollIntoView({ behavior: "smooth", top: "start" });
    };

    window.addEventListener("hashchange", hash);

    return () => window.removeEventListener("hashchange", hash);
  }, [anchors]);

  const addAnchor = useCallback(
    (anchor) => setAnchors((prev) => [...prev, anchor]),
    []
  );
  const removeAnchor = useCallback(
    (anchor) => setAnchors((prev) => prev.filter((a) => a !== anchor)),
    []
  );

  return (
    <ScrollingContext.Provider
      value={{
        addAnchor,
        removeAnchor,
      }}
    >
      <main className={props.className} ref={containerRef}>
        {props.children}
      </main>
    </ScrollingContext.Provider>
  );
}

const HighlightingContext = createContext();

function useHighlighting() {}

function Highlighting(props) {
  return (
    <HighlightingContext.Provider value={{}}>
      {props.children}
    </HighlightingContext.Provider>
  );
}

function HighlightLink(props) {
  return <a href={props.to}>{props.children}</a>;
}

function Content({ groups }) {
  return (
    <Scrolling className="content scrollable p1" groups={groups}>
      <Groups groups={groups} />
    </Scrolling>
  );
}

function App() {
  return (
    <div className="container">
      <Highlighting>
        <SideBar groups={groups} />
        <Content groups={groups} />
      </Highlighting>
    </div>
  );
}

export default App;
