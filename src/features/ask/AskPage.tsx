import { useEffect, useRef, useState, type FormEvent } from "react";
import Layout from "../../components/Layout";
import { recordStorageKey, sampleRecords } from "../records/sampleRecords";
import "./AskPage.css";

const feedbackOptions = ["이해함", "헷갈림", "오류 의심"] as const;
const storageKey = "clf-note:ask-sessions";
const maxQuestionLength = 2_000;

type Turn = {
  question: string;
  recordId?: string;
  feedback?: (typeof feedbackOptions)[number];
};
type Session = { id: string; title: string; updatedAt: number; turns: Turn[] };

function newSession(): Session {
  return { id: crypto.randomUUID(), title: "새 세션", updatedAt: Date.now(), turns: [] };
}

function loadSessions(): Session[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null") as Session[] | null;
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    // Start a fresh session if saved data cannot be read.
  }
  return [newSession()];
}

function normalizeQuestion(question: string) {
  return question.replace(/[\s?？]+/g, "").toLowerCase();
}

export default function AskPage() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(() => sessions[0].id);
  const [draft, setDraft] = useState("");
  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [pending, setPending] = useState<{ sessionId: string; question: string } | null>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const session = sessions.find((item) => item.id === activeId)!;
  const activePending = pending?.sessionId === activeId ? pending : null;
  const empty = !session.turns.length && !activePending;
  const question = draft.trim();
  const questionTooLong = question.length > maxQuestionLength;
  const canSubmit = !pending && question.length > 0 && !questionTooLong;

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!pending) return;

    const timer = window.setTimeout(() => {
      const record = sampleRecords.find((item) => normalizeQuestion(item.title) === normalizeQuestion(pending.question));
      setSessions((items) => items.map((item) => item.id === pending.sessionId
        ? {
          ...item,
          title: item.title === "새 세션" ? pending.question : item.title,
          updatedAt: Date.now(),
          turns: [...item.turns, { question: pending.question, recordId: record?.id }],
        }
        : item));
      setPending(null);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [pending]);

  useEffect(() => {
    const panel = conversation.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [activeId, activePending, session.turns.length]);

  function selectSession(id: string) {
    setActiveId(id);
    setDraft("");
    setTitleDraft(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setPending({ sessionId: activeId, question });
    setDraft("");
  }

  function renameSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = titleDraft?.trim();
    if (title) {
      setSessions((items) => items.map((item) => item.id === activeId ? { ...item, title } : item));
    }
    setTitleDraft(null);
  }

  const orderedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Layout page="ask">
      <main className="ask-content">
        <aside className="ask-sidebar" aria-label="질문 세션">
          <button className="ask-primary ask-new" type="button" onClick={() => {
            const item = newSession();
            setSessions((items) => [item, ...items]);
            selectSession(item.id);
          }}>+ 새 세션</button>
          <div className="ask-session-list">
            {orderedSessions.map((item) => (
              <button className="ask-session" type="button" key={item.id}
                aria-current={item.id === activeId ? "true" : undefined}
                onClick={() => selectSession(item.id)}>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="ask-panel" aria-label="현재 질문 세션">
          <header className="ask-session-header">
            {titleDraft === null ? (
              <>
                <h1>{session.title}</h1>
                <button type="button" onClick={() => setTitleDraft(session.title)}>이름 변경</button>
              </>
            ) : (
              <form onSubmit={renameSession}>
                <input aria-label="세션 이름" autoFocus value={titleDraft} maxLength={120}
                  onChange={(event) => setTitleDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setTitleDraft(null);
                  }} />
                <button type="submit" disabled={!titleDraft.trim()}>저장</button>
                <button type="button" onClick={() => setTitleDraft(null)}>취소</button>
              </form>
            )}
          </header>

          <div className="ask-conversation" ref={conversation}>
            {empty && (
              <div className="ask-empty">
                <h2>무엇이 궁금한가요?</h2>
                <p>AWS CLF 개념을 질문하면 이 세션에 이어서 저장돼요</p>
              </div>
            )}
            {session.turns.map((turn, index) => {
              const record = sampleRecords.find((item) => item.id === turn.recordId);
              const reference = record && sessionStorage.getItem(recordStorageKey(record, "deleted")) !== "true"
                ? record
                : null;
              const related = record?.id === sampleRecords[0].id ? record.related?.[0] : undefined;
              const referenceCount = Number(Boolean(reference)) + Number(Boolean(related));
              const showFeedback = index === session.turns.length - 1 && !activePending;

              return (
                <article className="ask-turn" key={index}>
                  <p className="ask-question">{turn.question}</p>
                  {record ? (
                    <>
                      <div className="ask-answer-text" aria-live="polite">
                        {record.answers.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                      <details className="ask-references">
                        <summary>참고한 기록 {referenceCount}개{turn.feedback && !showFeedback && ` · 이해도: ${turn.feedback}`}</summary>
                        {referenceCount ? (
                          <ul>
                            {reference && <li><a href={`?view=record&id=${reference.id}`}>{reference.title}</a></li>}
                            {related && <li>{related.title}</li>}
                          </ul>
                        ) : <p>참고할 기록이 없어요.</p>}
                      </details>
                      {showFeedback && (
                        <div className="ask-feedback" role="group" aria-label="답변 이해도">
                          {feedbackOptions.map((option) => (
                            <button key={option} type="button" aria-pressed={turn.feedback === option}
                              onClick={() => setSessions((items) => items.map((item) => item.id === activeId
                                ? { ...item, turns: item.turns.map((entry, position) => position === index
                                  ? { ...entry, feedback: option }
                                  : entry) }
                                : item))}>{option}</button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="ask-status" role="status">
                      AI 연동 전에는 예시 질문에만 답변할 수 있어요. ‘{sampleRecords[0].title}’을 입력해 보세요.
                    </p>
                  )}
                </article>
              );
            })}
            {activePending && (
              <article className="ask-turn ask-turn-pending">
                <p className="ask-question">{activePending.question}</p>
                <p className="ask-status" role="status">답변을 만드는 중이에요</p>
                <div className="ask-answer-placeholder" aria-hidden="true">
                  <span /><span /><span />
                </div>
              </article>
            )}
          </div>

          <form className="ask-form" data-loading={Boolean(pending)} onSubmit={handleSubmit}>
            <textarea
              aria-label="AWS CLF 질문"
              aria-invalid={questionTooLong || undefined}
              aria-describedby={questionTooLong ? "ask-question-error" : undefined}
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={pending ? "답변이 끝나면 이어서 질문할 수 있어요" : empty ? "AWS CLF에 대해 질문해 보세요" : "이어서 질문해 보세요"}
              disabled={Boolean(pending)}
            />
            {activePending ? (
              <button className="ask-stop" type="button" onClick={() => {
                setDraft(activePending.question);
                setPending(null);
              }}>중지</button>
            ) : (
              <button className="ask-primary" type="submit" disabled={!canSubmit}>전송</button>
            )}
          </form>
          {questionTooLong && (
            <p className="ask-question-error" id="ask-question-error" role="alert">
              질문은 최대 {maxQuestionLength.toLocaleString("ko-KR")}자까지 입력할 수 있어요.
            </p>
          )}
          <p className="ask-save-note">질문과 답변은 이 세션에 자동으로 저장돼요</p>
        </section>
      </main>
    </Layout>
  );
}
