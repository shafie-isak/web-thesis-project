import Exam from "../models/mock_exam.js";

export const addExam = async(req, res) => {
    try {
        const {userId, questionId, answer, isCorrect, points} = req.body;
        if(!answer) {
            return res.status(400).json({message: "Pick Up answer"});

        }

        const newExam = new Exam ({
            userId,
            questionId,
            answer,
            isCorrect,
            points
        });

        await newExam.save();
        return res.status(201).json({success: true, message: "exam added successfully!"});

    } catch (error) {
        console.log("error adding quiz: ", error.message);
        return res.status(401).json({message: error.message});
    }
}

export const getUserExam = async(req, res) => {
    try {
        const { userId } = req.params;

    const exams = await Exam.find({ userId }).populate('questionsId', 'subject createdAt').sort('createdAt: -1');
    if (!exams.length)
        return res.status(404).json({message: "No exams found"});
    const examSummary = exams.reduce((acc, quiz) => {
        const subj = `${quiz.questionId.subject}`;

        if(!acc[subj]) {
            acc[subj] = {
                subject: quiz.questionId.subject,
                date: quiz.createdAt,
                totalQuestions: 0,
                correctAnswers: 0
            }
            acc[subj].totalQuestions += 1;
            if(quiz.isCorrect) acc[subj].correctAnswers += 1;
            
            return acc;
        }
    }, {})

    const listOfexams = Object.values(examSummary).map(quiz => ({
        subject: quiz.subject,
        date: quiz.date,
        score: `${quiz.correctAnswers}/${quiz.totalQuestions}`
    }));

    return res.status(200).json(listOfexams);
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("error gettng exams: ", error.message);
    }
    
}