import { useEffect, useState } from "react";

function getID(element) {
  return element.props.title.toLowerCase();
}

function getTitle(element) {
  return element.props.title;
}

export function Tabs({ children, title }) {
  const [currentID, setCurrentID] = useState("");

  useEffect(() => {
    if (children) setCurrentID(getID(children[0]));
  }, []);

  return (
    <div className="tabs">
      <div className="tabs-switcher">
        {title}:
        {children.map((tab) => {
          const tabID = getID(tab);
          const tabTitle = getTitle(tab);

          return (
            <label key={tabID}>
              <input
                checked={tabID === currentID}
                name={`tabs-${title.toLowerCase()}`}
                onChange={() => setCurrentID(tabID)}
                type="radio"
                value={tabID}
              />
              {tabTitle}
            </label>
          );
        })}
      </div>
      <div className="tabs-content">
        {children.map((tab) => {
          const tabID = getID(tab);
          return (
            <div className={"tab " + (tabID !== currentID ? "inactive" : "")} key={tabID}>
              {tab}
            </div>
          );
        })}
      </div>
    </div>
  );
}
