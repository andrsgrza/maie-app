export function cleanQuizData(quizData) {
  // Remove 'selected' property from the main object
  if (quizData.hasOwnProperty("selected")) {
    delete quizData.selected;
  }

  // Iterate over sections and items to remove items with isAnswerCorrect true and the properties themselves
  quizData.sections.forEach((section) => {
    section.items = section.items.filter((item) => {
      // Check if isAnswerCorrect is true before deleting it
      const isCorrect = item.isAnswerCorrect;
      delete item.isAnswerCorrect; // Remove the property regardless of its value
      delete item.userAnswer; // Remove userAnswer property regardless of its value

      // Return false to remove the item if isAnswerCorrect was true
      return !isCorrect;
    });
  });

  if (quizData.hasOwnProperty("id")) {
    delete quizData.id;
  }

  return quizData;
}
export function filterQuizByItems(quiz, selectedQuestions) {
  const filteredSections = quiz.sections
    .map((section) => {
      const matchingItems = section.items.filter((item) =>
        selectedQuestions.some(
          (q) =>
            q.quizId === quiz.quizId &&
            q.sectionTitle === section.title &&
            q.question === item.question
        )
      );
      return matchingItems.length > 0
        ? { ...section, items: matchingItems }
        : null;
    })
    .filter(Boolean); // remove nulls

  if (filteredSections.length === 0) return null;

  return {
    ...quiz,
    sections: filteredSections,
  };
}
