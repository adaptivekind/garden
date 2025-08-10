import { createGarden } from "@adaptivekind/markdown-graph";
import { getBaseDir } from "./config";

export const createSiteGarden = async () => {
  return createGarden({
    type: "file",
    path: getBaseDir(),
    noSections: true,
    justNodeNames: true,
  });
};
