let currentMonth = new Date().getMonth(); // 현재 월 (0~11)
let currentYear = new Date().getFullYear(); // 현재 년도
let selectedDate = null; // 선택된 날짜

// 날짜 변경 시 캘린더 갱신
function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// 캘린더 업데이트
function updateCalendar() {
    const monthYear = document.getElementById('month-year');
    monthYear.textContent = `${currentYear}년 ${currentMonth + 1}월`;

    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = ''; // 기존 일자 지우기

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 첫날의 요일

    // 빈 칸 추가 (첫날이 시작되는 요일까지)
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;
        dayDiv.dataset.date = `${currentYear}-${currentMonth + 1}-${day}`;

        // 일정이 있으면 강조
        const schedules = getSchedulesForDate(dayDiv.dataset.date);
        if (schedules.length > 0) {
            dayDiv.classList.add('schedule');
        }

        // 클릭 시 일정 추가/수정
        dayDiv.addEventListener('click', openModal);

        calendarDays.appendChild(dayDiv);
    }
}

// 일정 관리 (로컬 저장소 사용)
function getSchedulesForDate(date) {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || {};
    return schedules[date] || [];
}

// 모달 열기
function openModal(event) {
    selectedDate = event.target.dataset.date;
    const schedules = getSchedulesForDate(selectedDate);

    // 일정 리스트와 입력란 초기화
    const input = document.getElementById('schedule-input');
    input.value = schedules.join('\n');
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = schedules.map(schedule => `<p>${schedule}</p>`).join('');

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

// 일정 저장
function saveSchedule() {
    const input = document.getElementById('schedule-input');
    const scheduleText = input.value.trim().split('\n');
    const schedules = JSON.parse(localStorage.getItem('schedules')) || {};

    schedules[selectedDate] = scheduleText;
    localStorage.setItem('schedules', JSON.stringify(schedules));

    closeModal();
    updateCalendar();
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// 초기 캘린더 로딩
updateCalendar();
