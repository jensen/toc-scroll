import { ScrollingProvider } from "../context/scrolling";
import SideBar from "./SideBar";
import Content from "./Content";

import groups from "../items.json";

function App() {
  return (
    <div className="container">
      <ScrollingProvider items={groups}>
        <SideBar />
        <Content />
      </ScrollingProvider>
    </div>
  );
}

export default App;
