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
                        if (scoreParts.length < 2) return;

                        let obtained = parseFloat(scoreParts[0]);
                        let maximum = parseFloat(scoreParts[1]);

                        if (!isNaN(obtained) && !isNaN(maximum)) {
                            if (e.firstChild.textContent.includes("Passed Tests")) passed += obtained;
                            total += maximum;
                        }
                    });
                }
            });

            document.querySelectorAll(".submissionOutline--section").forEach(e => {
                // too lazy to check if heading actually re-mounts on score list update so I'm just using this cuz it works
                if (e.firstChild.textContent.includes("Passed Tests")) e.firstChild.textContent = `Passed Tests (${Math.round(passed * 100) / 100}/${Math.round(total * 100) / 100})`;
                else if (e.firstChild.textContent.includes("Failed Tests")) e.firstChild.textContent = `Failed Tests (${Math.round((total - passed) * 100) / 100}/${Math.round(total * 100) / 100})`;
            });
        }
        catch (error) {
            console.error("Tampermonkey score calculator script had a stroke: ", error);
        }

        setTimeout(updateTestCounts, 100); // scuffed but just spam this every 100ms
    }

    updateTestCounts();
})();
