import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function WebWidget() {
  const [url, setUrl] = useState('https://example.com');

  const normalizedUrl = (() => {
    try {
      const hasProtocol = /^(https?:)?\/\//i.test(url);
      return hasProtocol ? url : `https://${url}`;
    } catch {
      return url;
    }
  })();

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL (e.g. arlo.ai)"
          className="bg-card text-foreground border-border"
        />
        <Button asChild>
          <a href={normalizedUrl} target="_blank" rel="noreferrer noopener" aria-label="Open website">
            <ExternalLink className="h-4 w-4 mr-2" /> Open
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Preview coming soon. For now, open links in a new tab.</p>
    </div>
  );
}
