document.addEventListener("keydown", (event) => {
  console.log("キーが押されました");
  console.log(event.key, event.shiftKey);

  // エンターキーが押され、かつShiftキーが押されていない場合
  if (event.key === "Enter" && !event.shiftKey) {
    // デフォルトの動作を防ぐ
    event.preventDefault();

    // Shift+Enterのイベントを作成
    const newEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });

    // 新しいイベントを発火
    event.target.dispatchEvent(newEvent);
  }
});
