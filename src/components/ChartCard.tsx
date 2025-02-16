
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', usage: 240 },
  { name: 'Tue', usage: 225 },
  { name: 'Wed', usage: 280 },
  { name: 'Thu', usage: 245 },
  { name: 'Fri', usage: 260 },
  { name: 'Sat', usage: 290 },
  { name: 'Sun', usage: 270 },
];

export const ChartCard = () => {
  return (
    <Card className="p-6 glass-panel">
      <h3 className="font-semibold mb-4">Weekly Usage Trend</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
