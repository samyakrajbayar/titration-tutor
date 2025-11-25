import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TitrationGraph } from "./TitrationGraph";
import { TitrationFlask } from "./TitrationFlask";
import { TitrationControls } from "./TitrationControls";
import { Play, Pause, RotateCcw, Droplet } from "lucide-react";
import { toast } from "sonner";

export type TitrationScenario = {
  name: string;
  acid: string;
  base: string;
  acidConc: number;
  baseConc: number;
  volume: number;
  pKa?: number; // for weak acids
  strongAcid: boolean;
};

const scenarios: TitrationScenario[] = [
  {
    name: "Strong Acid - Strong Base",
    acid: "HCl",
    base: "NaOH",
    acidConc: 0.1,
    baseConc: 0.1,
    volume: 25,
    strongAcid: true,
  },
  {
    name: "Weak Acid - Strong Base",
    acid: "CH₃COOH",
    base: "NaOH",
    acidConc: 0.1,
    baseConc: 0.1,
    volume: 25,
    pKa: 4.76,
    strongAcid: false,
  },
];

export const TitrationSimulator = () => {
  const [scenario, setScenario] = useState<TitrationScenario>(scenarios[0]);
  const [volumeAdded, setVolumeAdded] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [dataPoints, setDataPoints] = useState<{ volume: number; pH: number }[]>([]);

  const calculatePH = (volume: number): number => {
    const { acidConc, baseConc, volume: initialVolume, pKa, strongAcid } = scenario;
    
    const molesAcid = (acidConc * initialVolume) / 1000;
    const molesBase = (baseConc * volume) / 1000;
    const totalVolume = (initialVolume + volume) / 1000;

    if (molesBase < molesAcid) {
      // Before equivalence point
      const excessAcid = molesAcid - molesBase;
      if (strongAcid) {
        const H = excessAcid / totalVolume;
        return -Math.log10(H);
      } else {
        // Henderson-Hasselbalch for weak acid
        const conjugateBase = molesBase;
        const remainingAcid = excessAcid;
        if (remainingAcid === 0) return pKa || 7;
        return (pKa || 7) + Math.log10(conjugateBase / remainingAcid);
      }
    } else if (molesBase > molesAcid) {
      // After equivalence point
      const excessBase = molesBase - molesAcid;
      const OH = excessBase / totalVolume;
      const pOH = -Math.log10(OH);
      return 14 - pOH;
    } else {
      // At equivalence point
      if (strongAcid) {
        return 7.0;
      } else {
        // Weak acid produces slightly basic solution
        return 8.5;
      }
    }
  };

  const addTitrant = (amount: number) => {
    setVolumeAdded((prev) => {
      const newVolume = Math.min(prev + amount, 50);
      const pH = calculatePH(newVolume);
      setDataPoints((points) => [...points, { volume: newVolume, pH }]);
      return newVolume;
    });
  };

  const reset = () => {
    setVolumeAdded(0);
    setDataPoints([{ volume: 0, pH: calculatePH(0) }]);
    setIsRunning(false);
    toast.success("Simulation reset");
  };

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (isRunning && volumeAdded < 50) {
      const interval = setInterval(() => {
        addTitrant(0.1);
      }, 100);
      return () => clearInterval(interval);
    } else if (volumeAdded >= 50) {
      setIsRunning(false);
      toast.info("Titration complete");
    }
  }, [isRunning, volumeAdded]);

  useEffect(() => {
    reset();
  }, [scenario]);

  const currentPH = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].pH : calculatePH(0);
  const equivalenceVolume = (scenario.acidConc * scenario.volume) / scenario.baseConc;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Titration Simulator
          </h1>
          <p className="text-muted-foreground">
            Interactive acid-base titration with real-time pH monitoring
          </p>
        </div>

        <Card className="p-6 shadow-lg border-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Scenario:</label>
              <Select
                value={scenario.name}
                onValueChange={(value) => {
                  const newScenario = scenarios.find((s) => s.name === value);
                  if (newScenario) setScenario(newScenario);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <TitrationFlask
                  pH={currentPH}
                  volumeAdded={volumeAdded}
                  maxVolume={scenario.volume}
                  isRunning={isRunning}
                />
                
                <Card className="p-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Acid</p>
                      <p className="font-semibold">{scenario.acid} ({scenario.acidConc}M)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Base</p>
                      <p className="font-semibold">{scenario.base} ({scenario.baseConc}M)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume Added</p>
                      <p className="font-semibold">{volumeAdded.toFixed(2)} mL</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current pH</p>
                      <p className="font-semibold text-lg">{currentPH.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Equivalence Point</p>
                      <p className="font-semibold">{equivalenceVolume.toFixed(2)} mL</p>
                    </div>
                  </div>
                </Card>

                <TitrationControls
                  onAddDrop={() => addTitrant(0.1)}
                  onAddML={(ml) => addTitrant(ml)}
                  isRunning={isRunning}
                  onToggleRunning={toggleRunning}
                  onReset={reset}
                  disabled={volumeAdded >= 50}
                />
              </div>

              <div>
                <TitrationGraph data={dataPoints} equivalenceVolume={equivalenceVolume} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
