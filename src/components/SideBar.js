import { useScrolling } from "../context/scrolling";

function SideBar(props) {
  const { items, currentItem, selectItem } = useScrolling();

  return (
    <aside className="sidebar scrollable p1">
      <ul className="toc__list">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`toc__list-item ${
              item === currentItem ? "toc__list-item--active" : ""
            }`}
            onClick={() => selectItem(index)}
          >
            <div>{item.label}</div>
            <ul>
              {item.subitems.map((subitem) => (
                <li key={subitem.id}>{subitem.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SideBar;
