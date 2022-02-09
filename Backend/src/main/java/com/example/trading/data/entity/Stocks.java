package com.example.trading.data.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="stocks")
public class Stocks {
    @Id
    @Column(name="transactid")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int transactid;

    @Column(name="mailid")
    private String mailid;

    @Column(name="stock")
    private String stock;

    @Column(name="catagory")
    private String catagory;

    @Column(name="amount")
    private int amount;

    @Column(name="price", columnDefinition="Decimal(20, 2)", scale=2)
    private double price;

    @Column(name="eventtime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date eventtime;

    public Stocks(){

    }

    public Stocks(int transactid, String mailid, String stock, String catagory, int amount, double price, Date eventtime) {
        this.transactid = transactid;
        this.mailid = mailid;
        this.stock = stock;
        this.catagory = catagory;
        this.amount = amount;
        this.price = price;
        this.eventtime = eventtime;
    }

    public long getTransactid() {
        return transactid;
    }

    public void setTransactid(int transactid) {
        this.transactid = transactid;
    }

    public String getMailid() {
        return mailid;
    }

    public void setMailid(String mailid) {
        this.mailid = mailid;
    }

    public String getStock() {
        return stock;
    }

    public void setStock(String stock) {
        this.stock = stock;
    }

    public String getCatagory() {
        return catagory;
    }

    public void setCatagory(String catagory) {
        this.catagory = catagory;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Date getEventtime() {
        return eventtime;
    }

    public void setEventtime(Date eventtime) {
        this.eventtime = eventtime;
    }
}
