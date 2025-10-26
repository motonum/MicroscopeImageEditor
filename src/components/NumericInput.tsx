import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  outerState: number;
  setOuterState: (value: number) => void;
  disabled: boolean;
  rejectNegative?: boolean;
  defaultValue?: number;
};

const NumericInput: React.FC<Props> = ({ outerState, setOuterState, disabled, rejectNegative = false, defaultValue = 0 }) => {
  const [rawValue, setRawValue] = useState<string>(outerState.toString());

  useEffect(() => {
    setRawValue(outerState.toString());
    setOuterState(outerState);
  }, [outerState]);


  const handleBlur = useCallback(() => {
    const parsed = parseFloat(rawValue);
    if (rejectNegative && !isNaN(parsed) && parsed < 0) {
      toast.error("負の数は入力できません");
      setRawValue(defaultValue.toString());
      setOuterState(defaultValue);
      return;
    }
    if (isNaN(parsed)) {
      toast.error("有効な数値を入力してください");
    }
    const newValue = isNaN(parsed) ? defaultValue : parsed;
    setRawValue(newValue.toString());
    setOuterState(newValue);
  }, [rawValue, rejectNegative, setOuterState]);

  return (
    <Input
      onBlur={handleBlur}
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
