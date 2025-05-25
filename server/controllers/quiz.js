import Quiz from "../models/quiz.js";
import Question from "../models/questions.js";
import Subject from "../models/subjects.js";
import Chapter from "../models/chapters.js";

export const addQuiz = async (req, res) => {
    try {
        const { userId, questionId, answer, isCorrect, points } = req.body;
        if (!answer) {
            return res.status(400).json({ message: "Pick Up answer" });

        }

        const newQuiz = new Quiz({
            userId,
            questionId,
            answer,
            isCorrect,
            points
        });

        await newQuiz.save();
        return res.status(201).json({ success: true, message: "quiz added successfully!" });

    } catch (error) {
        console.log("error adding quiz: ", error.message);
        return res.status(401).json({ message: error.message });
    }
}

export const getUserQuiz = async (req, res) => {
    try {
        const { userId } = req.params;

        const quizzes = await Quiz.find({ userId }).populate('questionsId', 'subject chapter createdAt').sort('createdAt: -1');
        if (!quizzes.length)
            return res.status(404).json({ message: "No quizzes found" });
        const quizSummary = quizzes.reduce((acc, quiz) => {
            const chapSubj = `${quiz.questionId.subject} - chapter${quiz.questionId.chapter}`;

            if (!acc[chapSubj]) {
                acc[chapSubj] = {
                    subject: quiz.questionId.subject,
                    chapter: quiz.questionId.chapter,
                    date: quiz.createdAt,
                    totalQuestions: 0,
                    correctAnswers: 0
                }
                acc[chapSubj].totalQuestions += 1;
                if (quiz.isCorrect) acc[chapSubj].correctAnswers += 1;

                return acc;
            }
        }, {})

        const listOfQuizzes = Object.values(quizSummary).map(quiz => ({
            subject: quiz.subject,
            chapter: quiz.chapter,
            date: quiz.date,
            score: `${quiz.correctAnswers}/${quiz.totalQuestions}`
        }));

        return res.status(200).json(listOfQuizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error gettng quizzes: ", error.message);
    }

}

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).json({ subjects });
    } catch (error) {
        console.log("error getting subjects: ", error.message);
        return res.status(401).json({ message: error.message });
    }
}

export const getChapters = async (req, res) => {
    const { subject_id } = req.params;
    if (!subject_id) return res.status(400).json({ message: "Please provide subject id" });
    try {
        const chapters = await Chapter.find({ subject_id });
        if (chapters.length === 0)
            return res.status(404).json({ message: "No chapters found" });
        return res.status(200).json({ chapters });
    } catch (error) {
        console.log("error getting chapters: ", error.message);
        return res.status(401).json({ message: error.message });
    }
}

export const getQuestions = async (req, res) => {
    const { chapter_id, difficulty_level } = req.query;
    try {
        const questions = await Question.find({ chapter_id, difficulty_level });
        if (questions.length === 0)
            return res.status(404).json({ message: "No questions found" });
        return res.status(200).json({ questions });
    } catch (error) {
        console.log("error getting questions: ", error.message);
        return res.status(500).json({ message: error.message });
    }
}


// Save completed quiz preview
export const saveQuizPreview = async (req, res) => {
    try {

        const { title, questions, score, total, timeTaken } = req.body;
        const userId = req.user.id; // 👈 Extracted securely


        const newQuiz = new Quiz({
            userId,
            title,
            questions,
            score,
            total,
            timeTaken
        });

        await newQuiz.save();
        return res.status(201).json({ message: "Quiz saved successfully" });
    } catch (error) {
        console.log("Error saving quiz preview: ", error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Get saved quizzes for a user
export const getSavedQuizzes = async (req, res) => {

    try {
        const quizzes = await Quiz.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(quizzes);
    } catch (error) {
        console.log("Error getting saved quizzes: ", error.message);
        res.status(500).json({ message: error.message });
    }
};
