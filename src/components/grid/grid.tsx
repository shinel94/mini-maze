import { useEffect, useRef } from "react";
import { GridInfo } from "../../util/maze_generate";
import "./grid.scss";

type GridProp = {
  gridInfo: GridInfo[][];
};

const Grid = (prop: GridProp) => {
  const gridElement = useRef<HTMLDivElement>(null);
  const rowNum = prop.gridInfo.length;
  const colNum = prop.gridInfo[0].length;
  useEffect(() => {
    if (gridElement.current) {
      gridElement.current.style.gridTemplateColumns = `repeat(${colNum}, 1fr)`;
      gridElement.current.style.gridTemplateRows = `repeat(${rowNum}, 1fr)`;
    }
  }, [gridElement, prop]);

  const cell = [];
  for (var i = 0; i < rowNum; i++) {
    for (var j = 0; j < colNum; j++) {
      cell.push(
        <div
          className={`cell cell--${prop.gridInfo[i][j]}`} key={`grid-${i}-${j}`}
        ></div>
      );
    }
  }

  return (
    <section className="grid" ref={gridElement}>
      {cell}
    </section>
  );
};

export default Grid;
