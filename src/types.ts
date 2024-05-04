interface Category {
  id: number;
  name: string;
}

enum Difficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
  any = "any",
}

interface Question {
  type: string;
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export { Category, Difficulty, Question };
