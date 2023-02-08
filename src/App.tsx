import { useRef, useState, KeyboardEvent, useEffect } from "react";
import "./App.css";
import Check from "./components/checker/check";
import Grid from "./components/grid/grid";
import {
  generate_maze,
  get_grid_info,
  GridInfo,
  Point,
} from "./util/maze_generate";

function App() {
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);

  const [gridInfo, setGridInfo] = useState<GridInfo[][]>([]);

  const [maze, setMaze] = useState<Point[][]>([]);
  const [startIdx, setStartIdx] = useState<[number, number]>([0, 0]);
  const [nowIdx, setNowIdx] = useState<[number, number]>([0, 0]);
  const [finishIdx, setFinishIdx] = useState<[number, number]>([0, 0]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(true);

  const moveCheck = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isMoving) {
      setIsMoving(true);
      const nowPoint = maze[nowIdx[1]][nowIdx[0]]
      switch (event.key) {
        case "2":
          if (nowPoint.d) {
            setNowIdx([nowIdx[0], nowIdx[1] + 1])
          }
          break;
        case "4":
          if (nowPoint.l) {
            setNowIdx([nowIdx[0] - 1, nowIdx[1]])
          }
          break;
        case "8":
          if (nowPoint.u) {
            setNowIdx([nowIdx[0], nowIdx[1] - 1])
          }
          break;
        case "6":
          if (nowPoint.r) {
            setNowIdx([nowIdx[0] + 1, nowIdx[1]])
          }
          break;
      }
      setTimeout(() => {
        setIsMoving(false), 500
      })
    }
  };

  return (
    <div className="App">
      <div className="maze-header" key={"maze-header"}>
        <label htmlFor="width">Width</label>
        <input type={"number"} id={"width"} min={3} ref={widthRef}></input>
        <label htmlFor="height">height</label>
        <input type={"number"} id={"height"} min={3} ref={heightRef}></input>
        <button
          onClick={() => {
            setIsGenerating(true);
            if (widthRef.current && heightRef.current) {
              const mazeWidth = Number.parseInt(widthRef.current.value);
              const mazeHeight = Number.parseInt(heightRef.current.value);
              generate_maze(
                mazeWidth < 3 ? 3 : mazeWidth,
                mazeHeight < 3 ? 3 : mazeHeight
              )
                .then((mazeInfo) => {
                  get_grid_info(mazeInfo[0], mazeInfo[1], mazeInfo[2])
                    .then((gridInfo) => {
                      setGridInfo(gridInfo);
                      setMaze(mazeInfo[0]);
                      setStartIdx(mazeInfo[1]);
                      setNowIdx(mazeInfo[1]);
                      setFinishIdx(mazeInfo[2]);
                      setIsMoving(false)
                    })
                    .finally(() => {
                      setIsGenerating(false);
                    });
                })
                .catch(() => {
                  setIsGenerating(false);
                });
            }
          }}
        >
          Generate
        </button>
      </div>
      {isGenerating ? (
        <div>
          <h1> Now generating Maze </h1>
        </div>
      ) : gridInfo.length > 0 ? (
        <div style={{ display: "flex", position: "relative" }}   onKeyDown={moveCheck} tabIndex={0}>
          <Grid key={"grid-comp"} gridInfo={gridInfo} />
          <Check
            key={"check-comp"}
            positionX={nowIdx[0]}
            positionY={nowIdx[1]}
          />
        </div>
      ) : (
        <div>
          <h1> Please generate maze for run! </h1>
        </div>
      )}
    </div>
  );
}

export default App;
