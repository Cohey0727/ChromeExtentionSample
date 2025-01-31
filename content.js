const keyEvents = ["keydown", "keypress", "keyup"];

const insertNewLine = (event) => {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  textarea.value = value.substring(0, start) + "\n" + value.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + 1;
};

const state = {
  ime: false,
};

const imeEvents = ["compositionstart", "compositionend"];

const listenImeEvents = () => {
  imeEvents.forEach((imeEvent) => {
    document.addEventListener(
      imeEvent,
      (event) => {
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

const changeAllEnterBehavior = () => {
  keyEvents.forEach((keyEvent) => {
    document.addEventListener(
      keyEvent,
      (event) => {
        if (event.key !== "Enter" || event.shiftKey || event.target.tagName !== "TEXTAREA") {
          console.log("Detected key event:", {
            type: event.type,
            key: event.key,
            shiftKey: event.shiftKey,
            target: event.target,
            tagName: event.target.tagName,
          });
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        console.log("EnterをEnter+Shiftに変更しました");
        // イベントの種類に応じて適切なイベントシーケンスを発火
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
          events.forEach((e) => event.target.dispatchEvent(e));
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
          event.target.dispatchEvent(keypressEvent);
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
          events.forEach((e) => event.target.dispatchEvent(e));
        }
      },
      true,
    );
  });
};

listenImeEvents();
changeAllEnterBehavior();
