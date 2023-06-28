const axios = require('axios');
const client = require("azlyrics-lyric-scraper");
const express = require('express');
const path = require('path');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    //res.send("This API was made by HackMeSenpai. Please refer to the documentation page for more details about API.")
    //res.status(200)
    res.redirect("https://azlyrics-unofficial-api.vercel.app/Docs")
})

app.get('/Docs', function(req, res) {
    //res.sendFile('docu.html',{ root: __dirname});
    res.sendFile(path.resolve('./docu.html'))
})

app.get('/GetLyrics', function(req, res) {
    let q = req.query.query;
	let apikey = req.query.api;
	let url = req.query.url;
    if (!apikey&&(q||url)) res.send({message: "Invalid Request, Please provide an API Key!"});
    else if (!(q||url)&&apikey) res.send({message: "Invalid Request, query/url parameter must be filled!"});
    else if (!(q||url)&&!apikey) res.send({message: "Invalid Request, query/url and api parameter must be filled!"});
    else if ((q&&apikey)&&!url) {
        try {
            let azlyrics = new client(apikey)
            azlyrics.searchSong(q).then(data => {
							data = JSON.parse(data)
                if (data.songs.length != 0){
                    try {
                        azlyrics.getLyrics(data.songs[0].url).then(data2=>{
                            res.send(data2)
                        })
                    }
                    catch(e){
											
		                res.send({message: "Error! Please try again."})
		            }
                }
                else res.send(data)
		    })
		}
		catch(e){
		    res.send({message: "Error! Please try again."})
		}
    }
    else if ((url&&apikey)&&!q) {
        try {
            let azlyrics = new client(apikey)
            azlyrics.getLyrics(url).then(data =>{
                res.send(data)
            })
		}
		catch(e){
		    res.send({message: "Error! Please try again."})
		}
    }
});

app.listen(port, () => {
  console.log(`AzLyrics Server is listening on port ${port}`)
})

module.exports = app;
