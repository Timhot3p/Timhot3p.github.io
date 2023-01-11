function calc() {
    document.getElementById("result_dp").textContent = "It will take you X days to reach level " + document.getElementById("goal_lvl").value + ".";
    document.getElementById("result_normal").textContent = "Without dungeonpause it would take you Y days.";
    document.getElementById("result_opt").textContent = "Optimal time to reach level " + document.getElementById("goal_lvl").value + " would be Z days, by doing a dungeonpause between level A and level B.";
    document.getElementById("output_log").textContent = "Day 1: Level 25 \n... \nDay X: Level " + document.getElementById("goal_lvl").value;
}

// example player
//
//var player = {
//    level: 0,
//    xp: 0,
//    day: 0,
//    dpstart: 0,
//    dpend: 0
//}


//checks if a player lvled up
function checkLvlUp(player) {
    return false;
}

//executes the lvlup for a player, writes to log
function doLvlUp(player) {
}

//collects all daily xp and adds them together, checks for xp event
function getDailyXp(player) {
    return 0;
}

//daily xp from thirst ignoring events
function getDailyXpThirst(level) {
    return 0;
}

//daily xp from arena ignoring events
function getDailyXpArena(level) {
    return 0;
}

//daily xp from calendar considering the day
function getDailyXpCalendar(level, day) {
    return 0;
}

//daily xp of the daily secret mission ignoring events
function getDailyXpMission(level) {
    return 0;
}

//daily xp of the guild fight ignoring events
function getDailyXpGuildfight(level) {
    return 0;
}

//daily xp of academy ignoring events
function getDailyXpAcademy(level) {
    return 0;
}

//daily xp of wheel ignoring events
function getDailyXpWheel(level) {
    return 0;
}

//xp of dungeons possible considering a players level, writes to log
function getXpDungeon(level) {
    return 0;
}

//returns the number of days to reach a lvl without dp
function getNoDp(goalLevel) {
    return 0;
}

//returns the number of days to reach a lvl with optimal dp
function getOptDp(goalLevel) {
    return 0;
}

//returns the number of days to reach a lvl with dp
function getDp(player, goalLevel) {
    return 0;
}