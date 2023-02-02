const questFactor = 0.84;
const maxBook = 2283;
const xpEventRatio = 1.19047619;

function calc() {

    document.getElementById("output_log").textContent = "";
    
    let dpstart = Math.round(document.getElementById("dp_start").value);
    let dpend = document.getElementById("dp_end").value;
    let level = Math.round(document.getElementById("current_lvl").value);
    let goallvl = Math.round(document.getElementById("goal_lvl").value);
    let bookbonus = document.getElementById("scrapbook").value;
    let calendarSkip = document.getElementById("calendar_skip").checked;
    let calendarNormal = document.getElementById("calendar_normal").checked;
    let steady = document.getElementById("steady").checked;
    let xpevt = document.getElementById("xpevt").checked;
    let doOpt = document.getElementById("calcopt").checked;
    let ignDng = document.getElementById("ign_dng").checked;
    let age = 0;    

    //switch start/end if in wrong order
    if (dpend < dpstart) {
        let temp = dpend;
        dpend = dpstart;
        dpstart = temp;
    }

    //switch current/goal level if in wrong order
    if (goallvl < level) {
        let temp = goallvl;
        goallvl = level;
        level = temp;
    }    

    //levelcaps
    if (goallvl > 800) {
        goallvl = 800;
    } else if (goallvl < 1) {
        goallvl = 1;
    }
    if (level > 800) {
        level = 800;
    } else if (level < 1) {
        level = 1;
    }

    //guess age    
    age = getAge(level);    

    var book = 0;
    //get scrapbook either from input or level
    if (ignDng) {
        dpstart = 0;
        dpend = 800;
        if (bookbonus < 0) {
            bookbonus = 0;
        } else if (bookbonus > 100) {
            bookbonus = 100;
        }
        book = bonusToBook(bookbonus);

    } else {
        book = getBookFromLevel(level, age, level, steady);
    }

    let offset = age;

    var playerDp = getNewPlayer(level, 0, age, dpstart, dpend, goallvl, book, calendarSkip, calendarNormal, xpevt, steady, Math.min(level, dpstart));    


    document.getElementById("output_log").textContent += ignDng ? "Without Dungeons:\n" : "Custom Dungeonpause:\n"
    let daysDp = getDays(playerDp, true);
    document.getElementById("result_dp").textContent = "It will take you " + (daysDp - offset) + " days to reach level " + goallvl + ".";

    if (!ignDng) {
        var playerNo = getNewPlayer(level, 0, age, 0, 0, goallvl, book, calendarSkip, calendarNormal, xpevt, steady, Math.min(level, dpstart));
        var playerOpt = clone(playerNo);
        document.getElementById("output_log").textContent += "No Dungeonpause:\n"
        var daysNo = getDays(playerNo, true);
        document.getElementById("result_normal").textContent = "Without dungeonpause it would take you " + (daysNo - offset) + " days.";

        if (doOpt) {
            document.getElementById("output_log").textContent += "Possible Dungeonpauses:\n"
            var result = getOptDp(playerOpt);
            document.getElementById("result_opt").textContent = "Optimal time to reach level " + goallvl + " would be " + (result.daysopt - offset) + " days, by doing a dungeonpause between level " + result.startopt + " and level " + result.endopt + ".";
        }
    }  
}

//returns a new player with specified attributes
function getNewPlayer(level, xp, age, dpstart, dpend, goallvl, book, calendarSkip, calendarNormal, xpevt, steady, clearedDungeonsUntil) {
    return {
        level: level,
        xp: xp,
        age: age,
        dpstart: dpstart,
        dpend: dpend,
        goallvl: goallvl,
        book: book,
        calendarSkip: calendarSkip,
        calendarNormal: calendarNormal,        
        xpevt: xpevt,
        steady: steady,
        clearedDungeonsUntil: clearedDungeonsUntil,
        addXp: function (value, write) {
            if (value > 0) {
                this.xp += value;
                while (this.xp > getExperienceRequired(this.level)) {
                    this.xp -= getExperienceRequired(this.level);
                    this.level++;
                    if (write) {
                        document.getElementById("output_log").textContent += ("Day " + this.age + ": Level " + this.level + "\n");                       
                    }
                }
            }
        }
    }
}

//returns a copy of a player
function clone(player) {
    return {
        level: player.level,
        xp: player.xp,
        age: player.age,
        dpstart: player.dpstart,
        dpend: player.dpend,
        goallvl: player.goallvl,
        book: player.book,
        calendarSkip: player.calendarSkip,
        calendarNormal: player.calendarNormal,
        xpevt: player.xpevt,
        steady: player.steady,
        clearedDungeonsUntil: player.clearedDungeonsUntil,
        addXp: function (value, write) {
            if (value > 0) {
                this.xp += value;
                while (this.xp > getExperienceRequired(this.level)) {
                    this.xp -= getExperienceRequired(this.level);
                    this.level++;
                    if (write) {
                        document.getElementById("output_log").textContent += ("Day " + this.age + ": Level " + this.level + "\n");
                    }
                }
            }
        }
    }
}

//disable dungeonpause inputs when "ignore dungeons" is checked
function disableDungeons() {
    var checkBox = document.getElementById("ign_dng");    
    if (checkBox.checked) {      
        document.getElementById("dp_start").disabled = true;
        document.getElementById("dp_end").disabled = true;
        document.getElementById("scrapbook").disabled = false;
        document.getElementById("result_normal").style.color = "#1f1f1f";
        document.getElementById("result_opt").style.color = "#1f1f1f";
        document.getElementById("calcopt").disabled = true;
        document.getElementById("result_dp").textContent = "Result without dungeons";
    } else {        
        document.getElementById("dp_start").disabled = false;
        document.getElementById("dp_end").disabled = false;
        document.getElementById("scrapbook").disabled = true;
        document.getElementById("result_normal").style.color = "#ffffff";
        document.getElementById("calcopt").disabled = false;
        if (document.getElementById("calcopt").checked) {
            document.getElementById("result_opt").style.color = "#ffffff";
        }
        document.getElementById("result_dp").textContent = "Result with specified dungeonpause";
    }
}

//unchecks calendar_skip if calendar_normal is enabled
function uncheckSkip() {
    let checkBox = document.getElementById("calendar_normal");
    if (checkBox.checked) {
        document.getElementById("calendar_skip").checked = false;
    }
}

//unchecks calendar_normal if calendar_skip is enabled
function uncheckNormal() {
    let checkBox = document.getElementById("calendar_skip");
    if (checkBox.checked) {
        document.getElementById("calendar_normal").checked = false;
    }
}

//hides the optimal dungeonpause text when box is checked
function disableOpt() {
    let checkBox = document.getElementById("calcopt");   
    document.getElementById("result_opt").style.color = checkBox.checked ? "#ffffff" : "#1f1f1f";      
}

//checks for a xp event based on data from 2022: 4 xp events inside 9 weeks
function checkXpEvent(age) {
    return [15,16,17,29,30,31,43,44,45,57,58,59].includes(age % 63);
}

//collects all daily xp and adds them together, checks for xp event
function getDailyXp(player) {    
    let guildbonus = getGuildXp(player.age);

    //updates scrapbook if not manually set
    if (player.dpstart != 0 || player.dpend != 800) {
        player.book = getBookFromLevel(player.level, player.age, player.clearedDungeonsUntil, player.steady);
    }

    var total =
        getDailyXpThirst(player.level, player.book, guildbonus) +
        getDailyXpAcademy(player.level) +
        getDailyXpArena(player.level) +
        getDailyXpMission(player.level) +
        getDailyXpWheel(player.level) +
        getDailyXpGuildfight(player.level);

    if (player.xpevt) {
        if (player.steady) {
            total *= xpEventRatio;
        } else if (checkXpEvent(player.age)) { 
            total *= 2;
        }
    }

    total += getDailyXpAdventuromatic(player.level, player.book, guildbonus);
    //total += getXpPets(player.level, player.age);

    if (player.steady) {
        if (player.calendarSkip) {
            total += getDailyXpCalendarSkipSteady(player.level);
        } else {
            total += getDailyXpCalendarNormalSteady(player.level);
        }
    } else {        
        if (player.calendarSkip) {
            total += getDailyXpCalendarSkip(player.level, player.age);
        } else {
            total += getDailyXpCalendarNormal(player.level, player.age);
        }
    }
    
    return total;
}

//daily xp from thirst ignoring events
function getDailyXpThirst(level, book, guild) {    
    let smallsegmet = 2.5;
    let thirstbase = 320;

    let bonusred = 5;         //estimated bonus thirst for red quests
    let bonuslast = 5;        //estimated bonus thirst for last beer quests

    let thirst = thirstbase + bonusred + bonuslast;

    return thirst * (questFactor / smallsegmet) * getMaxXp(level, book, guild);    
}

//daily xp from 20 thirst in adventuromatic
function getDailyXpAdventuromatic(level, book, guild) {
    
    let smallsegmet = 2.5;
    let thirst = 20;

    return thirst * (questFactor / smallsegmet) * getMaxXp(level, book, guild);
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

//average daily xp from calendar using skip strategy
function getDailyXpCalendarSkipSteady(level) {
    return ((152 / 30) / 88) * getExperienceRequired(level);
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

//average daily xp from calendar without using skip strategy
function getDailyXpCalendarNormalSteady(level) {
    return ((394 / 30) / 240) * getExperienceRequired(level);
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

//daily xp of academy ignoring events, mine 20 assumed from the start on
function getDailyXpAcademy(level) {
    return 24 * getAcademyValues(level, 20);
}

//daily xp of wheel ignoring events
function getDailyXpWheel(level) {
    return 3 * getBigWheel(level);
}

//returns xp bonus in % from number of pictures
function bookToBonus(book) {
    return Math.round(book / maxBook * 10000) / 100;
}

//returns number of pictures from xp bonus
function bonusToBook(bonus) {
    return Math.round(maxBook * bonus/100);
}

//returns base number of pictures from level and age
function getBookFromLevel(level, age, dungeonLvl, steady) {
    let base = 0;

    //estimates for base scrapbook pictures
    if (level >= 358) {
        base = 1873;
    } else if (level < 230) {
        base = ((level - 200) * 3.3) + 1600;
    } else if (level >= 230 && level < 275) {
        base = ((level - 230) * 2) + 1700;
    } else if (level >= 275 && level < 358) {
        base = (level - 275) + 1790;
    }

    //110 seasonal items, equally distributed over the year
    let seasonal = Math.min((age * 110 / 365), 110);

    let dungeons = steady ? steadyScrapbook[dungeonLvl] : scrapbookAtLevel[dungeonLvl];

    return Math.round(base + seasonal + dungeons);
}

//estimates a players age based on his level
function getAge(level) {
    if (level == 1) {
        return 0;
    } else if (level <= 25) {
        return 1;
    } else if (level <= 100) {
        return 2;
    } else if (level <= 200) {
        return 3;
    } else {
        return ageFromLevel[level - 201];
    }
}

//transforms level + xp into level with decimal point
function getDecimalLevel(level, xp) {
    return level + (xp / getExperienceRequired(level))
}

//xp of dungeons possible considering a players level
function doDungeons(player, write) {                                                      
    let dungeonxp = 0;
    
    while ((player.level < player.dpstart || getDecimalLevel(player.level, player.xp) >= player.dpend) && player.clearedDungeonsUntil < player.level) {
        player.clearedDungeonsUntil++;
        let xp = player.steady ? steadyDungeons[player.clearedDungeonsUntil] : dungeonPerLevel[player.clearedDungeonsUntil];       
        player.addXp(xp, write);
        dungeonxp += xp;
    }

    return dungeonxp;   
}

//xp of pet dungeons possible considering players age, scaled to players level
function getXpPets(level, age) {
    return 0;
}

//returns guild xp bonus based on players age
function getGuildXp(age) {
    if (age > 25) {
        return 200;
    } else {
        return 96 + (age * 4);
    }
}

//returns the total remaining xp a player needs to reach their goallvl
function getRemainungXp(player) {
    if (player.level >= player.goallvl) {
        return 0;
    }
    
    let remxp = getExperienceRequired(player.level) - player.xp;
    let level = player.level + 1;
    while (level < player.goallvl) {
        remxp += getExperienceRequired(level);
        level++;
    }
    return remxp;   
}

//returns the number of days to reach a players goallvl
function getDays(player, write) {

    //hardcoded first weekend
    if (player.level < 25 && (player.dpstart >= 25 || player.dpend < 25)) {
        player.level = 25;
        player.age++;
        if (write) {
            document.getElementById("output_log").textContent += ("Day " + player.age + ": Level " + player.level + "\n");
        }
    }
    if (player.level < 100 && (player.dpstart >= 100 || player.dpend < 100)) {
        player.level = 100;
        player.age++;
        if (write) {
            document.getElementById("output_log").textContent += ("Day " + player.age + ": Level " + player.level + "\n");
        }
    }
    if (player.level < 200 && (player.dpstart >= 200 || player.dpend < 200)) {
        player.level = 200;
        player.age++;
        player.clearedDungeonsUntil = 199;
        if (write) {
            document.getElementById("output_log").textContent += ("Day " + player.age + ": Level " + player.level + "\n");
        }
    }

    //real simulator
    while (player.goallvl > player.level && player.age < 10000) {
        simDaily(player, write);
    }
    if (write) {
        document.getElementById("output_log").textContent += "\n-------------------------------------\n\n";
    }
    return player.age;
}

//sim daily xp gain
function simDaily(player, write) {
    player.age++;
    player.addXp(getDailyXp(player), write);
    doDungeons(player, write);
}

//returns the earliest level you can push dungeons to reach goallvl
function getEndLvl(player) {
    let tempplayer = clone(player);
    tempplayer.dpend = 1000;

    //part before dungeonpause
    while (tempplayer.level < tempplayer.dpstart && tempplayer.age < 10000) {
        simDaily(tempplayer, false);
    }

    let dungeonsplayer = clone(tempplayer);
    dungeonsplayer.dpend = 0;
    let possibleXp = doDungeons(dungeonsplayer, false);
    //part during dungeonpause
    while ((possibleXp < getRemainungXp(tempplayer)) && tempplayer.age < 10000) {
        tempplayer.age++;        
        tempplayer.addXp(getDailyXp(tempplayer), false);
        dungeonsplayer = clone(tempplayer);
        dungeonsplayer.dpend = 0;
        possibleXp = doDungeons(dungeonsplayer, false);
    }   

    return getDecimalLevel(tempplayer.level, tempplayer.xp);
}

//returns the number of days to reach a lvl with optimal dp
function getOptDp(player) {
    let daysopt = 10000;
    let startopt = 0;
    let endopt = 0;
    
    for (let startlvl = Math.max(player.level, 250); startlvl < Math.min(player.goallvl, 451); startlvl++) {
       
       let tempplayer = clone(player);
       tempplayer.dpstart = startlvl;
       tempplayer.dpend = getEndLvl(tempplayer);
       let days = getDays(tempplayer, false);
       document.getElementById("output_log").textContent += tempplayer.dpstart + " - " + Math.floor(tempplayer.dpend) + ", " + days + " Days\n";
    
       if (days <= daysopt) {
           daysopt = days;
           startopt = tempplayer.dpstart;
           endopt = tempplayer.dpend;
       }
    }

    player.dpstart = startopt;
    player.dpend = endopt;
    document.getElementById("output_log").textContent += "\n-------------------------------------\n\nOptimal: " + startopt + " - " + Math.round(100 * endopt)/100 + " in " + daysopt + " Days:" + "\n";
    getDays(player, true);

    endopt = Math.floor(endopt);
    return {
        daysopt: daysopt,
        startopt: startopt,
        endopt: endopt
    };
}