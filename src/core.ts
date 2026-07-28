// The app core: Model, Msg, update, and the pure helpers they call -
// plain TypeScript in the app-core subset, compiled to native Zig at
// build time (no JS runtime ships in the binary). The view lives in
// app.native and binds this model by its own field names exactly as
// written here (`tickCount` binds as `{tickCount}`).
//
// The loop: edit here -> `native dev --core` for instant logic checks
// under node -> `native dev` to run the real app. `native check`
// verifies this file and the markup together.

import { Cmd } from "@native-sdk/core";
import { type KeyEvent } from "@native-sdk/core/events";

export interface Model {
  readonly count: number;
}

export type Msg =
  | { readonly kind: "reset" }
  | { readonly kind: "key"; readonly event: KeyEvent }
  | { readonly kind: "exit" };

export const viewUnbound = ["key", "exit"] as const;

export function commandMsg(name: string): Msg | null {
  if (name === "exit") return { kind: "exit" };
  if (name === "reset") return { kind: "reset" };
  return null;
}

export function keyMsg(event: KeyEvent): Msg | null {
  if (event.control && event.key === "backspace") return { kind: "exit" };
  if (event.key === "escape") return { kind: "reset" };
  return { kind: "key", event };
}

export function initialModel(): Model {
  return { count: 0 };
}

export function update(model: Model, msg: Msg): Model | [Model, Cmd<Msg>] {
  switch (msg.kind) {
    case "reset":
      return { ...model, count: 0 };
    case "key":
      if (msg.event.control && msg.event.key === "backspace") {
        return [model, Cmd.quitApp()];
      }
      if (msg.event.key === "escape") {
        return { ...model, count: 0 };
      }
      return { ...model, count: model.count + 1 };
    case "exit":
      return [model, Cmd.quitApp()];
  }
}
