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
    renderCalendar();
}

// 현재 달력 날짜 표시
function renderCalendar() {
    const monthYearLabel = document.getElementById('month-year');
    const calendarDays = document.getElementById('calendar-days');
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startingDay = firstDayOfMonth.getDay(); // 첫 번째 날의 요일 (0=일요일, 6=토요일)

    // 달력 헤더에 월과 연도 표시
    monthYearLabel.textContent = `${currentYear}년 ${currentMonth + 1}월`;

    // 날짜 그리기
    calendarDays.innerHTML = ''; // 기존 날짜 지우기
    for (let i = 0; i < startingDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendarDays.appendChild(emptyDiv);
    }

    // 날짜 추가
    for (let date = 1; date <= lastDateOfMonth; date++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = date;

        // 로컬 스토리지에서 일정 확인
        const savedSchedules = JSON.parse(localStorage.getItem(`schedule-${currentYear}-${currentMonth + 1}-${date}`)) || [];
        if (savedSchedules.length > 0) {
            dayDiv.classList.add('schedule'); // 일정이 있으면 강조
        }

        // 날짜 클릭 시 일정 추가/보기
        dayDiv.addEventListener('click', () => openModal(date));

        calendarDays.appendChild(dayDiv);
    }
}

// 일정 추가/저장
function saveSchedule() {
    const scheduleInput = document.getElementById('schedule-input');
    const scheduleText = scheduleInput.value.trim();

    if (!scheduleText) {
        alert('일정을 입력하세요.');
        return;
    }

    const schedules = JSON.parse(localStorage.getItem(`schedule-${currentYear}-${currentMonth + 1}-${selectedDate}`)) || [];
    schedules.push(scheduleText);
    localStorage.setItem(`schedule-${currentYear}-${currentMonth + 1}-${selectedDate}`, JSON.stringify(schedules));

    renderCalendar();
    closeModal();
}

// 모달 열기
function openModal(date) {
    selectedDate = date;
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = ''; // 기존 일정 지우기

    const savedSchedules = JSON.parse(localStorage.getItem(`schedule-${currentYear}-${currentMonth + 1}-${date}`)) || [];

    savedSchedules.forEach((schedule, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');

        const scheduleText = document.createElement('p');
        scheduleText.textContent = schedule;
        scheduleItem.appendChild(scheduleText);

        // 일정 삭제 버튼
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', () => deleteSchedule(index));
        scheduleItem.appendChild(deleteButton);

        scheduleList.appendChild(scheduleItem);
    });

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

// 일정 삭제
function deleteSchedule(index) {
    const schedules = JSON.parse(localStorage.getItem(`schedule-${currentYear}-${currentMonth + 1}-${selectedDate}`)) || [];
    schedules.splice(index, 1);
    localStorage.setItem(`schedule-${currentYear}-${currentMonth + 1}-${selectedDate}`, JSON.stringify(schedules));
    renderCalendar();
    openModal(selectedDate); // 모달 갱신
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// 초기 달력 렌더링
renderCalendar();
