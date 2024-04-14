import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Props = {
  outerState: number;
  setState: (value: number) => void;
  disabled: boolean;
};

const NumericInput: React.FC<Props> = ({ outerState, setState, disabled }) => {
  const [rawValue, setRawValue] = useState<string>(outerState.toString());

  useEffect(() => {
    setRawValue(outerState.toString());
    setState(outerState);
  }, [outerState]);

  return (
    <Input
      onBlur={() => {
        setRawValue((parseFloat(rawValue) || 0).toString());
        setState(parseFloat(rawValue) || 0);
      }}
      onChange={(e) => {
        setRawValue(e.target.value);
      }}
      type="number"
      value={rawValue}
      onKeyDown={(e) => {
        const key = e.code;
        if (key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      disabled={disabled}
    />
  );
};

export default NumericInput;
