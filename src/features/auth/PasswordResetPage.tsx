import { useState, type FormEvent } from "react";
import "./LoginPage.css";

export default function PasswordResetPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("인증 코드 발송 기능을 준비 중이에요.");
  }

  return (
    <main className="login-page password-reset-page">
      <section className="login-panel" aria-labelledby="password-reset-title">
        <header className="login-header">
          <h1 id="password-reset-title">비밀번호 찾기</h1>
          <p>가입한 이메일로 인증 코드를 보내드려요</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} onInput={() => setMessage("")}>
          <div className="login-fields">
            <input
              aria-label="이메일"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="이메일"
              required
            />
          </div>
          <button className="login-submit" type="submit">인증 코드 받기</button>
          <p className="login-status" role="status">{message}</p>
        </form>

        <a className="password-reset-return" href="./">← 로그인으로</a>
      </section>
    </main>
  );
}
