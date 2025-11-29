// src/components/Quiz/QuizPlayPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import * as quizApi from '../../services/quizApi'
import { quizService } from '../../services/quizService'
import { submitAttempt } from '../../services/attemptApi'
import Card from '../common/Card'
import Button from '../common/Button'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import QuizResult from './QuizResult'
import { progressService } from "../../services/progressService";

export default function QuizPlayPage() {
  // const { quizId } = useParams()
  // const { state } = useLocation()
  const params = useParams()
const location = useLocation()
const { state } = location

// Resolve quizId from multiple sources safely
const resolvedQuizId =
  params.quizId ||          // /quiz/play/:quizId
  params.id ||              // /quiz/play/:id  (your route might use :id)
  state?.quizId ||          // fallback from navigate()
  null

  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [quizMeta, setQuizMeta] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submittedResult, setSubmittedResult] = useState(null)
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false)

  const readOnly = state?.readOnly || user?.role === 'INSTRUCTOR'


  useEffect(() => {
  load()
  // eslint-disable-next-line
}, [resolvedQuizId])

  const load = async () => {
  setLoading(true)
  try {
    if (!resolvedQuizId) {
      toast.error("Invalid quiz reference")
      navigate(-1)
      return
    }

    const q = await quizService.getQuizById(resolvedQuizId)
    setQuizMeta(q)

    const qlist = await quizService.getQuestionsByQuiz(resolvedQuizId)
    setQuestions(qlist || [])

  } catch (err) {
    console.error(err)
    toast.error('Failed to load quiz')
  } finally {
    setLoading(false)
  }
}


  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }



const handleSubmit = async () => {
  if (readOnly) return;
  setSubmitting(true);

  try {
    const formatted = Object.entries(answers).map(([qid, ans]) => ({
      questionId: Number(qid),
      answerText: ans.trim()
    }));

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const topicId = state?.topicId || quizMeta?.topic?.id;
    console.log("🔥 QUIZ PAGE topicId =", state?.topicId);


    if (!topicId) {
      console.error("❌ ERROR: No topicId found for quiz");
    }

    const payload = {
      studentId: user.studentId,
      topicId: topicId,
      timeSpent,
      answers: formatted
    };

    // 1️⃣ Submit quiz attempt
    const res = await submitAttempt(resolvedQuizId, payload);
    setSubmittedResult(res);

    // 2️⃣ Mark topic as completed (NEW)
    if (topicId) {
      try {
        await progressService.markTopicComplete(user.studentId, topicId);
        console.log("✔️ Topic marked complete:", topicId);
      } catch (err) {
        console.error("❌ Failed to mark topic complete", err);
      }
    }

  } catch (err) {
    console.error(err);
    toast.error("Submit failed");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) return <Loader />

  if (submittedResult) {
    return <QuizResult result={submittedResult} />
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{quizMeta?.title || 'Quiz'}</h2>
            <p className="text-sm text-gray-600 mt-1">{quizMeta?.topic?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{questions.length} questions</p>
            {readOnly && <p className="text-xs text-gray-400">Read-only view</p>}
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 border rounded bg-white">
              <p className="font-semibold">{idx + 1}. {q.questionText}</p>
              <div className="mt-2 space-y-2">
                {q.answers.map((opt) => (
                  <label key={opt.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt.optionText}
                      checked={answers[q.id] === opt.optionText}
                      onChange={() => handleSelect(q.id, opt.optionText)}
                      disabled={readOnly}
                    />
                    <span>{opt.optionText}</span>
                  </label>
                ))}
              </div>
              {!readOnly && q.explanation && (
                <div className="mt-2 text-sm text-gray-500">Hint: {q.explanation}</div>
              )}
              {readOnly && q.correctAnswer && (
                <div className="mt-2 text-sm text-green-700">Correct: {q.correctAnswer}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end space-x-3">
          <Button onClick={() => navigate(-1)} variant="secondary">Back</Button>
          {!readOnly && (
            <Button onClick={handleSubmit} variant="primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
