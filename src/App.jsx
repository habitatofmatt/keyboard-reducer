import { useEffect, useState } from "react";

import { Input } from "./components/Input.jsx";
import { Output } from "./components/Output.jsx";
import { Tabs } from "./components/Tabs.jsx";

import { SAMPLE_LABELS, SAMPLE_MODIFIED, SAMPLE_ORIGINAL } from "./data.js";

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

  const [inputOriginal, setInputOriginal] = useState(SAMPLE_ORIGINAL);
  const [inputModified, setInputModified] = useState(SAMPLE_MODIFIED);
  const [inputLabels, setInputLabels] = useState(SAMPLE_LABELS);

  const [outputOriginal, setOutputOriginal] = useState(null);
  const [outputModified, setOutputModified] = useState(null);
  const [outputLabels, setOutputLabels] = useState(null);

  const [outputOriginalMissing, setOutputOriginalMissing] = useState([]);
  const [outputModifiedMissing, setOutputModifiedMissing] = useState([]);

  function setUpPython() {
    loadPyodide().then((py) => {
      py.runPython(pythonScript);
      setPythonFunctions({
        extractLabels: bridge(py.globals.get("extract_labels")),
        extractLayout: bridge(py.globals.get("extract_layout")),
        extractMissing: bridge(py.globals.get("extract_missing")),
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
    if (pythonFunctions) setOutputOriginal(pythonFunctions.extractLayout({ raw: inputOriginal }));
  }

  function updateOutputModified() {
    if (pythonFunctions) setOutputModified(pythonFunctions.extractLayout({ raw: inputModified }));
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
          <Output
            labels={outputLabels}
            layout={outputOriginal}
            missing={outputOriginalMissing}
            title="Original"
          />
          <Output
            labels={outputLabels}
            layout={outputModified}
            missing={outputModifiedMissing}
            title="Modified"
          />
        </Tabs>
      </main>
    </>
  );
}
