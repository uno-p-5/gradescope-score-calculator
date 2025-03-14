// ==UserScript==
// @name         Gradescope Score Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Showws you how many you passed/failed so you don't have to do it manually
// @author       uno-p-5
// @match        https://www.gradescope.com/courses/*/assignments/*/submissions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function updateTestCounts() {
        try {
            let total = 0;
            let passed = 0;

            document.querySelectorAll(".submissionOutline--section").forEach(e => {
                if (e.firstChild.textContent.includes("ed Tests")) {
                    Array.from(e.children[1].children).forEach(c => {
                        let scoreString = c.textContent.split('(').splice(-1)[0].split(')')[0];
                        let scoreParts = scoreString.split('/');
                        if (scoreParts.length != 2) return;

                        let obtained = parseFloat(scoreParts[0]);
                        let maximum = parseFloat(scoreParts[1]);

                        if (!isNaN(obtained) && !isNaN(maximum)) {
                            passed += obtained;
                            total += maximum;
                        }
                    });
                }
            });

            // scuffed af but it works
            const agScoreDiv = document.querySelector("div.submissionOutlineHeader--totalPoints");
            if (agScoreDiv && agScoreDiv.textContent) {
                let scoreParts = agScoreDiv.textContent.split(' / ');
                if (scoreParts.length != 2) return;
                if (!scoreParts[0].includes('-')) return; // score already filled
                agScoreDiv.textContent = (Math.round(passed * 100) / 100).toString() + ' / ' + scoreParts[1];
            }
        }
        catch (error) {
            console.error("Tampermonkey score calculator script had a stroke: ", error);
        }

        setTimeout(updateTestCounts, 100); // scuffed but just spam this every 100ms
    }

    updateTestCounts();
})();
