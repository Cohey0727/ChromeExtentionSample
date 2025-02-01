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

const searchButton = (
  element: HTMLElement | null,
  selector: string,
  depth: number = 0,
): HTMLButtonElement | null => {
  // 要素がnullまたは探索深さが一定以上の場合は終了
  if (!element || depth > 5) return null;

  // 兄弟要素を探索
  let sibling = element.nextElementSibling;
  while (sibling) {
    // 兄弟要素内から条件に合致する要素を探索し、その親のbuttonを取得
    const found = sibling.querySelector(selector)?.closest("button");
    if (found instanceof HTMLButtonElement) {
      return found;
    }
    sibling = sibling.nextElementSibling;
  }

  // 親要素が存在する場合、親要素から再探索
  const parent = element.parentElement;
  if (parent) {
    return searchButton(parent, selector, depth + 1);
  }

  return null;
};

const changeCmdEnterBehavior = (keyEvent: KeyEvent, event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  if (keyEvent === "keydown") {
    const button = searchButton(target, ".svg-inline--fa.fa-paper-plane");
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
    button?.click();
  }
};

listenImeEvents();
changeEnterBehavior();
