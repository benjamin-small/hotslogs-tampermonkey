// ==UserScript==
// @name         HotsLogs Profile Page
// @namespace    http://www.hotslogs.com/
// @version      0.1
// @description  Modifications to the profile page
// @author       BSmall
// @match        http://www.hotslogs.com/Player/Profile?PlayerID=*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Copy JQuery 
$ = window.$;

var role2char_map = {
    "tank" : ["Chen", "Cho", "Diablo", "E.T.C.", "Johanna", "Muradin", "Rexxar", "Stitches"],
    "bruiser": ["Anub'arak", "Artanis", "Arthas", "Leoric", "Sonya", "Tyrael"],
    "healer" : ["Brightwing", "Kharazim", "Li Li", "Lt. Morales", "Malfurion", "Rehgar", "Uther"],
    "support" : ["Tassadar", "Tyrande"],
    "ambusher" : ["Kerrigan", "Nova", "The Butcher", "Zeratul"],
    "burst damage" : ["Jaina", "Kael'thas"],
    "sustained damage" : ["Falstad", "Gall", "Greymane", "Illidan", "Lunara", "Nazeebo", "Raynor", "Thrall", "Tychus", "Valla"],
    "siege" :  ["Azmodan", "Gazlowe", "Sgt. Hammer", "Sylvanas", "Zagara"],
    "utility" : ["Abathur", "Murky", "The Lost Vikings"]
}

var char2role_map = {};

// Loop through all subroles
for (var role in role2char_map) {
    
    // Store the list of characters for this role
    var char_list = role2char_map[role];
    
    // For each character mapped to this subrole, add it to the char map
    for(var i = 0; i < char_list.length; i++) {
       char2role_map[char_list[i]] = role;
    }
}

// Global to keep track of the current selected sub_role
// Will be null if no sub_role is selected
var current_selected_sub_role = null;

function get_subrole_rows () {
    return $("table[id=\"DataTables_Table_1\"").children("tbody").children("tr");
}

function get_character_rows() {
    return $("#ctl00_MainContent_RadGridCharacterStatistics_ctl00").children("tbody").children("tr");
}

function select_subrole () {
    
    // Strikeout unselected subroles
    $.each(get_subrole_rows(), function() {
        
        // The first TD contains the sub role name
        var sub_role_td = $(this).children("td").children(0);
        var iter_sub = $(sub_role_td).text().toLowerCase();
        
        // We don't strike out the current sub-role
        if(current_selected_sub_role != iter_sub) {
            $(sub_role_td).css("text-decoration", "line-through");
        }
    });
    
    // Hide characters not in this selected sub role
    $.each(get_character_rows(), function() {
        
        var char_row_sub_role = $(this).data('sub_role');

        if(char_row_sub_role == null) {
            console.log("Shit went way wrong, character row doesn't have a sub_role");
            return;
        }

        if(char_row_sub_role == current_selected_sub_role) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

function unselect_subrole () {
    
    // No more strikeout on any subroles
    $.each(get_subrole_rows(), function() {
        // The first TD contains the sub role name
        var sub_role_td = $(this).children("td").children(0);
        $(sub_role_td).css("text-decoration", "");
    });
    
    // Show all characters again
    $.each(get_character_rows(), function() {
        $(this).show();
    });
}

// Click handler for sub role table
function sub_role_click_handler () {
    var selected_sub = $(this).children(0).text().toLowerCase();
    
    if (current_selected_sub_role == selected_sub) {
        current_selected_sub_role = null;
        console.log("Clicked " + selected_sub + " twice, unselecting");
        unselect_subrole();
    }
    else {
        current_selected_sub_role = selected_sub;
        select_subrole();
        console.log("Clicked " + selected_sub + ", setting subrole");
    }
}

// Give the character rows the sub_role attribute
$.each(get_character_rows(), function() {
    // $(this) is the tr of the character row
    
    // The character name is stored in the second column inside an a tag
    var char_name = $(this).children(2).children("a").text();
    
    console.log("Got character name " + char_name);
    
    if(!(char_name in char2role_map)) {
        console.log("Shit went way bad, character " + char_name + " not in the map");
        return;
    }
    
    $(this).data("sub_role", char2role_map[char_name]);
});

// Add the subrole click handler
$.each(get_subrole_rows(), function() {
    $(this).children(0).click(sub_role_click_handler);
});

