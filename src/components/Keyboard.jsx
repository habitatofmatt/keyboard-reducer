function mapDimension(value) {
  return `repeat(${value * 2}, 1fr)`;
}

function mapSize(value) {
  return `${value * 2 + 1} / span 2`;
}

export function Keyboard({ data }) {
  if (!data) return null;

  return (
    <div
      className="keyboard"
      style={{
        gridTemplateColumns: mapDimension(data.width),
        gridTemplateRows: mapDimension(data.height),
      }}
    >
      {data.data.map(([x, y, ids], idx) => (
        <div className="key" key={idx} style={{ gridColumn: mapSize(x), gridRow: mapSize(y) }}>
          {ids.map((id, idx) => (
            <div key={idx}>{id}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
