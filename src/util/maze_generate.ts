export class Point {
  public state: boolean = false;
  public distance: number = 0;
  public x: number;
  public y: number;
  public l: Point | null = null;
  public r: Point | null = null;
  public u: Point | null = null;
  public d: Point | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set_distance(distance: number) {
    this.distance = distance;
  }

  set_left(point: Point) {
    this.l = point;
    point.r = this
  }

  set_right(point: Point) {
    this.r = point;
    point.l = this
  }

  set_up(point: Point) {
    this.u = point;
    point.d = this
  }

  set_down(point: Point) {
    this.d = point;
    point.u = this
  }

  connect(data: Point) {
    data.set_distance(this.distance + 1);
    const x_diff = this.x - data.x;
    const y_diff = this.y - data.y;
    if (x_diff == -1 && y_diff == 0) {
      this.set_right(data);
    } else if (x_diff == 1 && y_diff == 0) {
      this.set_left(data);
    } else if (x_diff == 0 && y_diff == -1) {
      this.set_down(data);
    } else if (x_diff == 0 && y_diff == 1) {
      this.set_up(data);
    } else {
      throw new Error("position is not connected");
    }
  }
}

function shuffle(array: number[]) {
  for (let index = array.length - 1; index > 0; index--) {
    // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
    const randomPosition = Math.floor(Math.random() * (index + 1));

    // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }
}

export const generate_maze: (width: number, height: number) => Promise<[Point[][], [number, number], [number, number]]> = async (
  width,
  height
) => {
  const maze = [];
  for (var row_idx = 0; row_idx < height; row_idx++) {
    const row = [];
    for (var col_idx = 0; col_idx < width; col_idx++) {
      row.push(new Point(col_idx, row_idx));
    }
    maze.push(row);
  }

  const start_x = Math.floor(Math.random() * width);
  const start_y = Math.floor(Math.random() * height);
  const start_idx: [number, number] = [start_x, start_y];
  const start_point: Point = maze[start_y][start_x];
  start_point.set_distance(0);
  const stack: [Point | null, Point][] = [[null, start_point]];
  while (stack.length > 0) {
    const now_info = stack.pop();
    if (!now_info) {
      break;
    }
    const prev = now_info[0];
    const now = now_info[1];
    if (now.state) {
      continue;
    }
    now.state = true;
    if (prev) {
      prev.connect(now);
    }
    const direction_list = [0, 1, 2, 3]; // 0 : l, 1 : u, 2 : r, 3 : d
    shuffle(direction_list);
    var selected: null | Point = null;
    for (
      var direction_idx = 0;
      direction_idx < direction_list.length;
      direction_idx++
    ) {
      const direction = direction_list[direction_idx];
      selected = null;
      
      if (direction === 0) {
          if (now.x === 0) {
            continue;
          }
          selected = maze[now.y][now.x - 1];
        } else if (direction === 1) {
          if (now.y === 0) {
            continue;
          }
          selected = maze[now.y - 1][now.x];
        } else if (direction === 2) {
          if (now.x === (width - 1)) {
            continue;
          }
          selected = maze[now.y][now.x + 1];
        } else if (direction === 3) {
          if (now.y === (height - 1)) {
            continue;
          }
          selected = maze[now.y + 1][now.x];
        }
      if (selected && !selected.state) {
        stack.push([now, selected]);
      }
    }
  }

  const row_arr = maze.map(row => {
    return Math.max(...row.map(point => point.distance))
  })
  const col_arr = []
  for (var c = 0; c < width; c++) {
    col_arr.push(Math.max(...maze.map(row => row[c].distance)))
  }
  const finish_x = col_arr.indexOf(Math.max(...col_arr))
  const finish_y = row_arr.indexOf(Math.max(...row_arr))
  const finish_idx: [number, number] = [finish_x, finish_y]

  return [maze, start_idx, finish_idx];
};

export type GridInfo = "S" | "G" | "R" | "W";

export const get_grid_info: (maze: Point[][], start_idx: [number, number], finish_idx: [number, number]) => Promise<GridInfo[][]> = async (maze, start_idx, finish_idx) => {
  const grid_info: GridInfo[][] = []
  const width = maze[0].length
  const height = maze.length
  for (var row = 0; row < (height * 2 - 1); row ++) {
    var row_info: GridInfo[] = []
    for (var col = 0; col < (width * 2 - 1); col ++) {
      row_info.push("W")
    }
    grid_info.push(row_info)
  }
  for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
      const selected = maze[row][col]
      grid_info[selected.y * 2][selected.x * 2] = "R"
      if (selected.r) {
        grid_info[selected.y * 2][selected.x * 2 + 1] = "R"
      }
      if (selected.d) {
        grid_info[selected.y * 2 + 1][selected.x * 2] = "R"
      }
      if (selected.l) {
        grid_info[selected.y * 2][selected.x * 2 - 1] = "R"
      }
      if (selected.u) {
        grid_info[selected.y * 2 - 1][selected.x * 2] = "R"
      }
    }
  }
  grid_info[start_idx[1] * 2][start_idx[0] * 2] = "S"
  grid_info[finish_idx[1] * 2][finish_idx[0] * 2] = "G"
  return grid_info;
};
