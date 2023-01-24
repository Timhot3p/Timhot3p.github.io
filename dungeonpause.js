function calc() {

    document.getElementById("output_log").textContent = "";
    
    let dpstart = document.getElementById("dp_start").value;   
    let dpend = document.getElementById("dp_end").value;
    let level = document.getElementById("current_lvl").value;
    let goallvl = document.getElementById("goal_lvl").value;
    let book = document.getElementById("scrapbook").value;
    let calendarSkip = document.getElementById("calendar_skip").checked;
    let calendarNormal = document.getElementById("calendar_normal").checked;
    let xpevt = document.getElementById("xpevt").checked;

    if (dpend < dpstart) {
        let temp = dpend;
        dpend = dpstart;
        dpstart = temp;
    }

    if (goallvl < level) {
        var temp = goallvl;
        goallvl = level;
        level = temp;
    }

    if (level < 1) {
        level = 1;
    }
    if (goallvl > 800) {
        goallvl = 800;
    }

    if (book < 0) {
        book = 0;
    } else if (book > 100) {
        book = 100;
    }
    
    var player = {       
        level: level,
        xp: 0,
        age: 0,
        dpstart: dpstart,
        dpend: dpend,
        goallvl: goallvl,
        book: book,
        calendarSkip: calendarSkip,
        calendarNormal: calendarNormal,
        xpevt: xpevt
    }

    var daysDp = getDp(player);
    var daysNo = getNoDp(player);
    var daysOpt = getOptDp(player);    
    
    document.getElementById("result_dp").textContent = "It will take you " + daysDp + " days to reach level " + goallvl + ".";
    document.getElementById("result_normal").textContent = "Without dungeonpause it would take you " + daysNo + " days.";
    document.getElementById("result_normal").style.color ="#565656"
    document.getElementById("result_opt").textContent = "Optimal time to reach level " + goallvl + " would be " + daysOpt + " days, by doing a dungeonpause between level A and level B.";
    document.getElementById("result_opt").style.color = "#565656"
}

//disable dungeonpause inputs when "ignore dungeons" is checked
function disableDungeons() {
    var checkBox = document.getElementById("ign_dng");
    if (checkBox.checked) {
        document.getElementById("dp_start").value = 0;
        document.getElementById("dp_end").value = 700;
        document.getElementById("dp_start").disabled = true;
        document.getElementById("dp_end").disabled = true;
    } else {
        document.getElementById("dp_start").disabled = false;
        document.getElementById("dp_end").disabled = false;
    }
}

//unchecks calendar_skip if calendar_normal is enabled
function uncheckSkip() {
    var checkBox = document.getElementById("calendar_normal");
    if (checkBox.checked) {
        document.getElementById("calendar_skip").checked = false;
    }
}

//unchecks calendar_normal if calendar_skip is enabled
function uncheckNormal() {
    var checkBox = document.getElementById("calendar_skip");
    if (checkBox.checked) {
        document.getElementById("calendar_normal").checked = false;
    }
}

function checkMinValue() {
    var input = document.getElementById("current_lvl");
    if (input.value < 200) {
        input.value = 200;
    }
}

//checks if a player lvled up
function checkLvlUp(player, write) {
    while (player.xp >= getExperienceRequired(player.level)) {
        doLvlUp(player, write);
    }
}

//executes the lvlup for a player, writes to log
function doLvlUp(player, write) {
    player.xp -= getExperienceRequired(player.level);
    player.level++;
    if (write) {
        document.getElementById("output_log").textContent += ("Day " + player.age + ": Level " + player.level + "\n");
    }
}

//checks for a xp event based on data from 2022: 4 xp events inside 9 weeks
function checkXpEvent(age) {
    return [11,12,13,25,26,27,39,40,41,53,54,55].includes(age % 63);
}

//collects all daily xp and adds them together, checks for xp event
function getDailyXp(player) {
    var total = getDailyXpThirst(player.level, player.book) + getDailyXpAcademy(player.level) + + getDailyXpArena(player.level) + getDailyXpMission(player.level) + getDailyXpWheel(player.level) + getDailyXpGuildfight(player.level);

    if (player.xpevt && checkXpEvent(player.age)) {
        total *= 2;        
    }

    total += getDailyXpAdventuromatic(player.level, player.book);

    if (player.calendarSkip) {
        total += getDailyXpCalendarSkip(player.level, player.age);
    } else if (player.calendarNormal) {
        total += getDailyXpCalendarNormal(player.level, player.age);
    }
    
    if ((player.level < player.dpstart) || player.level >= player.dpend) {
        total += getXpDungeon(player);
    }
    return total;
}

//daily xp from thirst ignoring events
function getDailyXpThirst(level, book) {
    let questFactor = 0.84;
    let smallsegmet = 2.5;

    let thirstbase = 320;
    let bonusred = 5;
    let bonuslast = 5;
    let thirst = thirstbase + bonusred + bonuslast;

    return thirst * (questFactor / smallsegmet) * getMaxXp(level, book);    
}

//daily xp from 20 thirst in adventuromatic
function getDailyXpAdventuromatic(level, book) {
    let questFactor = 0.84;
    let smallsegmet = 2.5;
    let thirst = 20;

    return thirst * (questFactor / smallsegmet) * getMaxXp(level, book);
}

//daily xp from arena ignoring events
function getDailyXpArena(level) {
    return 10 * getArenaXp(level);
}

//daily xp from calendar considering the day using skip strategy
function getDailyXpCalendarSkip(level, day) {
    switch (day % 88) {
        case 7:
        case 42:
        case 51:
        case 76:
            return getExperienceRequired(level) / 15;

        case 11:
        case 43:
        case 55:
        case 85:
            return getExperienceRequired(level) / 10;

        case 23:
        case 87:
            return getExperienceRequired(level) / 5;

        case 24:
        case 46:
        case 67:
        case 0:            
            return getExperienceRequired(level);            

        default:
            return 0;
    }
    return 0;
}

//daily xp from calendar considering the day without using skip strategy
function getDailyXpCalendarNormal(level, day) {
    switch (day % 240) {
        case 25:
        case 83:
        case 156:
        case 184:
        case 228:
            return getExperienceRequired(level) / 15;

        case 87:
        case 157:
        case 188:
        case 237:
            return getExperienceRequired(level) / 10;

        case 99:
        case 239:
            return getExperienceRequired(level) / 5;

        case 20:
        case 40:
        case 60:
        case 80:
        case 100:
        case 120:
        case 140:
        case 160:
        case 180:
        case 200:
        case 220:
        case 0:
            return getExperienceRequired(level);

        default:
            return 0;
    }
    return 0;
}

//Estimates what Hydra you can defeat with which level
function getHydraByLevel(level) {
    return Math.max(0, Math.floor((level - 300) / 15));
}

//daily xp of the daily secret mission ignoring events
function getDailyXpMission(level) {
    return getHydraXp(level, getHydraByLevel(level));
}

//daily xp of the guild fight ignoring events
//very inacurate formula
function getDailyXpGuildfight(level) {   
    return (2 * 0.697 * getDailyXpArena(level));
}

//daily xp of academy ignoring events
function getDailyXpAcademy(level) {
    let hours = 24;
    return hours * getAcademyValues(level, 20);
}

//daily xp of wheel ignoring events
function getDailyXpWheel(level) {
    return 3 * getBigWheel(level);
}

//xp of dungeons possible considering a players level, writes to log
function getXpDungeon(level) {
    return 0;
}

//returns the number of days to reach a lvl with dp
function getDp(player) {
    while (player.goallvl > player.level) {
        player.age++;
        player.xp += getDailyXp(player, true);
        checkLvlUp(player, true);
    }
    document.getElementById("output_log").textContent += "\n-----------------------\n"
    return player.age;
}

//returns the number of days to reach a lvl without dp
function getNoDp(player) {
    return 0;
}

//returns the number of days to reach a lvl with optimal dp
function getOptDp(player) {    
    return 0;
}