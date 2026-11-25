import { useState } from "react";
import Layout from "../../components/Layout";
import "./RecordsPage.css";

import { recordCategories, recordStorageKey, sampleRecords, type SampleRecord } from "./sampleRecords";

const feedbackOptions = ["이해함", "헷갈림", "오류 의심"] as const;

export default function RecordsPage({ recordId }: { recordId: string | null }) {
  const [category, setCategory] = useState<(typeof recordCategories)[number]>("전체");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState(() =>
    sampleRecords.filter((record) => sessionStorage.getItem(recordStorageKey(record, "deleted")) !== "true"),
  );
  const [feedback, setFeedback] = useState(() => new Map(sampleRecords.map((record, index) => [
    record.id,
    sessionStorage.getItem(recordStorageKey(record, "feedback")) ?? (index === 0 ? "헷갈림" : null),
  ])));
  const record = records.find(({ id }) => id === recordId);
  const visibleRecords = records.filter(({ category: recordCategory, title }) =>
    (category === "전체" || recordCategory === category)
      && title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function updateFeedback(record: SampleRecord, option: string) {
    sessionStorage.setItem(recordStorageKey(record, "feedback"), option);
    setFeedback((previous) => new Map(previous).set(record.id, option));
  }

  function deleteSample(target: SampleRecord) {
    if (window.confirm("이 예시 기록을 삭제할까요?")) {
      sessionStorage.setItem(recordStorageKey(target, "deleted"), "true");
      sessionStorage.removeItem(recordStorageKey(target, "feedback"));
      setRecords((previous) => previous.filter(({ id }) => id !== target.id));
      if (record?.id === target.id) {
        window.location.replace("?view=records");
      }
    }
  }

  return (
    <Layout page="records">
      <main className="records-content">
        {record ? (
          <article>
            <a className="records-back" href="?view=records">← 목록으로</a>
            <ul className="record-tags" aria-label="기록 정보">
              {[record.domain, "출처: 외부 AI", "검증: 미확인", record.status].map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <h1>{record.title}</h1>
            <div className="record-answer">
              {record.answers.map((answer) => <p key={answer}>{answer}</p>)}
            </div>
            {record.source && (
              <p className="record-source">출처 <a href={record.source}>{record.source}</a></p>
            )}

            <section className="record-feedback" aria-labelledby="record-feedback-title">
              <h2 id="record-feedback-title">이 답변 이해도</h2>
              <div className="record-feedback-options">
                {feedbackOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={feedback.get(record.id) === option}
                    onClick={() => updateFeedback(record, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            {record.related && (
              <section className="record-related" aria-labelledby="record-related-title">
                <h2 id="record-related-title">비슷한 과거 질문</h2>
                <ul>
                  {record.related.map(({ title, similarity }) => (
                    <li key={title}>
                      <span>{title}</span>
                      <span className="record-similarity">유사도 {similarity}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <button className="record-delete" type="button" onClick={() => deleteSample(record)}>이 기록 삭제</button>
          </article>
        ) : (
          <section className="records-list" aria-label="내 기록">
            <input
              className="records-search"
              type="search"
              aria-label="질문 검색"
              placeholder="질문 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="records-filters" role="group" aria-label="도메인 필터">
              {recordCategories.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={category === option}
                  onClick={() => setCategory(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <ul className="records-rows">
              {visibleRecords.map((item) => (
                <li key={item.id} className="records-row">
                  <a href={`?view=record&id=${item.id}`}>
                    <span>{item.title}</span>
                    <small>{item.domain} · {item.status}</small>
                  </a>
                  <div className="records-row-actions" role="group" aria-label={item.title}>
                    {feedbackOptions.slice(0, 2).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={feedback.get(item.id) === option}
                        onClick={() => updateFeedback(item, option)}
                      >
                        {option}
                      </button>
                    ))}
                    <button type="button" onClick={() => deleteSample(item)}>삭제</button>
                  </div>
                </li>
              ))}
            </ul>
            {visibleRecords.length === 0 && (
              <p className="dashboard-caption">
                {records.length === 0 ? "아직 기록이 없어요." : "조건에 맞는 질문이 없어요."}
              </p>
            )}
          </section>
        )}
      </main>
    </Layout>
  );
}
