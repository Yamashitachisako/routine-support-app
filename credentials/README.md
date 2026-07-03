Place your Google Cloud service account key JSON here as:

`service-account.json`

The server reads `client_email` and `private_key` from this file automatically.
Only `GOOGLE_SHEETS_ID` needs to be set in `.env`.

## Google Cloud セットアップ

1. [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) を有効化（プロジェクト: `routinesupport`）
2. スプレッドシート「RoutineSupport Database」をサービスアカウントに **閲覧者** として共有  
   `routinesupport-sheets@routinesupport.iam.gserviceaccount.com`

## 接続確認

```bash
npx tsx script/test-google-sheets.ts
```

`source: "sheets"` になれば成功です。

This file is gitignored.
