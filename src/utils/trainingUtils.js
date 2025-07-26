export function filterTrainingByQuizIds(training, quizIds, mode = null) {
  const filteredSets = training.sets
    .map((set) => {
      const filteredResources = (set.resources || []).filter((resource) =>
        quizIds.includes(resource.quizId)
      );

      if (filteredResources.length === 0) return null;

      // If mode === "sections", filter sections within those resources
      if (mode === "sections") {
        filteredResources.forEach((resource) => {
          resource.sections = resource.sections.filter((section) =>
            section.items?.some((item) => item.isAnswerCorrect === false)
          );
        });
      }

      return {
        ...set,
        resources: filteredResources,
      };
    })
    .filter(Boolean);

  return {
    ...training,
    sets: filteredSets,
  };
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
    .filter(Boolean);

  if (filteredSections.length === 0) return null;

  return {
    ...quiz,
    sections: filteredSections,
  };
}

export function filterIncorrectQuestionsOnly(completedTraining) {
  return {
    ...completedTraining,
    id: `TEMP_${Date.now()}`,
    title: `Retry Training - ${completedTraining.title}`,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    lastPerformed: null,
    sets: completedTraining.sets
      .map((set) => ({
        ...set,
        resources: (set.resources || [])
          .map((resource) => ({
            ...resource,
            sections: (resource.sections || [])
              .map((section) => ({
                ...section,
                items: (section.items || []).filter(
                  (item) => item.isAnswerCorrect === false
                ),
              }))
              .filter((section) => section.items.length > 0), // Remove empty sections
          }))
          .filter((resource) => resource.sections.length > 0), // Remove resources with no sections
      }))
      .filter((set) => set.resources.length > 0), // Remove empty sets
  };
}

export function filterIncorrectSections(completedTraining) {
  return {
    ...completedTraining,
    id: `TEMP_${Date.now()}`,
    title: `Retry Training - ${completedTraining.title}`,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    lastPerformed: null,
    sets: completedTraining.sets
      .map((set) => ({
        ...set,
        resources: (set.resources || [])
          .map((resource) => ({
            ...resource,
            sections: (resource.sections || []).filter((section) =>
              // Keep sections that have at least one incorrect answer
              section.items?.some((item) => item.isAnswerCorrect === false)
            ),
          }))
          .filter((resource) => resource.sections.length > 0), // Remove resources with no sections
      }))
      .filter((set) => set.resources.length > 0), // Remove empty sets
  };
}

export function filterIncorrectQuizzes(completedTraining) {
  return {
    ...completedTraining,
    id: `TEMP_${Date.now()}`,
    title: `Retry Training - ${completedTraining.title}`,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    lastPerformed: null,
    sets: completedTraining.sets
      .map(function (set) {
        return {
          ...set,
          resources: (set.resources || []).filter(function (resource) {
            // Keep resources that have at least one incorrect answer in any section
            return resource.sections?.some(function (section) {
              return section.items?.some(function (item) {
                return item.isAnswerCorrect === false;
              });
            });
          }),
        };
      })
      .filter(function (set) {
        return set.resources.length > 0;
      }),
  };
}

export function filterTrainingByQuestionIds(
  completedTraining,
  selectedQuestions
) {
  return {
    ...completedTraining,
    id: `TEMP_${Date.now()}`,
    title: `Retry Training - ${completedTraining.title}`,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    lastPerformed: null,
    sets: completedTraining.sets
      .map(function (set) {
        return {
          ...set,
          resources: (set.resources || [])
            .map(function (resource) {
              return {
                ...resource,
                sections: (resource.sections || [])
                  .map(function (section) {
                    return {
                      ...section,
                      items: (section.items || []).filter(function (item) {
                        // Keep only items that are in selectedQuestions
                        return selectedQuestions.some(function (selectedQ) {
                          return (
                            selectedQ.quizId === resource.quizId &&
                            selectedQ.sectionTitle === section.title &&
                            selectedQ.question === item.question
                          );
                        });
                      }),
                    };
                  })
                  .filter(function (section) {
                    return section.items.length > 0; // Remove empty sections
                  }),
              };
            })
            .filter(function (resource) {
              return resource.sections.length > 0; // Remove empty resources
            }),
        };
      })
      .filter(function (set) {
        return set.resources.length > 0; // Remove empty sets
      }),
  };
}
