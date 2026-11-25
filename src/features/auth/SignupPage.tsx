import { useState, type FormEvent } from "react";
import "./LoginPage.css";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const mismatch = fields.get("password") !== fields.get("passwordConfirmation");

    setPasswordMismatch(mismatch);
    setMessage(
      mismatch ? "비밀번호가 일치하지 않아요." : "회원가입 서비스 연결을 준비 중이에요.",
    );
  }

  function clearFeedback() {
    setPasswordMismatch(false);
    setMessage("");
  }

  return (
    <main className="login-page signup-page">
      <section className="login-panel" aria-labelledby="signup-title">
        <header className="login-header">
          <h1 id="signup-title">회원가입</h1>
          <p>AWS CLF 학습 Q&amp;A 기록을 시작해요</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} onInput={clearFeedback}>
          <div className="login-fields">
            <input
              aria-label="이메일"
              type="email"
              name="email"
              autoComplete="username"
              placeholder="이메일"
              required
            />
            <div>
              <input
                aria-label="비밀번호"
                aria-describedby="signup-password-hint"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="비밀번호"
                minLength={8}
                required
              />
              <p id="signup-password-hint" className="signup-password-hint">
                8자 이상으로 입력해 주세요
              </p>
            </div>
            <input
              aria-label="비밀번호 확인"
              aria-invalid={passwordMismatch || undefined}
              aria-describedby={passwordMismatch ? "signup-status" : undefined}
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              placeholder="비밀번호 확인"
              required
            />
          </div>
          <button className="login-submit" type="submit">가입하기</button>
          <p id="signup-status" className="login-status" role="status">
            {message}
          </p>
        </form>

        <p className="signup-return">이미 계정이 있나요? <a href="./">로그인</a></p>
      </section>
    </main>
  );
}
