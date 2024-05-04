import axios from "axios";
import { Category } from "../types.js";

const fetchCategory = async () => {
    try {
        const response = await axios.get("https://opentdb.com/api_category.php");
        const categories:Category[] = response.data?.trivia_categories || [];
        return categories;
    } catch {
        return [];
    }
}

export default fetchCategory;