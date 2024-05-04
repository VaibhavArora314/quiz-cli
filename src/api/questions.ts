import axios from "axios";
import { Difficulty, Question } from "../types.js";

const fetchQuestions = async (amount: number, categoryid: number, difficulty: Difficulty) => {
    try {
        let apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${categoryid}`;
        if (difficulty != Difficulty.any) apiUrl += `&difficulty=${difficulty}`;

        const response = await axios.get(apiUrl);

        if (response.data?.response_code && response.data?.response_code != 0){
            console.log(response.data?.response_code);
            throw new Error("Invalid response code");
        }

        const questions:Question[] = response.data?.results || [];
        return questions;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export default fetchQuestions