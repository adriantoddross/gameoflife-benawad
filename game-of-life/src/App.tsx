import React, { useState, useCallback, useRef } from "react";
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
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 250);
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.8 ? 1 : 0
                  )
                );
              }
              setGrid(rows);
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        {/* <button
        disabled={!running}
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          Randomize
        </button> */}
        <button disabled={running} onClick={() => setGrid(generateEmptyGrid())}>
          Clear
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 1.9vmin)`,
          gridTemplateRows: `repeat(${numRows}, 1.9vmin)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              // onClick={() => {
              //   const newGrid = produce(grid, gridCopy => {
              //     gridCopy[i][k] = grid[i][k] ? 0 : 1;
              //   });
              //   setGrid(newGrid);
              // }}
              style={{
                width: "1.9vmin",
                height: "1.9vmin",
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "0.5px solid gray"
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
