type ExportRecord = {
  title: string;
  domain: string;
  answers: string[];
  feedback: string | null;
};

export async function createRecordsImage(records: ExportRecord[]): Promise<Blob> {
  const width = 960;
  const padding = 48;
  const scale = 2;
  const canvas = document.createElement("canvas");
  const drawingContext = canvas.getContext("2d");
  if (!drawingContext) throw new Error("Canvas is unavailable");
  const context = drawingContext;

  const lines: { text: string; top: number; font: string; color: string }[] = [];
  let top = padding;

  function addText(text: string, size: number, weight: number, color: string) {
    const font = `${weight} ${size}px system-ui, sans-serif`;
    context.font = font;
    let line = "";

    function addLine(value: string) {
      lines.push({ text: value, top, font, color });
      top += Math.ceil(size * 1.55);
    }

    for (const character of text) {
      if (character === "\n") {
        addLine(line);
        line = "";
      } else if (line && context.measureText(line + character).width > width - 2 * padding) {
        addLine(line.trimEnd());
        line = character.trimStart();
      } else {
        line += character;
      }
    }

    if (line) addLine(line);
  }

  addText("CLF Note 학습 기록", 32, 700, "#111111");
  top += 20;

  for (const record of records) {
    addText(record.title, 22, 700, "#111111");
    addText(record.feedback ? `${record.domain} · ${record.feedback}` : record.domain, 14, 400, "#666666");
    top += 8;
    for (const answer of record.answers) {
      addText(answer, 17, 400, "#222222");
    }
    top += 28;
  }

  const height = top + padding - 28;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.textBaseline = "top";

  for (const line of lines) {
    context.font = line.font;
    context.fillStyle = line.color;
    context.fillText(line.text, padding, line.top);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG encoding failed"));
    }, "image/png");
  });
}
