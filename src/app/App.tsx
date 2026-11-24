import { useState } from "react";
import LoginPage from "../features/auth/LoginPage";
import PasswordResetPage from "../features/auth/PasswordResetPage";
import SignupPage from "../features/auth/SignupPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import RecordsPage from "../features/records/RecordsPage";
import AskPage from "../features/ask/AskPage";
import SettingsPage from "../features/settings/SettingsPage";
import { sampleAnalysis } from "../features/dashboard/sampleAnalysis";

export default function App() {
  const [testSignedIn, setTestSignedIn] = useState(
    () => import.meta.env.DEV && sessionStorage.getItem("clf-note:test-session") === "active",
  );
  const searchParams = new URLSearchParams(window.location.search);
  const view = searchParams.get("view");

  function signInForTesting() {
    if (import.meta.env.DEV) {
      sessionStorage.setItem("clf-note:test-session", "active");
      setTestSignedIn(true);
    }
  }

  if (view === "signup") {
    return <SignupPage />;
  }

  if (view === "password-reset") {
    return <PasswordResetPage />;
  }

  if (testSignedIn) {
    if (view === "settings") {
      return <SettingsPage onSignOut={() => {
        sessionStorage.removeItem("clf-note:test-session");
        window.location.replace("./");
      }} />;
    }

    if (view === "ask") {
      return <AskPage />;
    }

    if (view === "records" || view === "record") {
      return <RecordsPage recordId={view === "record" ? searchParams.get("id") ?? "iam-role-policy" : null} />;
    }

    const showSample = import.meta.env.DEV && searchParams.get("preview") === "sample";
    return <DashboardPage analysis={showSample ? sampleAnalysis : null} isSample={showSample} />;
  }

  return <LoginPage onTestSignIn={signInForTesting} />;
}
