import DOMPurify from "dompurify";

export function LessonDescription({ currentLesson }) {
  return (
    <div className="prose mb-6">
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            currentLesson?.description || "No description available for this lesson."
          ),
        }}
      />
    </div>
  );
}
