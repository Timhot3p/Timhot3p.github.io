function calc() {
    document.getElementById("result_dp").textContent = "It will take you X days to reach level " + document.getElementById("goal_lvl").value + ".";
    document.getElementById("result_normal").textContent = "Without dungeonpause it would take you Y days.";
    document.getElementById("result_opt").textContent = "Optimal time to reach level " + document.getElementById("goal_lvl").value + " would be Z days, by doing a dungeonpause between level A and level B.";
    document.getElementById("output_log").textContent = "Day 1: Level 25 \n... \nDay X: Level " + document.getElementById("goal_lvl").value;
}