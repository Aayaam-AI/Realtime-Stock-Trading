package com.example.trading.data.entity;

import javax.persistence.*;

@Entity
@Table(name="fav")
public class Fav {
    @Id
    @Column(name="favid")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int favid;

    @Column(name="mailid")
    private String mailid;

    @Column(name="stock")
    private String stock;

    public Fav(){

    }

    public Fav(int favid, String mailid, String stock) {
        this.favid = favid;
        this.mailid = mailid;
        this.stock = stock;
    }

    public long getFavid() {
        return favid;
    }

    public void setFavid(int favid) {
        this.favid = favid;
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
}
