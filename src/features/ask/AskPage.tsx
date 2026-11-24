import { useEffect, useState, type FormEvent } from "react";
import Layout from "../../components/Layout";
import { recordStorageKey, sampleRecords, type SampleRecord } from "../records/sampleRecords";
import "./AskPage.css";

const feedbackOptions = ["이해함", "헷갈림", "오류 의심"] as const;

type AnswerState =
  | { status: "idle" }
  | { status: "loading"; question: string }
  | { status: "ready"; record: SampleRecord }
  | { status: "unavailable" };

function normalizeQuestion(question: string) {
  return question.replace(/[\s?？]+/g, "").toLowerCase();
}

export default function AskPage() {
  const [answer, setAnswer] = useState<AnswerState>({ status: "idle" });
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<(typeof feedbackOptions)[number]>("헷갈림");
  const loading = answer.status === "loading";

  useEffect(() => {
    if (answer.status !== "loading") return;

    // Keep the loading state visible in the local preview until an API is connected.
    const timer = window.setTimeout(() => {
      const question = normalizeQuestion(answer.question);
      const record = sampleRecords.find((item) => normalizeQuestion(item.title) === question);
      setAnswer(record ? { status: "ready", record } : { status: "unavailable" });
    }, 650);

    return () => window.clearTimeout(timer);
  }, [answer]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const question = new FormData(event.currentTarget).get("question");
    if (typeof question !== "string" || !question.trim()) {
      setMessage("질문을 입력해 주세요.");
      return;
    }

    setMessage("");
    setFeedback("헷갈림");
    setAnswer({ status: "loading", question });
  }

  const record = answer.status === "ready" ? answer.record : null;
  const reference = record && sessionStorage.getItem(recordStorageKey(record, "deleted")) !== "true"
    ? record
    : null;
  const iamRelated = record?.id === sampleRecords[0].id ? record.related?.[0] : undefined;

  return (
    <Layout page="ask">
      <main className="ask-content">
        <form className="ask-form" onSubmit={handleSubmit} onInput={() => setMessage("")}>
          <textarea
            name="question"
            aria-label="AWS CLF 질문"
            placeholder="AWS CLF에 대해 질문해 보세요"
            readOnly={loading}
            required
          />
          <button className="dashboard-review" type="submit" disabled={loading}>질문하기</button>
          <p className="ask-message dashboard-caption" role="status">
            {message || (loading ? "답변을 준비하고 있어요." : "")}
          </p>
        </form>

        {answer.status !== "idle" && (
          <section className="ask-answer" aria-labelledby="ask-answer-title" aria-busy={loading}>
            <h1 id="ask-answer-title" className="dashboard-caption">답변</h1>
            {loading && (
              <div className="ask-answer-placeholder" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
            {record && (
              <div className="ask-answer-text" aria-live="polite">
                {record.answers.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            )}
            {answer.status === "unavailable" && (
              <p className="dashboard-caption" role="status">
                AI 연동 전에는 예시 질문에만 답변할 수 있어요. ‘{sampleRecords[0].title}’을 입력해 보세요.
              </p>
            )}
          </section>
        )}

        {record && (
          <>
            <section className="ask-references" aria-labelledby="ask-references-title">
              <h2 id="ask-references-title" className="dashboard-caption">참고한 과거 기록</h2>
              {reference || iamRelated ? (
                <ul>
                  {reference && (
                    <li>
                      <a href={`?view=record&id=${reference.id}`}>{reference.title}</a>
                      <span>출처: 외부 AI · 검증: 미확인</span>
                    </li>
                  )}
                  {iamRelated && (
                    <li>
                      {iamRelated.title}
                      <span>출처: 사용자 작성 · 검증: 확인됨</span>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="dashboard-caption">참고할 기록이 없어요.</p>
              )}
            </section>

            <div className="ask-footer">
              <div className="ask-feedback" role="group" aria-label="답변 이해도 미리보기">
                {feedbackOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={feedback === option}
                    onClick={() => setFeedback(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p>AI 연동 후 질문과 답변은 자동으로 저장돼요</p>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
