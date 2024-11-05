// Leave limits for each course
const leaveLimits = {
    chemistry: 12,
    astronomy: 8,
    biology: 12,
    physics: 16,
    math: 99999,
    englishForDevelopment: 12,
    thai: 8,
    computer: 4,
    healthEducation: 4,
    art: 4,
    englishMaster: 8,
    englishTE: 4,
    library: 4,
    agriculture: 4,
    social: 8
};

// Tracker for the number of leaves taken for each course
const leaveCounts = {};

// Initialize leaveCounts from Local Storage
function initializeLeaveCounts() {
    const storedCounts = localStorage.getItem('leaveCounts');
    if (storedCounts) {
        Object.assign(leaveCounts, JSON.parse(storedCounts));
    } else {
        for (const course in leaveLimits) {
            leaveCounts[course] = 0; // Default to 0 if no data
        }
    }
}

// Course deductions by day
const dailyDeductions = {
    monday: { chemistry: 2, healthEducation: 1, englishMaster: 1, art: 1, thai: 1, social: 1 },
    tuesday: { englishMaster: 1, chemistry: 1, astronomy: 2, biology: 1, social: 1, math: 1 },
    wednesday: { physics: 2, math: 1, agriculture: 1, englishTE: 1, library: 1 },
    thursday: { physics: 2, math: 1, englishForDevelopment: 2 },
    friday: { biology: 2, thai: 1, englishForDevelopment: 1 }
};

// Function to update the summary section
function updateSummary() {
    const summaryList = document.getElementById("summary-list");
    summaryList.innerHTML = ""; // Clear existing summary

    for (let course in leaveLimits) {
        const remainingLeaves = leaveLimits[course] - leaveCounts[course];
        
        const summaryItem = document.createElement("li");
        summaryItem.textContent = `${course}: ${remainingLeaves} ครั้งที่สามารถลาได้`;
        
        summaryList.appendChild(summaryItem);
    }

    // Update Local Storage
    localStorage.setItem('leaveCounts', JSON.stringify(leaveCounts));
}

// Function to add leave for the selected day
// Function to add leave for the selected day
function addLeaveForSelectedDay() {
    const selectedDay = document.getElementById("leave-day").value;

    if (selectedDay && dailyDeductions[selectedDay]) {
        // Check if any course has reached its leave limit for the selected day
        let canDeductLeaves = true;

        for (let course in dailyDeductions[selectedDay]) {
            const deduction = dailyDeductions[selectedDay][course];
            if (leaveCounts[course] + deduction > leaveLimits[course]) {
                canDeductLeaves = false; // At least one course has reached its limit
                break; // No need to check further
            }
        }

        if (canDeductLeaves) {
            // If all courses can deduct leaves, proceed with the deductions
            for (let course in dailyDeductions[selectedDay]) {
                const deduction = dailyDeductions[selectedDay][course];
                leaveCounts[course] += deduction;

                const listItem = document.createElement("li");
                listItem.textContent = `Course: ${course}, Day: ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} (Leaves taken: ${leaveCounts[course]} / ${leaveLimits[course]})`;

                document.getElementById("leave-list").appendChild(listItem);
            }

            updateSummary();
        } else {
            alert("มี 1 หรือมากกว่า 1 วิชาที่วันหยุดครบแล้ว ถ้ามึงจะหยุดก็ติด มส. แล้วแต่ละกัน");
        }
    } else {
        alert("Please select a valid day!");
    }
}


// Function to add leave for the selected course
function addLeaveForSelectedCourse() {
    const selectedCourse = document.getElementById("course").value;

    if (selectedCourse) {
        if (leaveCounts[selectedCourse] < leaveLimits[selectedCourse]) {
            leaveCounts[selectedCourse] += 1;

            const listItem = document.createElement("li");
            listItem.textContent = `Course: ${selectedCourse} (Leaves taken: ${leaveCounts[selectedCourse]} / ${leaveLimits[selectedCourse]})`;
            
            document.getElementById("leave-list").appendChild(listItem);
            updateSummary();
        } else {
            alert(`วันหยุดครบแล้วสำหรับวิชา ${selectedCourse}. หยุดไม่ได้แล้วนะจ้ะ มาเรียนๆ`);
        }
    } else {
        alert("Please select a valid course!");
    }
}

// Function to reset leave counts
function resetLeaveCounts() {
    for (const course in leaveCounts) {
        leaveCounts[course] = 0; // Reset each course's leave count to 0
    }

    updateSummary(); // Update the summary after resetting
    document.getElementById("leave-list").innerHTML = ""; // Clear the leave tracker list
}

// Event listeners for buttons
document.getElementById("add-leave-day").addEventListener("click", addLeaveForSelectedDay);
document.getElementById("add-leave-course").addEventListener("click", addLeaveForSelectedCourse);

// Event listener for the reset button
document.getElementById("reset-leave").addEventListener("click", function() {
    if (confirm("นี่คือการรีเซ็ทจำนวนการลา และไม่สามารถย้อนกลับได้ แน่ใจไหม?")) {
        resetLeaveCounts();
    }
});

// Initialize leave counts on page load
initializeLeaveCounts();
updateSummary();
