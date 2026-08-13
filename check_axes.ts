import { axes } from "./src/data/axes";

for (const axis of axes) {
  console.log(`${axis.id} -> ${axis.layer}`);
}
