import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

export function NotesPanel({ notes, setNotes, saveNotes, savingNotes }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">My Notes</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={saveNotes}
          disabled={savingNotes}
        >
          {savingNotes ? "Saving..." : "Save Notes"}
        </Button>
      </div>
      <Textarea
        placeholder="Take notes on this lesson here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[200px]"
      />
    </div>
  );
}