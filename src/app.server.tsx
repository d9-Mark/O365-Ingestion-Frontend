import {
  createStartHandler,
  defaultRenderHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  renderHandler: defaultRenderHandler,
});
