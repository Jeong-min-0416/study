package com.example.study;

import com.example.study.domain.entity.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class StudyApplication implements CommandLineRunner {

	@Autowired
	private EntityManager em;

	public static void main(String[] args) {
		SpringApplication.run(StudyApplication.class, args);
	}

	//	========================
	//		    JPQA 📚
	//	=========================

	@Override
	@Transactional
	public void run(String... args) {
		try {
			Member findMember = em.find(Member.class, 2L);

			findMember.setName("HelloJPA");

		} catch (Exception e){
			em.close(); // 엔터티 닫기
		}
	}



	//	========================
	//		     JPA 📚
	//	=========================

	// 수정
	@Override
	@Transactional
	public void run(String... args) {
		try {
			Member findMember = em.find(Member.class, 2L);

			findMember.setName("HelloJPA");

		} catch (Exception e){
			em.close(); // 엔터티 닫기
		}
	}

//	// 삭제
//	@Override
//	@Transactional
//	public void run(String... args) {
//		try {
//			Member findMember = em.find(Member.class, 1L);
//
//			em.remove(findMember);
//
//		} catch (Exception e){
//			em.close(); // 엔터티 닫기
//		}
//	}

//	// 조회
//	@Override
//	@Transactional
//	public void run(String... args) {
//		try {
//			Member findMember = em.find(Member.class, 1L);
//			System.out.println("findMember Id : " + findMember.getId());
//			System.out.println("findMember Name : " + findMember.getName());
//			System.out.println("findMember Email : " + findMember.getEmail());
//
//		} catch (Exception e){
//			em.close(); // 엔터티 닫기
//		}
//	}

//	// 셍성
//	@Override
//	@Transactional // EntityManagerFactory, EntityTransaction 대체 가능
//	public void run(String... args) {
//		try {
//			Member member = new Member(); // 생성
//
//			// 세팅
//			member.setId(3L);
//			member.setName("HelloB");
//			member.setEmail("hello@jpa.com");
//
//			em.persist(member); // 저장
//
//		} catch (Exception e){
//			em.close(); // 엔터티 닫기
//		}
//	}

}
