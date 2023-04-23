import { useEffect, useState } from "react";

import { Input } from "./components/Input.jsx";
import { Output } from "./components/Output.jsx";
import { Tabs } from "./components/Tabs.jsx";

import pythonScript from "./main.py?raw";

function bridge(fn) {
  function inner(input) {
    const rawInput = JSON.stringify(input);
    const rawOutput = fn(rawInput);
    return JSON.parse(rawOutput);
  }

  return inner;
}

export default function App() {
  const [pythonFunctions, setPythonFunctions] = useState(null);

  const [inputOriginal, setInputOriginal] = useState("original");
  const [inputModified, setInputModified] = useState("modified");
  const [inputLabels, setInputLabels] = useState("labels");

  const [outputOriginal, setOutputOriginal] = useState(null);
  const [outputModified, setOutputModified] = useState(null);
  const [outputLabels, setOutputLabels] = useState(null);

  const [outputOriginalMissing, setOutputOriginalMissing] = useState([]);
  const [outputModifiedMissing, setOutputModifiedMissing] = useState([]);

  function setUpPython() {
    loadPyodide().then((py) => {
      py.runPython(pythonScript);
      setPythonFunctions({
        extractKeys: bridge(py.globals.get("extract_keys")),
        extractMissing: bridge(py.globals.get("extract_missing")),
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

  function updateOutputOriginalMissing() {
    if (pythonFunctions)
      setOutputOriginalMissing(
        pythonFunctions.extractMissing({
          this: outputOriginal.ids || [],
          other: outputModified.ids || [],
        })
      );
  }

  function updateOutputModifiedMissing() {
    if (pythonFunctions)
      setOutputModifiedMissing(
        pythonFunctions.extractMissing({
          this: outputModified.ids || [],
          other: outputOriginal.ids || [],
        })
      );
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

  useEffect(updateOutputOriginalMissing, [outputOriginal, outputModified]);
  useEffect(updateOutputModifiedMissing, [outputOriginal, outputModified]);

  return (
    <>
      <header>
        <h1>Keyboard Reducer</h1>
        <p>
          Describe original and modified layouts below and check if you're missing anything. This
          utility can be useful when designing keyboard layouts for compact keyboards (65%, 50%, 40%
          and so on).
        </p>
        <p>Powered by React and Pyodide.</p>
        <p>
          <a href="https://github.com/habitatofmatt/keyboard-reducer">Source Code</a> &middot;{" "}
          <a href="https://habitatofmatt.eu">Back to Habitat</a>
        </p>
      </header>
      <main>
        <Tabs title="Input">
          <Input onChange={updateInputOriginal} title="Original" value={inputOriginal} />
          <Input onChange={updateInputModified} title="Modified" value={inputModified} />
          <Input onChange={updateInputLabels} title="Labels" value={inputLabels} />
        </Tabs>
        <Tabs title="Output">
          <Output data={outputOriginal} labels={outputLabels} title="Original" />
          <Output data={outputModified} labels={outputLabels} title="Modified" />
        </Tabs>
      </main>
      <ul>
        <li>{JSON.stringify(outputOriginal)}</li>
        <li>{JSON.stringify(outputOriginalMissing)}</li>
        <li>{JSON.stringify(outputModified)}</li>
        <li>{JSON.stringify(outputModifiedMissing)}</li>
        <li>{JSON.stringify(outputLabels)}</li>
      </ul>
    </>
  );
}
