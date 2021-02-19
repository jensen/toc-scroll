import { useEffect, useRef } from "react";
import { useScrolling } from "../context/scrolling";

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

function Groups(props) {
  const { items: groups } = useScrolling();

  return (
    <ul className="groups__list">
      {groups.map((group) => (
        <Group key={group.id} {...group} />
      ))}
    </ul>
  );
}

function Content({ groups }) {
  const { registerContainer } = useScrolling();
  const containerRef = useRef(null);

  useEffect(() => {
    registerContainer(containerRef.current);
  }, [registerContainer]);

  return (
    <div className="content scrollable" ref={containerRef}>
      <Groups groups={groups} />
    </div>
  );
}

export default Content;
