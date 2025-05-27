import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type Props = {
  color: string;
  className?: ClassValue;
};

const CheckIcon: React.FC<Props> = ({ color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={cn("text-base", className)}
    >
      <path
        d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z"
        fill={color}
      />
    </svg>
  );
};

export default CheckIcon;
