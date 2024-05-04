#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import fetchCategory from "./api/category.js";
import fetchQuestions from "./api/questions.js";
import { Difficulty } from "./types.js";
import he from "he";

const DEFAULT_AMOUNT = 10;

const playGame = async () => {
  const spinner = ora("Getting list of categories...").start();
  const categories = await fetchCategory();
  spinner.stop();

  if (categories.length == 0) {
    console.log(
      chalk.redBright(
        `An unexpeected error occurred! Check your internet connection.`
      )
    );
    return;
  }

  const categoryPrompt = await inquirer.prompt([
    {
      type: "list",
      name: "value",
      message: "Select a category",
      choices: categories.sort((a, b) =>
        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
      ),
      loop: false,
    },
  ]);

  const difficultyPrompt = await inquirer.prompt([
    {
      type: "list",
      name: "value",
      message: "Select a difficulty level",
      choices: [
        Difficulty.any,
        Difficulty.easy,
        Difficulty.medium,
        Difficulty.hard,
      ],
      loop: false,
    },
  ]);

  const selectedCategory = categories.find((c) => {
      return c.name == categoryPrompt.value;
    }),
    selectedDifficulty = difficultyPrompt.value;

  if (!selectedCategory || !selectedDifficulty) {
    console.log(chalk.redBright(`An unexpeected error occurred!`));
    return;
  }

  const questions = await fetchQuestions(
    DEFAULT_AMOUNT,
    selectedCategory.id,
    selectedDifficulty
  );

  if (!questions || questions.length < DEFAULT_AMOUNT) {
    console.log(
      chalk.redBright(
        `An unexpeected error occurred! Check your internet connection.`
      )
    );
    return;
  }

  let score = 0;
  for (let q of questions) {
    const correct_answer = he.decode(q.correct_answer).trim();
    const options = [...q.incorrect_answers, correct_answer]
      .map((ans) => he.decode(ans).trim())
      .sort();
    const questionPrompt = await inquirer.prompt([
      {
        type: "list",
        name: "answer",
        message: he.decode(q.question).trim(),
        choices: options,
        loop: false,
      },
    ]);

    if (questionPrompt.answer == correct_answer) score++;
  }

  console.log(chalk.greenBright(`You got a ${score}/${DEFAULT_AMOUNT}`));
};

playGame();
