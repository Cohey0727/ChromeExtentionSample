const state = { ime: false };

const imeEvents = ["compositionstart", "compositionend"];

const listenImeEvents = () => {
  imeEvents.forEach((imeEvent) => {
    document.addEventListener(
      imeEvent,
      () => {
        if (imeEvent === "compositionstart") {
          state.ime = true;
        }
        if (imeEvent === "compositionend") {
          state.ime = false;
        }
      },
      true,
    );
  });
};

const insertNewLine = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  textarea.value = value.substring(0, start) + "\n" + value.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + 1;
  // 改行分スクロールする
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight ?? "0", 10);
  textarea.scrollTop = Math.floor(textarea.scrollTop + lineHeight);
  // inputイベントを発火
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
};

const keyEvents = ["keydown", "keypress", "keyup"] as const;
type KeyEvent = (typeof keyEvents)[number];

const changeEnterBehavior = () => {
  keyEvents.forEach((keyEvent) => {
    document.addEventListener(
      keyEvent,
      (e) => {
        const event = e as KeyboardEvent;
        const target = event.target as HTMLElement | null;
        const eventKey = event.key as string | "Enter";
        const tagName = target?.tagName ?? "";
        if (eventKey !== "Enter" || tagName !== "TEXTAREA" || !event.isTrusted) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        // イベントの種類に応じて適切なイベントシーケンスを発火
        if (!event.shiftKey && !event.metaKey) {
          // Shift押下なし、Cmd押下なし
          changeSimpleEnterBehavior(keyEvent, event);
        } else if (event.metaKey) {
          // Cmd押下
          changeCmdEnterBehavior(keyEvent, event);
        }
      },
      true,
    );
  });
};

const changeSimpleEnterBehavior = (keyEvent: KeyEvent, event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;

  if (keyEvent === "keydown") {
    // keydownの場合：Shift押下 → Enter押下
    const events = [
      new KeyboardEvent("keydown", {
        key: "Shift",
        code: "ShiftLeft",
        keyCode: 16,
        which: 16,
        shiftKey: true,
      }),
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: true,
      }),
      new KeyboardEvent("keypress", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: true,
      }),
    ];
    events.forEach((e) => target?.dispatchEvent(e));
    if (!state.ime) {
      insertNewLine(event);
    }
  } else if (keyEvent === "keypress") {
    // keypressの場合：Enterのkeypressのみ
    const keypressEvent = new KeyboardEvent("keypress", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      shiftKey: true,
    });
    target?.dispatchEvent(keypressEvent);
  } else if (keyEvent === "keyup") {
    // keyupの場合：Enter解放 → Shift解放
    const events = [
      new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: true,
      }),
      new KeyboardEvent("keyup", {
        key: "Shift",
        code: "ShiftLeft",
        keyCode: 16,
        which: 16,
        shiftKey: false,
      }),
    ];
    events.forEach((e) => target?.dispatchEvent(e));
  }
};

const changeCmdEnterBehavior = (keyEvent: KeyEvent, event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  if (keyEvent === "keydown") {
    const events = [
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: false,
      }),
      new KeyboardEvent("keypress", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: false,
      }),
      new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: false,
      }),
    ];
    events.forEach((e) => target?.dispatchEvent(e));
  }
};

listenImeEvents();
changeEnterBehavior();
