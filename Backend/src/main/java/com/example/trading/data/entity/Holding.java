package com.example.trading.data.entity;

import javax.persistence.*;

@Entity
@Table(name="holding")
public class Holding {
    @Id
    @Column(name="holdingid")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int holdingid;

    @Column(name="mailid")
    private String mailid;

    @Column(name="stock")
    private String stock;

    @Column(name="price", columnDefinition="Decimal(20, 2)", scale=2)
    private double price;

    @Column(name="amount")
    private int amount;

    public Holding() {

    }

    public Holding(int holdingid, String mailid, String stock, double price, int amount) {
        this.holdingid = holdingid;
        this.mailid = mailid;
        this.stock = stock;
        this.price = price;
        this.amount = amount;
    }

    public int getHoldingid() {
        return holdingid;
    }

    public void setHoldingid(int holdingid) {
        this.holdingid = holdingid;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
