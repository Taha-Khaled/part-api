const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { wordList, scoresList } = require("./TestData.json");
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`live at ${port}`));
//to allow communication via localhost
app.use(cors({ origin: "*", methods: ["POST"] }));

app.use(express.json());
//word api
app.post("/words", (req, res) => {
  const RandomWordList = [];
  //new feat that we can choose the length of the wordlist but also cant be more than 15
  const { list_length } = req.body;
  if (!list_length || (list_length <= 15 && list_length >= 0)) {
    //add random words to the list but also uniqe words
    while (RandomWordList.length < (list_length || 10)) {
      const rand = Math.floor(Math.random() * 15);
      if (RandomWordList.indexOf(wordList[rand]) < 0) {
        RandomWordList.push(wordList[rand]);
      }
    }
    res.status("200").send(RandomWordList);
  } else {
    res.status("418").send({
      message:
        list_length < 0
          ? "list_length must be value >= 0 !"
          : "list_length max value = 15 !",
    });
  }
});
//rank api
app.post("/rank", (req, res) => {
  const { score } = req.body;
  let finalRank = 0;
  //loop at all data and if score less than the given score add one to rank
  for (let index = 0; index < scoresList.length; index++) {
    scoresList[index] < score && finalRank++;
  }
  //calculate the final rank & send it back
  finalRank = Math.round((finalRank / 30) * 10000) / 100;
  if (score) {
    res.status("200").send({ rank: finalRank });
  } else
    res.status("418").send({
      message: "score is required !",
    });
});
