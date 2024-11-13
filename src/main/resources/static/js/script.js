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
    updateModalSchedule(date);  // 모달 내 일정 업데이트
}

// 일정 수정 함수
function editSchedule(date, index) {
    const newScheduleText = prompt("수정할 일정을 입력하세요:", scheduleData[date][index]);

    if (newScheduleText !== null && newScheduleText.trim() !== "") {
        // 수정된 일정 저장
        scheduleData[date][index] = newScheduleText.trim();

        // 변경된 일정만 캘린더에 반영
        renderCalendar(); // 캘린더 새로 그리기
        updateModalSchedule(date);  // 모달 내용 업데이트
    }
}

// 일정 삭제 함수
function deleteSchedule(date, index) {
    scheduleData[date].splice(index, 1); // 해당 일정 삭제

    // 삭제 후 캘린더 미리보기 및 모달 갱신
    renderCalendar();  // 캘린더 새로 그리기
    updateModalSchedule(date);  // 모달 내용 업데이트
}

// 일정 저장 버튼
function saveSchedule() {
    const scheduleInput = document.getElementById("schedule-input");
    const scheduleText = scheduleInput.value.trim();

    const selectedDateElement = document.querySelector(".calendar-day.selected");
    if (!selectedDateElement) {
        alert("날짜를 선택해주세요.");
        return;
    }

    const selectedDate = selectedDateElement.dataset.date;

    if (scheduleText) {
        addSchedule(selectedDate, scheduleText);  // 일정 추가
        scheduleInput.value = "";  // 일정 입력창 초기화
        closeModal();  // 모달 닫기
    }
}

// 날짜 클릭 시 'selected' 클래스 추가
function selectDate(dayElement) {
    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));  // 기존 선택된 날짜 제거
    dayElement.classList.add('selected');  // 클릭한 날짜에 'selected' 클래스 추가
}

// 일정 모달 열기
function openModal(date) {
    const scheduleInput = document.getElementById("schedule-input");
    const existingSchedules = scheduleData[date] || [];
    const scheduleList = document.getElementById("schedule-list");

    // 기존 일정 표시
    updateModalSchedule(date);  // 일정 목록 업데이트

    // 모달 열기
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
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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
            <div class="calendar-day ${hasScheduleClass}" data-date="${dateStr}" onclick="selectDate(this); openModal('${dateStr}')">
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

// 모달 내 일정 갱신 함수
function updateModalSchedule(date) {
    const scheduleList = document.getElementById("schedule-list");
    const existingSchedules = scheduleData[date] || [];

    // 기존 일정 표시
    scheduleList.innerHTML = existingSchedules
        .map((schedule, index) =>
            `<div class="schedule-item">
                 <!-- 수정 버튼 -->
                 <button class="edit-btn" onclick="editSchedule('${date}', ${index})">수정</button>

                 <div>${schedule}</div>

                 <!-- 삭제 버튼 -->
                 <button class="delete-btn" onclick="deleteSchedule('${date}', ${index})">삭제</button>
             </div>`
        )
        .join("");

    // 일정이 없으면 '일정 없음' 메시지 표시
    if (existingSchedules.length === 0) {
        scheduleList.innerHTML = "<div class='no-schedule'>일정이 없습니다.</div>";
    }
}

// 초기 렌더링
renderCalendar();
