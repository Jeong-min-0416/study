// 날짜별 일정 저장 객체
const scheduleData = {};

// 현재 선택된 월과 연도
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// 월/연도 표시 엘리먼트
const monthYearDisplay = document.getElementById("month-year");
const calendarDaysContainer = document.getElementById("calendar-days");

// 일정 저장 함수
function addSchedule(date, scheduleText) {
    if (!scheduleData[date]) {
        scheduleData[date] = [];
    }
    scheduleData[date].push(scheduleText);
    renderCalendar();  // 캘린더 새로 그리기
}

// 일정 삭제 함수
function deleteSchedule(date, index) {
    scheduleData[date].splice(index, 1); // 해당 일정 삭제
    renderCalendar();  // 캘린더 새로 그리기
}

// 일정 저장 버튼
function saveSchedule() {
    const scheduleInput = document.getElementById("schedule-input");
    const scheduleText = scheduleInput.value.trim();
    if (scheduleText) {
        const selectedDate = document.querySelector(".calendar-day.selected").dataset.date;
        addSchedule(selectedDate, scheduleText);
        scheduleInput.value = "";  // 일정 입력창 초기화
        closeModal();  // 모달 닫기
    }
}

// 일정 모달 열기
function openModal(date) {
    const scheduleInput = document.getElementById("schedule-input");
    const existingSchedules = scheduleData[date] || [];
    const scheduleList = document.getElementById("schedule-list");

    // 기존 일정 표시 (세로로 나열되도록 flex 사용)
    scheduleList.innerHTML = existingSchedules
        .map((schedule, index) =>
            `<div class="schedule-item">
                <div>${schedule}</div>
                <button class="delete-btn" onclick="deleteSchedule('${date}', ${index})">삭제</button>
            </div>`
        )
        .join("");

    document.getElementById("modal").style.display = "flex";
}

// 모달 닫기
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 이전/다음 달로 이동
function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// 달력 렌더링 함수
function renderCalendar() {
    // 날짜 표시를 위한 현재 월의 첫날과 마지막 날짜 계산
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    let calendarDaysHTML = "";

    // 첫 주의 빈 칸
    for (let i = firstDayOfMonth; i > 0; i--) {
        calendarDaysHTML += `<div class="calendar-day empty"></div>`;
    }

    // 이번 달의 날짜들
    for (let day = 1; day <= lastDateOfMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const schedules = scheduleData[dateStr] || [];
        const hasScheduleClass = schedules.length > 0 ? "has-schedule" : "";

        calendarDaysHTML += `
            <div class="calendar-day ${hasScheduleClass}" data-date="${dateStr}" onclick="openModal('${dateStr}')">
                <span>${day}</span>
                <div class="schedule-preview-container">
                    ${schedules.slice(0, 2).map(schedule =>
                        `<div class="schedule-preview">${schedule}</div>`
                    ).join('')}
                    ${schedules.length > 2 ?
                        `<div class="schedule-preview">...</div>`
                        : ''}
                </div>
            </div>
        `;
    }

    // 이후 달의 빈 칸
    const remainingDays = 42 - (calendarDaysHTML.match(/calendar-day/g) || []).length;
    for (let i = 0; i < remainingDays; i++) {
        calendarDaysHTML += `<div class="calendar-day empty"></div>`;
    }

    // 캘린더 그리기
    calendarDaysContainer.innerHTML = calendarDaysHTML;

    // 월/연도 표시
    monthYearDisplay.textContent = `${currentYear}년 ${currentMonth + 1}월`;
}

// 초기 렌더링
renderCalendar();
