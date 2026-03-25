# 萬能青年旅店歌詞本

A mobile-first concert companion app for 萬能青年旅店 (Omnipotent Youth Society). Browse all songs, read lyrics with adjustable font sizes, and search by title or lyric content — designed for singing along at live shows.

**Live app → https://kai-lim.github.io/omnipotent-youth-society/**

## Features

- Full song list from both studio albums, grouped by album
- Search by song title **or** lyric content
- Tap any song to open the full lyrics view
- **A−** / **A+** buttons to adjust font size (saved across sessions)
- Dark theme for low-light concert environments
- Screen wake lock keeps the display on while reading lyrics
- Works fully offline — all data is bundled in the app

## Songs

**萬能青年旅店 (2010)**

| # | Title |
|---|---|
| 1 | 狗尿館 *(instrumental)* |
| 2 | 不萬能的喜劇 |
| 3 | 揪心的玩笑與漫長的白日夢 |
| 4 | 大石碎胸口 |
| 5 | 洋鳥消夏錄 *(instrumental)* |
| 6 | 秦皇島 |
| 7 | 十萬嬉皮 |
| 8 | 在這顆行星所有的酒館 |
| 9 | 殺死那個石家莊人 |

**冀西南林路行 (2020)**

| # | Title |
|---|---|
| 1 | 早 *(instrumental)* |
| 2 | 泥河 |
| 3 | 平等雲霧 *(instrumental)* |
| 4 | 採石 |
| 5 | 山雀 |
| 6 | 繞越 *(instrumental)* |
| 7 | 河北墨麒麟 |
| 8 | 郊眠寺 |

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Updating lyrics

All lyrics live in [`src/data/songs.ts`](src/data/songs.ts). Each song has a `lyrics` field — just edit the string directly. Use `\n\n` between stanzas.

Recommended sources for missing or corrected lyrics:
- [Mojim.com 魔鏡歌詞](https://mojim.com/us109920x1.htm) (Album 1) · [Album 2](https://mojim.com/us109920x2.htm)
- [KKBOX](https://www.kkbox.com/tw/en/album/Sk3lRM66dNq4WvmGWF)
- [LyricsTranslate](https://lyricstranslate.com/en/omnipotent-youth-society-lyrics.html)

## Deployment

Pushing to `main` automatically deploys to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
