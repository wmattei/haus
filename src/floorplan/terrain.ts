import { cmToPx } from "../utils/dimensions";
import { Vertex } from "../vertex";

export class Terrain {
  constructor(
    public id: string,
    public width: number,
    public height: number,
    public center: Vertex
  ) {}

  get widthPx() {
    return cmToPx(this.width);
  }
  get heightPx() {
    return cmToPx(this.height);
  }
}
