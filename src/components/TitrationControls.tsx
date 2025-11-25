import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Droplet, Beaker } from "lucide-react";

interface TitrationControlsProps {
  onAddDrop: () => void;
  onAddML: (ml: number) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  disabled: boolean;
}

export const TitrationControls = ({
  onAddDrop,
  onAddML,
  isRunning,
  onToggleRunning,
  onReset,
  disabled,
}: TitrationControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={onToggleRunning}
          disabled={disabled}
          className="flex-1"
          variant={isRunning ? "destructive" : "default"}
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Auto Add
            </>
          )}
        </Button>
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Manual Addition</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onAddDrop}
            disabled={disabled || isRunning}
            variant="secondary"
            className="w-full"
          >
            <Droplet className="mr-2 h-4 w-4" />
            Add 0.1 mL
          </Button>
          <Button
            onClick={() => onAddML(1)}
            disabled={disabled || isRunning}
            variant="secondary"
            className="w-full"
          >
            <Beaker className="mr-2 h-4 w-4" />
            Add 1 mL
          </Button>
          <Button
            onClick={() => onAddML(5)}
            disabled={disabled || isRunning}
            variant="secondary"
            className="w-full col-span-2"
          >
            <Beaker className="mr-2 h-4 w-4" />
            Add 5 mL
          </Button>
        </div>
      </div>
    </div>
  );
};
