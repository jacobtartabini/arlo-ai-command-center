import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function NotesWidget() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write a quick note..."
        className="min-h-[120px] bg-card text-foreground border-border"
      />
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setSaved(note)}
        >
          Save
        </Button>
        {saved && (
          <span className="text-xs text-muted-foreground">Saved {new Date().toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
}
