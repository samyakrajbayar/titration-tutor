import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface TitrationGraphProps {
  data: { volume: number; pH: number }[];
  equivalenceVolume: number;
}

export const TitrationGraph = ({ data, equivalenceVolume }: TitrationGraphProps) => {
  return (
    <Card className="p-6 h-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Titration Curve</h3>
          <p className="text-sm text-muted-foreground">pH vs Volume of Base Added</p>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="volume"
              label={{ value: "Volume Added (mL)", position: "insideBottom", offset: -5 }}
              stroke="hsl(var(--foreground))"
            />
            <YAxis
              domain={[0, 14]}
              label={{ value: "pH", angle: -90, position: "insideLeft" }}
              stroke="hsl(var(--foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <ReferenceLine
              y={7}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{ value: "Neutral pH", position: "right" }}
            />
            <ReferenceLine
              x={equivalenceVolume}
              stroke="hsl(var(--accent))"
              strokeDasharray="5 5"
              label={{ value: "Equivalence Point", position: "top" }}
            />
            <Line
              type="monotone"
              dataKey="pH"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20">
            <p className="text-muted-foreground">Acidic</p>
            <p className="font-semibold">pH &lt; 7</p>
          </div>
          <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
            <p className="text-muted-foreground">Neutral</p>
            <p className="font-semibold">pH = 7</p>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
            <p className="text-muted-foreground">Basic</p>
            <p className="font-semibold">pH &gt; 7</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
