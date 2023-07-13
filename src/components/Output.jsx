function mapDimension(value) {
  return `repeat(${value * 2}, 1.25rem)`;
}

function mapSize(value) {
  return `${value * 2 + 1} / span 2`;
}

export function Output({ labels, layout, missing }) {
  if (!layout) {
    return <div className="output">Loading...</div>;
  }

  return (
    <div className="output">
      <div
        className="keyboard"
        style={{
          gridTemplateColumns: mapDimension(layout.width),
          gridTemplateRows: mapDimension(layout.height),
        }}
      >
        {layout.keys.map(([x, y, ids], idx) => (
          <div className="key" key={idx} style={{ gridColumn: mapSize(x), gridRow: mapSize(y) }}>
            {ids.map((id, idx) => {
              const label = id in labels ? labels[id] : id;
              return <div key={idx}>{label || <>&nbsp;</>}</div>;
            })}
          </div>
        ))}
      </div>
      Missing: {missing.join(", ") || <i>none</i>}
    </div>
  );
}
