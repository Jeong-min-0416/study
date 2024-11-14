package com.example.study.domain.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // 메인 페이지
    @GetMapping("/")
    public String mainPage() {
        return "main";  // templates/main.html
    }

    // 달력 페이지
    @GetMapping("/calendar")
    public String calendarPage(Model model) {
        return "calendar";  // templates/calendar.html
    }
}
