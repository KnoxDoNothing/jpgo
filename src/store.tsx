import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { load, save } from "./db";
import { seed, mig } from "./seed";
import type { State } from "./types";
import { Mascot } from "./ui";
interface C {
  s: State;
  up: (f: (s: State) => State) => void;
  put: (s: State) => void;
  warn: string;
}
const X = createContext<C>(null!);
export const useS = () => useContext(X);
export function Provider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State | null>(null);
  const [warn, setWarn] = useState("");
  useEffect(() => {
    load()
      .then((x) => setS(x ? mig(x) : seed()))
      .catch((e) => {
        setWarn("無法讀取本機儲存（目前資料不會被保存）：" + e);
        setS(seed());
      });
  }, []);
  useEffect(() => {
    if (!s) return;
    save(s).catch((e) => setWarn("儲存失敗，請盡快匯出備份：" + e));
    const t = s.set.theme;
    document.documentElement.classList.toggle(
      "dark",
      t === "dark" ||
        (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }, [s]);
  if (!s)
    return (
      <div className="p-16 text-center">
        <Mascot size={96} />
        <p className="sub mt-3">載入中…</p>
      </div>
    );
  return (
    <X.Provider
      value={{ s, up: (f) => setS((p) => (p ? f(p) : p)), put: setS, warn }}
    >
      {children}
    </X.Provider>
  );
}
