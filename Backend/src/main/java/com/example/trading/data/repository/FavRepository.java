package com.example.trading.data.repository;

import com.example.trading.data.entity.Fav;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavRepository extends JpaRepository<Fav, Integer> {
    List<Fav> findStockByMailid(String mailid);
}
