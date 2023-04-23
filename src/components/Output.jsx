function mapDimension(value) {
  return `repeat(${value * 2}, 1.25rem)`;
}

function mapSize(value) {
  return `${value * 2 + 1} / span 2`;
}

export function Output({ data, labels }) {
  if (!data) return null;

  return (
    <div className="output">
      <div
        className="keyboard"
        style={{
          gridTemplateColumns: mapDimension(data.width),
          gridTemplateRows: mapDimension(data.height),
        }}
      >
        {data.keys.map(([x, y, ids], idx) => (
          <div className="key" key={idx} style={{ gridColumn: mapSize(x), gridRow: mapSize(y) }}>
            {ids.map((id, idx) => {
              const label = id in labels ? labels[id] : id;
              return <div key={idx}>{label == null ? <>&nbsp;</> : label}</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
