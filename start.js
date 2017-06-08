var express = require("express");
var bodyparser = require("body-parser");
var request = require("request");

var app = express();
app.use(bodyparser.json());

// Client
app.use(express.static('UI'));

// Server
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var access_keys = {
  user: 'ad8b4087b32cde2d25918d50888b08f941e5047a'
};

var db = {
  images: [
    {
      'url': 'https://i.imgflip.com/19a9a2.jpg',
      'original_text': 'Judge me by size do you? Good enough for your girlfriend it was.'
    }
  ]
};

// TODO Implement REST endpoints here that receive HTTP requests, authorize them and give an appropriate response

//Stuur db naar client
getDB();


function getDB() {
    app.get("/api/getDb", function (req, res) {
        res.status(200).json(db);
    });
}


//Genereer meme op basis van input
app.post('/api/inputText', function(req, res) {
  var textInput = req.body.text;

  console.log("--------- BEGIN ---------\n")
  console.log("received: " + textInput + "\n");

    request.get('https://watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone?text=' + textInput + '&sentences=true&version=2017-06-07.json', function (error, response, body) {
        /*console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);*/

        //check alle scores van elke emotie
        obj = JSON.parse(body);
        console.log(obj.document_tone.tone_categories[0].tones[0].tone_name + ": " + obj.document_tone.tone_categories[0].tones[0].score);
        console.log(obj.document_tone.tone_categories[0].tones[1].tone_name + ": " + obj.document_tone.tone_categories[0].tones[1].score);
        console.log(obj.document_tone.tone_categories[0].tones[2].tone_name + ": " + obj.document_tone.tone_categories[0].tones[2].score);
        console.log(obj.document_tone.tone_categories[0].tones[3].tone_name + ": " + obj.document_tone.tone_categories[0].tones[3].score);
        console.log(obj.document_tone.tone_categories[0].tones[4].tone_name + ": " + obj.document_tone.tone_categories[0].tones[4].score + "\n");

        //Bepaal welke emotie de hoogste score heeft
        currentEmotion = "no emotion";
        currentScore = 0;
        nextEmotion = obj.document_tone.tone_categories[0].tones[0].tone_name;
        nextScore = obj.document_tone.tone_categories[0].tones[0].score;

        for (i = 0; i < obj.document_tone.tone_categories[0].tones.length; i++){
            nextEmotion = obj.document_tone.tone_categories[0].tones[i].tone_id;
            nextScore = obj.document_tone.tone_categories[0].tones[i].score;
            if (nextScore > currentScore){
                currentScore = nextScore;
                currentEmotion = nextEmotion;
            }
        }
        console.log("emotie: " + currentEmotion + " with score: " + currentScore + "\n");

        //Kies gepaste template_id voor meme afbeelding
        template_id = 0;
        switch (currentEmotion){
            case "anger":
              template_id = 39123068;
              break;
            case "disgust":
                template_id = 69290504;
                break;
            case "fear":
                template_id = 104947196;
                break;
            case "joy":
                template_id = 59281557;
                break;
            case "sadness":
                template_id = 64245474;
                break;
        }
        console.log("Template id: " + template_id + "\n");

        //Call naar API voor juiste meme
       request.post('https://api.imgflip.com/caption_image?template_id=' + template_id + '&username=robbegoethals&password=cloudapis&text0=&text1=' + textInput, function (error, response, body) {
          obj = JSON.parse(body);

          //als object ontvangen:
          if(obj.success == true){
            //maak meme object voor database
            var meme = {
              'url': obj.data.url,
              'original_text': textInput
            }
            console.log("url: " + meme.url + "\nmet tekst: " + meme.original_text + "\n");

            //steek dataobject in database
            db.images.push(meme);

            //toon data in database
            console.log("      *****db*****\n");
            for(i = 0; i < db.images.length; i++){
              console.log("url: " + db.images[i].url + "\noriginal_text: " + db.images[i].original_text + "\n");
            }
            console.log("\n      ************");
          }
          else{
              console.log("Got no url!\n");
          }

          //post db naar client
           app.post('http://localhost:3000/api/db', function(req, res) {
             console("Sent db to client!\n");
           });

           console.log("--------- END ---------\n")
        });


    });

});

app.listen(3000);
