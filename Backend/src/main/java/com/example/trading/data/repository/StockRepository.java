package com.example.trading.data.repository;

import com.example.trading.data.entity.Stocks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stocks, Integer> {
    List<Stocks> findStockByMailid(String mailid);

    List<Stocks> findByMailidOrderByEventtimeDesc(String mailid);

    List<Stocks> findByMailidOrderByEventtime(String mailid);

    List<Stocks> findByMailidOrderByAmountDesc(String mailid);

    List<Stocks> findByMailidOrderByAmount(String mailid);
    
    List<Stocks> findByMailidOrderByStock(String mailid);

    List<Stocks> findByMailidOrderByStockDesc(String mailid);

    List<Stocks> findByMailidOrderByCatagoryDesc(String mailid);

    List<Stocks> findByMailidOrderByCatagory(String mailid);

    List<Stocks> findByMailidOrderByPriceDesc(String mailid);

    List<Stocks> findByMailidOrderByPrice(String mailid);
}
