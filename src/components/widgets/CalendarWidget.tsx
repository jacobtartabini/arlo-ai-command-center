import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section aria-label="Calendar" className="space-y-3 animate-fade-in">
      <div className="text-sm text-muted-foreground">Select a date</div>
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-2 shadow-sm hover:shadow-glow transition-shadow">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </div>
    </section>
  );
}
