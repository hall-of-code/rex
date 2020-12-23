
//definiton Header
$arr = {
    "nerfsystem": 0,
    "disallowed_words": [
        "spast",
        "hurensohn",
        "bastard",
        "fick",
        "fuck",
        "arsch"
    ],
    "topics": [
        "ottnec.de",
        "ottnec-hardware.de",
        "wiobu.de",
        "hosting.ottnec.de",
        "ottsoft.de"
    ],
    "trigger_points": {
        "visionhost": "Visionen haben wir auch :)",
        "yourcloud": "Heutzutage ist alles Cloudbasiert - da ist so ne Cloud schon was cooles :)",
        "hetzner": "Lasst euch nicht hetzen ;)",
        "interwerk": "Zuhause ist dort, wo man seine Server hat.",
        "maincubes": "Das hat Potenzial!",
        "supermicro": "I love this company <3",
        "ottnec": ["Whaaaaa das sind ja wir ^^", "Wer hat mich gerufen?"],
        "hallo": ["Hey", "Moin", "Servus", "Guden Tag", "Tach :)", "Hi", "Hello"],
        "hey": ["Hey", "Moin", "Servus", "Guden Tag", "Tach :)", "Hi", "Hello"],
        "hello": ["Hey", "Moin", "Servus", "Guden Tag", "Tach :)", "Hi", "Hello"],
        "tach": ["Hey", "Moin", "Servus", "Guden Tag", "Tach :)", "Hi", "Hello"],
        "servus": ["Hey", "Moin", "Servus", "Guden Tag", "Tach :)", "Hi", "Hello"],
        "guten tag": ["Hey", "Moin", "Servus", "Guden Tag", "Tach :)", "Hi", "Hello"],
        "moin": ["Morgen!", "Gäääähn"],
        "abend": ["Nabend", "Guten Abend ;)"],
        "frohe weihnachten": ["Danke ebenso =)", "Und was hast bekommen?!", "Frohes Fest :)", "Ho Ho Ho - Rudolph flieg!"],
        "happy new year": ["Frohes neues!", "Psssyyyyyyyyyyyyyyyiiiert -> PENG ", "krchkrchkrchkrch - PACH", "Wunderkerzen sind cool!", "Danke ebenso :)"],
        "frohes neues": ["Frohes neues!", "Psssyyyyyyyyyyyyyyyiiiert -> PENG ", "krchkrchkrchkrch - PACH", "Wunderkerzen sind cool!", "Danke ebenso :)"],
        "köftespie": "Mit gar kein Reden und so."
    },
    "trigger_functions": {
        "pingtool": "ping",
        "lookup": "lookup",
        "domaincheck": "check"
    },
    "trigger": "test"
}


//Body
const Discord = require('discord.js');
const client = new Discord.Client();

const $dns = require('dns');
const $crypto = require('crypto');
const $request = require('request');
const $exec = require("child_process").execSync; //shell c

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', $msg => {
    if ($msg.author.bot) return;
    parseMessage($msg);
});

client.login('NzE0MTMyMTk3NDU1NTYwNzI0.XsqNeA.GpFKtSa3EHSJM7lzVeofjs91suM');



//function namespace
function parseMessage($msg)
{
    //function header
    var $ms = $msg.content;
    var $ms_lw = $ms.toLowerCase();
    var $ms_up = $ms.toUpperCase();

    //function body
    $checkpoint = $arr.disallowed_words.some(word => $ms_lw.includes(word));
    if($checkpoint)
    {
        $msg.delete();
        $msg.channel.send("[?] Oder meintest du: `"+ getRandomItem($arr.topics) +"`")
    }

    if(nerfSystem() !== "ja")
    {
        return;
    }

    if($ms.includes("bot") && $ms.includes("nerf"))
    {
        $msg.channel.send(":[ menno");
        $arr.nerfsystem = 30;
    }
    else if($ms.includes("bot") && $ms.includes("darfst"))
    {
        $msg.channel.send("[ :D ] Dankee");
        $arr.nerfsystem = 0;
    }
    else if($ms === ",nerf=mute")
    {
        $msg.channel.send("Mein Mund wird zugeklebt !!! ...[BOT MUTED]");
        $arr.nerfsystem = 100;
    }
    else if($ms.includes(",nerf=sorry"))
    {
        $msg.channel.send("[ :D ] Back on the road.");
        $arr.nerfsystem = 0;
    }
    else if($ms.includes(",nerf=set:"))
    {
        $arr.nerfsystem = parseInt($ms.split(":")[1]);
    }

    $triggerfunction = includesWordKey($ms_lw, $arr.trigger_functions);
    if($triggerfunction != "!!no")
    {
        if($triggerfunction === "ping")
        {
            $msg.channel.send(pingIPAdress($ms_lw.split(" ")[1]));
        }
        else if($triggerfunction === "lookup")
        {
            lookupDomain($ms_lw.split(" ")[1], $msg);
        }
        else if($triggerfunction === "check")
        {
            checkDomain($ms_lw.split(" ")[1], $msg);
        }
        return;
    }

    $triggerpoint = includesWordKey($ms_lw, $arr.trigger_points);
    if($triggerpoint != "!!no")
    {
        $msg.channel.send($triggerpoint);
    }
}

//checkdomain
function checkDomain($domain, $msg) {
    $request('https://ottnec.de/Beispiel.php?key=asdfi3292%C3%9Fasdfmp42$0o32q%C3%9F0asdf&domain=' + $domain, (err, res, body) => {
        if (err) {
            $msg.channel.send("Fehler, bitte versuche es später erneut. Oder Checke deine Domain über hosting.ottnec.de ;)");
            console.log(err);
        }
        if (body === '{"status":"free"}') {
            $msg.channel.send("Deine Domain ist noch Frei! Hohl sie dir schnell bevor es ein anderer tut: https://hosting.ottnec.de/cart.php?a=add&domain=register&query=" + $domain);
        } else if (body === '{"status":"connect"}') {
            $msg.channel.send("Die Domain ist leider belegt :(");
        } else {
            $msg.channel.send("Fehler, bitte versuche es später erneut. Oder Checke deine Domain über hosting.ottnec.de ;)");
        }
    });
}

//lookup
function lookupDomain($domain, $msg)
{
    try
    {
        $dns.resolveNs($domain, (err, address, family) => {
            $msg.channel.send("[LOOKUP] Nameserver: "+address);
        });
    }
    catch($err)
    {
        return "[LOOKUP] Es ist ein Fehler aufgetreten.";
    }
}

//pingtool
function pingIPAdress($ip)
{
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test($ip)) {
        $res = $exec("ping -r 4 "+$ip);
        $res = $res.toString('utf8');
        $res = $res.split('rtt')[1];
        $res = $res.split("/");
        $res = $res[4];
        return "[PING] Die Abfrage hat "+$res+"ms gedauert.";
    }
    return "[PING] Es ist leider kein Ping zu dieser IP Adresse möglich :/";
}

//nerfsystem
function nerfSystem()
{
    if(getRandom(0,3) < 3 && $arr.nerfsystem <= 20)
    {
        $arr.nerfsystem += 1;
        return "ja";
    }
    else
    {
        $arr.nerfsystem -= 2;
        if($arr.nerfsystem < 0)
        {
            $arr.nerfsystem = 1;
        }
        return "nein";
    }
}

//if includes keyword
function includesWordKey($wordToFind, $object)
{
    for(var $key in $object)
    {
        if($wordToFind.includes($key))
        {
            if(typeof $object[$key] === "object")
            {
                return $object[$key][getRandom(0, $object[$key].length)];
            }
            return $object[$key];
        }
    }
    return "!!no";
}


//get random topic
function getRandomItem($item)
{
    for($topic of $item)
    {
            $_topic = $topic;
            if(typeof $topic === "object")
            {
                $topic = $topic[getRandom(0, $topic.length)];
            }
            return $topic;
    }
    return $_topic;
}

//random number
function getRandom($min, $max)
{
    return Math.floor(Math.random() * $max) + $min;
}