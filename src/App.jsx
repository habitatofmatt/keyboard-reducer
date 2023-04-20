import { useEffect, useState } from "react";

import { ContentSwitcher } from "./ContentSwitcher.jsx";

import pythonScript from "./main.py?raw";

function Input({ onChange, value }) {
  return <textarea onChange={onChange} value={value}></textarea>;
}

export default function App() {
  const [pythonFunctions, setPythonFunctions] = useState(null);

  const [inputOriginal, setInputOriginal] = useState("original");
  const [inputModified, setInputModified] = useState("modified");
  const [inputLabels, setInputLabels] = useState("labels");

  function setUpPython() {
    loadPyodide().then((py) => {
      py.runPython(pythonScript);
      setPythonFunctions({
        extractKeys: py.globals.get("extract_keys"),
        extractLabels: py.globals.get("extract_labels"),
      });
    });
  }

  function onInputOriginalChange(e) {
    setInputOriginal(e.target.value);
  }

  function onInputModifiedChange(e) {
    setInputModified(e.target.value);
  }

  function onInputLabelsChange(e) {
    setInputLabels(e.target.value);
  }

  useEffect(() => {
    setUpPython();
  }, []);

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
        <li>{pythonFunctions && pythonFunctions.extractKeys(inputOriginal)}</li>
        <li>{pythonFunctions && pythonFunctions.extractKeys(inputModified)}</li>
        <li>{pythonFunctions && pythonFunctions.extractLabels(inputLabels)}</li>
      </ul>
    </>
  );
}
