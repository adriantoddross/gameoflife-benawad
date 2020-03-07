import React, { useState, useCallback, useRef, RefObject } from "react";
import { produce } from "immer";

const numRows = 50;
const numCols = 50;
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1,0],
  [-1,0],
];

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    // simulate
    setTimeout(runSimulation, 1000);

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;

            if (gridCopy[i][k + 1] === 1) {
              neighbors += 1;
            }
          }
        }
      });
    });

    // const newGrid = produce();
  }, []);

  return (
    <>
      <div>
        <button onClick={() => setRunning(!running)}>
          {running ? "Stop" : "Start"}
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "1px solid black"
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
