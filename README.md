## パスワードのハッシュ化

```
node -e 'const argon2 = require("argon2");
(async () => {
  const hash = await argon2.hash("平文パスワード", { type: argon2.argon2id });
  const escaped = hash.replace(/\$/g, "\\$");
  console.log("ADMIN_PASS=" + escaped);
})();'
```

`.env` の `ADMIN_PASS` に設定する。
`.env` の値に `$` を直接使えないため、 `\$` に置換している。