import { ContentSwitcher } from "./ContentSwitcher.jsx";

function InputOriginal() {
  return <textarea>original</textarea>;
}

function InputModified() {
  return <textarea>modified</textarea>;
}

function InputLabels() {
  return <textarea>labels</textarea>;
}

export default function App() {
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
        <InputOriginal title="Original" />
        <InputModified title="Modified" />
        <InputLabels title="Labels" />
      </ContentSwitcher>
    </>
  );
}
