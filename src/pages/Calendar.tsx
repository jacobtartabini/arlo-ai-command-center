import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function CalendarPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    document.title = "Calendar – Arlo AI";
  }, []);

  return (
    <main className="min-h-screen pt-20 pb-12 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Calendar</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <CalendarComponent
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md"
            />
          </Card>
          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm text-foreground">Team Meeting</div>
                <div className="text-xs text-muted-foreground">Today, 2:00 PM</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm text-foreground">Project Review</div>
                <div className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm text-foreground">Client Call</div>
                <div className="text-xs text-muted-foreground">Friday, 3:30 PM</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
