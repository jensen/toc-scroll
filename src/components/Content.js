import { useEffect, useRef } from "react";
import { useScrolling } from "../context/scrolling";

function Group(props) {
  const { id, label } = props;
  const { addAnchor, removeAnchor, checkScroll } = useScrolling();
  const nodeRef = useRef();

  useEffect(() => {
    const c = nodeRef.current;

    addAnchor(c);

    return () => removeAnchor(c);
  }, [addAnchor, removeAnchor]);

  useEffect(() => {
    checkScroll(id);
  }, [id, checkScroll]);

  return (
    <li className="groups__list-item" ref={nodeRef}>
      <div>{label}</div>
    </li>
  );
}

function Groups(props) {
  const { items } = useScrolling();

  return (
    <ul className="groups__list">
      {items.map((item) => (
        <Group key={item.id} {...item} />
      ))}
    </ul>
  );
}

function Content() {
  const { registerContainer } = useScrolling();
  const containerRef = useRef(null);

  useEffect(() => {
    registerContainer(containerRef.current);
  }, [registerContainer]);

  return (
    <div className="content scrollable" ref={containerRef}>
      <Groups />
    </div>
  );
}

export default Content;
