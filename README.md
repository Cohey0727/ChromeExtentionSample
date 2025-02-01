# ChatLLM Enter Modifier

ChatLLMのテキスト入力操作をより快適にするChrome拡張機能です。

## 機能

Enterキーの動作を変更し、Shift + Enterで改行、CMD/Ctrl + Enterで送信するように設定
apps.abacus.ai ドメインで動作

## インストール方法

このリポジトリをクローンまたはダウンロード

依存パッケージのインストール:

```
pnpm install
```

## ビルド

```
pnpm build
```

- Chrome拡張機能の管理ページ(chrome://extensions/)を開く
- 「デベロッパーモード」を有効化
- 「パッケージ化されていない拡張機能を読み込む」からdistフォルダを選択

## 開発

主要なファイル構成

```
.
├── content.ts # コンテンツスクリプト
├── src/  
│ ├── App.tsx # ポップアップのメインコンポーネント
│ └── main.tsx # ポップアップのエントリーポイント
├── manifest.json # 拡張機能の設定ファイル
└── popup.html # ポップアップのHTML
```

## 開発用コマンド
```
# 依存パッケージのインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build
```

## ライセンス
MIT

## 注意事項
この拡張機能はapps.abacus.aiドメインでのみ動作します。
Manifest V3を使用しています。
