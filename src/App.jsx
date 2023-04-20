import { useState } from "react";

import { ContentSwitcher } from "./ContentSwitcher.jsx";

function Input({ onChange, value }) {
  return <textarea onChange={onChange} value={value}></textarea>;
}

export default function App() {
  const [inputOriginal, setInputOriginal] = useState("original");
  const [inputModified, setInputModified] = useState("modified");
  const [inputLabels, setInputLabels] = useState("labels");

  function onInputOriginalChange(e) {
    setInputOriginal(e.target.value);
  }

  function onInputModifiedChange(e) {
    setInputModified(e.target.value);
  }

  function onInputLabelsChange(e) {
    setInputLabels(e.target.value);
  }

  return (
    <>
      <h1>Keyboard Reducer</h1>
      <p>
        Describe original and modified layouts here and check if you're missing anything.
        <br />
        Powered by React and Pyodide.
      </p>
      <p>
        <a href="https://github.com/habitatofmatt/keyboard-reducer">Source Code</a> &middot;{" "}
        <a href="https://habitatofmatt.eu">Back to Habitat</a>
      </p>
      <ContentSwitcher>
        <Input onChange={onInputOriginalChange} title="Original" value={inputOriginal} />
        <Input onChange={onInputModifiedChange} title="Modified" value={inputModified} />
        <Input onChange={onInputLabelsChange} title="Labels" value={inputLabels} />
      </ContentSwitcher>
      <ul>
        <li>{inputOriginal}</li>
        <li>{inputModified}</li>
        <li>{inputLabels}</li>
      </ul>
    </>
  );
}
