import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

const url = "https://twttrapi.p.rapidapi.com/user-tweets?username=ant2357"

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
    'X-RapidAPI-Host': 'twttrapi.p.rapidapi.com'
  }
}

try {
  const response = await fetch(url, options);
  const result = await response.json();
  const timeline = result["data"]["user_result"]["result"]["timeline_response"]["timeline"]["instructions"][2];

  let tweets = [];
  for (const tweet of timeline["entries"]) {
    // ゴミデータの除去
    if (tweet["content"]["cursorType"] !== undefined) {
      continue;
    }

    if (tweet["content"]["content"] !== undefined) {
      // 通常のツイート
      tweets.push(tweet["content"]["content"]["tweetResult"]["result"]["legacy"]["full_text"]);
    } else if (tweet["content"]["items"] !== undefined) {
      // 子要素持ちの親ツイート(リプライ or 画像等)
      tweets.push(tweet["content"]["items"][0]["item"]["content"]["tweetResult"]["result"]["legacy"]["full_text"]);
    }
  }

  // ツイートデータ(リプライは除く)を出力
  fs.writeFileSync("userTweets.json", JSON.stringify(tweets, null, 2));

  console.log("Success");
  for (const tweet of tweets) {
    console.log(tweet);
  }
} catch (error) {
  console.error(error);
}
