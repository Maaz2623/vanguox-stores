import {
  Tooltip,
  TooltipContent,
  TooltipProvider as Provider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TooltipProvider = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Provider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </Provider>
  );
};
