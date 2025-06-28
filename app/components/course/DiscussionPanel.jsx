import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

export function DiscussionPanel({ 
  comments, // Changed from discussionComments
  commentText, // Changed from discussionComment
  setCommentText, // Changed from setDiscussionComment
  onSubmitComment, // Changed from submitComment
  isSubmitting // Changed from submittingComment
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Add to the Discussion</h3>
        <Textarea
          placeholder="Share your thoughts, questions, or insights..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-2"
          rows={4}
        />
        <Button 
          onClick={onSubmitComment} 
          disabled={isSubmitting || !commentText?.trim()}
        >
          Post Comment
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Discussion ({comments?.length || 0})</h3>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{comment.user.name}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet. Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
}