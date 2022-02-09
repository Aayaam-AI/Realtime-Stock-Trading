package com.example.trading.data.repository;

import com.example.trading.data.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Integer> {
    List<Holding> findAllByMailid(String mailid);
}
