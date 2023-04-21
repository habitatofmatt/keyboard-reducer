import { useEffect, useState } from "react";

import { ContentSwitcher } from "./ContentSwitcher.jsx";

import pythonScript from "./main.py?raw";

function bridge(fn) {
  function inner(input) {
    const rawInput = JSON.stringify(input);
    const rawOutput = fn(rawInput);
    return JSON.parse(rawOutput);
  }

  return inner;
}

function Input({ onChange, value }) {
  return <textarea onChange={onChange} value={value}></textarea>;
}

export default function App() {
  const [pythonFunctions, setPythonFunctions] = useState(null);

  const [inputOriginal, setInputOriginal] = useState("original");
  const [inputModified, setInputModified] = useState("modified");
  const [inputLabels, setInputLabels] = useState("labels");

  const [outputOriginal, setOutputOriginal] = useState({});
  const [outputModified, setOutputModified] = useState({});
  const [outputLabels, setOutputLabels] = useState({});

  function setUpPython() {
    loadPyodide().then((py) => {
      py.runPython(pythonScript);
      setPythonFunctions({
        extractKeys: bridge(py.globals.get("extract_keys")),
        extractLabels: bridge(py.globals.get("extract_labels")),
      });
    });
  }

  function updateInputOriginal(e) {
    setInputOriginal(e.target.value);
  }

  function updateInputModified(e) {
    setInputModified(e.target.value);
  }

  function updateInputLabels(e) {
    setInputLabels(e.target.value);
  }

  function updateOutputOriginal() {
    if (pythonFunctions) setOutputOriginal(pythonFunctions.extractKeys({ raw: inputOriginal }));
  }

  function updateOutputModified() {
    if (pythonFunctions) setOutputModified(pythonFunctions.extractKeys({ raw: inputModified }));
  }

  function updateOutputLabels() {
    if (pythonFunctions) setOutputLabels(pythonFunctions.extractLabels({ raw: inputLabels }));
  }

  function updateOutput() {
    updateOutputOriginal();
    updateOutputModified();
    updateOutputLabels();
  }

  useEffect(setUpPython, []);

  useEffect(updateOutput, [pythonFunctions]);

  useEffect(updateOutputOriginal, [inputOriginal]);
  useEffect(updateOutputModified, [inputModified]);
  useEffect(updateOutputLabels, [inputLabels]);

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
        <Input onChange={updateInputOriginal} title="Original" value={inputOriginal} />
        <Input onChange={updateInputModified} title="Modified" value={inputModified} />
        <Input onChange={updateInputLabels} title="Labels" value={inputLabels} />
      </ContentSwitcher>
      <ul>
        <li>{JSON.stringify(outputOriginal)}</li>
        <li>{JSON.stringify(outputModified)}</li>
        <li>{JSON.stringify(outputLabels)}</li>
      </ul>
    </>
  );
}
