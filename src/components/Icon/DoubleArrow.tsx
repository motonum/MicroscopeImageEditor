import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type Props = {
  color: string;
  className?: ClassValue;
};

const DoubleArrow: React.FC<Props> = ({ color, className }) => {
  return (
    <svg
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-base", className)}
    >
      <path
        d="m188-183 221-297-221-297h117l221 297-221 297zm295 0 221-297-221-297h116l222 297-222 297z"
        fill={color}
      />
    </svg>
  );
};

export default DoubleArrow;
