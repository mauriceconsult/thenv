import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (!props.active || !props.payload?.length) return null;
  return (
    <div className="bg-background border border-border px-3 py-2">
      <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
        {props.label}
      </p>
      <p className="font-serif text-lg font-bold text-foreground leading-none">
        {props.payload[0].value}
        <span className="font-mono text-[9px] text-muted-foreground ml-1.5 uppercase tracking-widest">
          articles
        </span>
      </p>
    </div>
  );
};
