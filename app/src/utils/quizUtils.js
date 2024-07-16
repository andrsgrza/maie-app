export function cleanQuizData(quizData) {
    // Remove 'selected' property from the main object
    if (quizData.hasOwnProperty('selected')) {
      delete quizData.selected;
    }
  
    // Iterate over sections and items to remove 'userAnswer'
    quizData.sections.forEach(section => {
      section.items.forEach(item => {
        if (item.hasOwnProperty('userAnswer')) {
          delete item.userAnswer;
        }
      });
    });
  
    return quizData;
  }