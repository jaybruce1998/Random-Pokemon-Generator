const http = require('http');//used for making the server
const express = require('express');//used for processing requests
const app=express();
const puppeteer=require("puppeteer");
const port=1337;
const pokemon={};//cache
const format=n=>"0".repeat(3-n.length)+n;
var page;
app.get('/', async(req, res) => {//upon loading the site, render our homepage
    let n=format(parseInt(Math.random()*809)+1+"");//random pokemon number padded with zeroes
    if(!pokemon[n])
    {
        await page.goto("https://www.serebii.net/pokedex-sm/"+n+".shtml");//load page with information
        //example of reading from page
        pokemon[n]={"number": n, "name": await page.evaluate(`document.getElementsByTagName("h1")[0].innerHTML.split(" ")[1]`)};//object to be sent to index.ejs
    }
    res.render("index.ejs", pokemon[n]);
});
http.createServer(app).listen(port, async() => {//creates a server on the specified port number
    app.engine('html', require('ejs').renderFile);//allows html rendering
    const browser=await puppeteer.launch({...{}, args: ['--disable-dev-shm-usage']});
    page=await browser.newPage();
    console.log('Express server listening on port '+port);
});