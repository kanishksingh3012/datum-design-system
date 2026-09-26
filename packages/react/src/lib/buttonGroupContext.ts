import { createContext } from "react";
import type { ButtonAppearance, ButtonIntent, ButtonSize } from "../components/Button/Button";

/** What a ButtonGroup passes down to every Button inside it. A Button's own props win. */
export interface ButtonGroupContextValue {
  size?: ButtonSize;
  intent?: ButtonIntent;
  appearance?: ButtonAppearance;
  attached: boolean;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
