import { useState } from "react";
import Layout from "../../components/Layout";

type Domain = { name: string; confused: number; total: number };

export type DashboardAnalysis = {
  domains: [Domain, ...Domain[]];
  repeatedQuestions: number;
  analyzedAt: string;
};

export default function DashboardPage({
  analysis,
  isSample = false,
}: {
  analysis: DashboardAnalysis | null;
  isSample?: boolean;
}) {
  const [message, setMessage] = useState("");
  const priority = analysis?.domains[0];
  const analysisTime = analysis && new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(analysis.analyzedAt)).replaceAll("-", ".");

  return (
    <Layout page="dashboard">
      <main className="dashboard-content">
        {analysis && priority ? (
          <>
            <section className="dashboard-priority" aria-labelledby="review-domain">
              <p className="dashboard-caption">지금 가장 먼저 복습할 영역</p>
              <h1 id="review-domain">{priority.name}</h1>
              <p className="dashboard-summary">
                질문 {priority.total}회 중 {priority.confused}회 헷갈림, 반복 질문 {analysis.repeatedQuestions}회
              </p>
              <button
                className="dashboard-review"
                type="button"
                onClick={() => setMessage("복습할 질문 목록을 준비 중이에요.")}
              >
                복습 시작
              </button>
              <p className="dashboard-feedback" role="status">{message}</p>
            </section>

            <section className="dashboard-ratios" aria-labelledby="domain-ratios">
              <div className="dashboard-row dashboard-caption">
                <h2 id="domain-ratios">도메인별 헷갈림 비율</h2>
                {isSample && <span>예시 데이터</span>}
              </div>
              <ul className="dashboard-domains">
                {analysis.domains.map((domain) => (
                  <li key={domain.name} className={domain === priority ? "dashboard-domain-priority" : undefined}>
                    <div className="dashboard-row">
                      <span className="dashboard-domain-name">{domain.name}</span>
                      <span className="dashboard-count">헷갈림 {domain.confused} / {domain.total}</span>
                    </div>
                    <div className="dashboard-track" aria-hidden="true">
                      <div style={{ width: `${domain.total ? 100 * domain.confused / domain.total : 0}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <p className="dashboard-updated dashboard-caption">
              마지막 분석 <time dateTime={analysis.analyzedAt}>{analysisTime}</time> 기준
            </p>
          </>
        ) : (
          <>
            <section className="dashboard-priority dashboard-empty" aria-labelledby="empty-dashboard-title">
              <h1 id="empty-dashboard-title">아직 기록이 없어요</h1>
              <p className="dashboard-summary">
                AI에게 질문하거나 MCP로 Q&amp;A를 저장하면 약점 분석이 시작돼요
              </p>
              <div className="dashboard-empty-actions">
                <a className="dashboard-review" href="?view=ask">AI에게 질문하기</a>
                <a className="dashboard-mcp" href="?view=settings#mcp-connection">MCP 연결하기</a>
              </div>
              <p className="dashboard-feedback" role="status">{message}</p>
            </section>
            <div className="dashboard-ratios dashboard-caption">
              분석은 하루 1회 업데이트돼요
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
