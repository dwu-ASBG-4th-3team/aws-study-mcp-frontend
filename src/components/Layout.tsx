import type { ReactNode } from "react";
import "../features/dashboard/DashboardPage.css";

export default function Layout({
  page,
  children,
}: {
  page: "dashboard" | "records" | "ask" | "settings";
  children: ReactNode;
}) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="./">CLF Note</a>
        <nav className="dashboard-nav" aria-label="주 메뉴">
          <a href="./" aria-current={page === "dashboard" ? "page" : undefined}>대시보드</a>
          <a href="?view=records" aria-current={page === "records" ? "page" : undefined}>내 기록</a>
          <a href="?view=ask" aria-current={page === "ask" ? "page" : undefined}>AI 질문</a>
          <a href="?view=settings" aria-current={page === "settings" ? "page" : undefined}>설정</a>
        </nav>
      </header>
      {children}
    </div>
  );
}
