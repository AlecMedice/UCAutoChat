// ==UserScript==
// @name        PAUC Automatic Chat
// @namespace   Violentmonkey Scripts
// @match       https://www.uc.pa.gov/Chat/index.aspx
// @grant       none
// @version     1.1
// @author      Alec Medice
// @description Refreshes and re-enters information automatically if the chat is ended due to large volumes of requests
//              Based off of script from /u/Computer_Mutt from /r/Pennsylvania
// ==/UserScript==

// Personal detail fields
const FIRST = "First Name";
const LAST = "Last Name";
const EMAIL = "email@website.com";
const PHONE = "(123)-456-7890";

//Subject sets the pre-determined subjects assigned by PAUC.
/*
 * 1 = Initial Claim
 * 2 = Payment Information
 * 3 = Registration, Work Search
 * 4 = Eligibility Question
 * 5 = How to File an Appeal
 * 6 = Overpayment Question
 * 7 = TAA
 * 8 = TRA
 * 9 = DUA
 * 10 = Other
 */
const SUBJECT = 1;

/*
 *******************************************************************************
 Do not change anything from here on unless you know what you're doing
 *******************************************************************************
 */
//These are the automatic chat functions sent by the chat service.  If "Chat Ended" is found, it has automatically kicked us off
const BSCHAT = [
    "Welcome to the new PA Unemployment Compensation chat service.",
    "Chat is available Monday – Friday, 8 a.m. - 5 p.m.   An Unemployment Compensation Chat Agent will be with you shortly.",
    "We are experiencing a much higher than normal volume. An Unemployment Compensation Chat Agent will be with you shortly.",
    "All of our chat agents are busy assisting other customers. We are unable to process your chat request at this time. Please try again later.",
    "Chat Ended"
];
const CHATENDPROMPT = "Chat Ended";

// Setting timeouts to listen for messages and filling preformed data
setTimeout(function () {
    document.querySelector("#click").click();
    setTimeout(FillDetails, 2000);
    setTimeout(StartChat, 3000);
    setInterval(ListenMessages, 2500);
}, 1000);

// Finds the elements on the page and loads our predefined values
function FillDetails() {
    document.getElementById("cx_custom_form_firstname").value = FIRST;
    document.getElementById("cx_custom_form_lastname").value = LAST;
    document.getElementById("cx_custom_form_email").value = EMAIL;
    document.getElementById("cx_custom_form_phone").value = PHONE;
    document.getElementById("cx_custom_form_subject").selectedIndex = SUBJECT;
}

//Clicks the start chat button
function StartChat() {
    var aTags = document.getElementsByTagName("button");
    var searchText = "Start Chat";
    var found;
    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    found.click();
}

//Listens for messages
function ListenMessages() {
    StartChat();
    var liveMsgs = document.getElementsByClassName("message-text");

    for (var i = 0; i < liveMsgs.length; i++) {
        if (!BSCHAT.includes(liveMsgs[i].textContent)) {
            console.log("Possible Chat Session Detected! STOPPING SCRIPT")
            clearInterval()
            alert("Possible Chat Session Detected!");
            break;
        }

        if (liveMsgs[i].textContent == CHATENDPROMPT) {
            console.log("CHAT ENDING DETECTED RELOADING AND TRYING AGAIN...")
            clearInterval();
            setTimeout(function () {
                Refresh();
            }, 1000);
        }
    }
}

//Refreshes page
function Refresh() {
    clearInterval();
    location.reload();
}
