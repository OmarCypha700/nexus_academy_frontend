export function LessonDescription({ currentLesson }) {
    return (
      <div className="prose">
        <p>{currentLesson.description}</p>
        {currentLesson.learning_objectives && (
          <>
            <h3>What You'll Learn</h3>
            <ul>
              {currentLesson.learning_objectives.map((objective, idx) => (
                <li key={idx}>{objective}</li>
              ))}
            </ul>
          </>
        )}
        {!currentLesson.learning_objectives && (
          <>
            <h3>What You'll Learn</h3>
            <ul>
              <li>Key concepts covered in this lesson</li>
              <li>Practical applications of the material</li>
              <li>How this connects to the overall course</li>
            </ul>
          </>
        )}
        <h3>Prerequisites</h3>
        <p>
          To get the most out of this lesson, you should already
          be familiar with the concepts covered in previous
          modules.
        </p>
      </div>
    );
  }