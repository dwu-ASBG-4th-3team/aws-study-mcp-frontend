import { useState, type FormEvent } from "react";
import "./LoginPage.css";

export default function LoginPage({ onTestSignIn }: { onTestSignIn: () => void }) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (import.meta.env.DEV) {
      const fields = new FormData(event.currentTarget);
      if (fields.get("email") === "000" && fields.get("password") === "000") {
        onTestSignIn();
        return;
      }
      setMessage("테스트 계정의 이메일과 비밀번호를 확인해 주세요.");
      return;
    }

    setMessage("로그인 서비스 연결을 준비 중이에요.");
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <header className="login-header">
          <h1 id="login-title">CLF Note</h1>
          <p>AWS CLF 학습 Q&amp;A 기록</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-fields">
            <input
              aria-label="이메일"
              type={import.meta.env.DEV ? "text" : "email"}
              inputMode="email"
              name="email"
              autoComplete="username"
              placeholder="이메일"
              required
            />
            <input
              aria-label="비밀번호"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              required
            />
          </div>
          <button className="login-submit" type="submit">로그인</button>
        </form>

        <div className="login-actions">
          <a href="?view=signup">회원가입</a>
          <a href="?view=password-reset">비밀번호 찾기</a>
        </div>

        <p className="login-note">MCP 클라이언트 연결 시에도 같은 계정으로 로그인돼요</p>
        <p className="login-status" role="status">{message}</p>
      </section>
    </main>
  );
}
