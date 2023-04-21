import { useEffect, useState } from "react";

export function ContentSwitcher({ children }) {
  const [current, setCurrent] = useState("");

  function getContentTitle(content) {
    return content.props.title;
  }

  useEffect(() => {
    if (children) {
      setCurrent(getContentTitle(children[0]));
    }
  }, []);

  return (
    <section className="content-switcher">
      <nav>
        {children.map((child) => {
          const title = getContentTitle(child);
          return (
            <a href="#" key={title} onClick={() => setCurrent(title)}>
              {current === title ? <strong>{title}</strong> : title}
            </a>
          );
        })}
      </nav>
      {children.map((child) => {
        const title = getContentTitle(child);
        return (
          <div className={current === title ? "" : "hidden"} key={title}>
            {child}
          </div>
        );
      })}
    </section>
  );
}
