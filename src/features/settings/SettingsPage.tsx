import { useState } from "react";
import Layout from "../../components/Layout";
import { recordStorageKey, sampleRecords } from "../records/sampleRecords";
import { createRecordsImage } from "./createRecordsImage";
import "./SettingsPage.css";

const configuredMcpUrl = import.meta.env.VITE_MCP_URL?.trim();
const mcpUrl = configuredMcpUrl || new URL("/mcp", window.location.origin).href;

export default function SettingsPage({ onSignOut }: { onSignOut: () => void }) {
  const [copyMessage, setCopyMessage] = useState("");
  const [dataMessage, setDataMessage] = useState("");

  function availableRecords() {
    return sampleRecords.filter((record) => sessionStorage.getItem(recordStorageKey(record, "deleted")) !== "true");
  }

  async function copyMcpUrl() {
    try {
      await navigator.clipboard.writeText(mcpUrl);
      setCopyMessage("MCP 주소를 복사했어요.");
    } catch {
      setCopyMessage("복사할 수 없어요. 표시된 주소를 직접 복사해 주세요.");
    }
  }

  async function exportRecords() {
    const records = availableRecords().map((record) => ({
      ...record,
      feedback: sessionStorage.getItem(recordStorageKey(record, "feedback"))
        ?? (record === sampleRecords[0] ? "헷갈림" : null),
    }));
    if (!records.length) {
      setDataMessage("내보낼 기록이 없어요.");
      return;
    }

    try {
      const file = await createRecordsImage(records);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "clf-note-records.png";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDataMessage("기록 이미지 다운로드를 시작했어요.");
    } catch {
      setDataMessage("기록 이미지를 만들지 못했어요. 다시 시도해 주세요.");
    }
  }

  function deleteAllRecords() {
    const records = availableRecords();
    if (!records.length) {
      setDataMessage("삭제할 기록이 없어요.");
      return;
    }

    if (!window.confirm("이 탭의 예시 기록을 모두 삭제할까요?")) return;

    for (const record of records) {
      sessionStorage.setItem(recordStorageKey(record, "deleted"), "true");
      sessionStorage.removeItem(recordStorageKey(record, "feedback"));
    }
    setDataMessage("예시 기록을 모두 삭제했어요.");
  }

  return (
    <Layout page="settings">
      <main className="settings-content">
        <h1>설정</h1>

        <section className="settings-section" aria-labelledby="account-title">
          <h2 id="account-title">계정</h2>
          <div className="settings-row settings-account">
            <dl>
              <dt>이메일</dt>
              <dd>000</dd>
            </dl>
            <button type="button" onClick={onSignOut}>로그아웃</button>
          </div>
        </section>

        <section id="mcp-connection" className="settings-section" aria-labelledby="mcp-title">
          <h2 id="mcp-title">MCP 연결</h2>
          <p className="settings-description">
            {configuredMcpUrl
              ? "Claude, Cursor 등 MCP 클라이언트에 이 주소를 등록하세요"
              : "Claude, Cursor 등 MCP 클라이언트에 등록할 주소 예시예요"}
          </p>
          <div className="settings-address">
            <span>{mcpUrl}</span>
            <button type="button" onClick={copyMcpUrl}>복사</button>
          </div>
          <p className="settings-status" role="status">{copyMessage}</p>
        </section>

        <section className="settings-section" aria-labelledby="data-title">
          <h2 id="data-title">내 데이터</h2>
          <div className="settings-row">
            <div>
              <h3>기록 내보내기</h3>
              <p>내 Q&amp;A를 PNG 이미지로 저장해요</p>
            </div>
            <button type="button" onClick={exportRecords}>내보내기</button>
          </div>
          <div className="settings-row">
            <div>
              <h3>전체 기록 삭제</h3>
              <p>이 탭에 표시된 예시 기록을 모두 삭제해요</p>
            </div>
            <button className="settings-delete" type="button" onClick={deleteAllRecords}>삭제</button>
          </div>
          <p className="settings-status" role="status">{dataMessage}</p>
        </section>
      </main>
    </Layout>
  );
}
