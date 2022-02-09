package com.example.trading.data.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="auth")
public class User {
    @Id
    @Column(name="mailid")
    private String mailid;

    @Column(name="uname")
    private String uname;

    @Column(name="upass")
    private String upass;

    @Column(name="wallet", columnDefinition="Decimal(20, 2)", scale=2)
    private double wallet;

    @Column(name="invested", columnDefinition="Decimal(20, 2)", scale=2)
    private double invested;

    public User() {

    }

    public User(String mailid, String uname, String upass) {
        this.mailid = mailid;
        this.uname = uname;
        this.upass = upass;
        this.wallet = 0;
        this.invested = 0;
    }

    public User(String mailid, String uname, String upass, double wallet, double invested) {
        this.mailid = mailid;
        this.uname = uname;
        this.upass = upass;
        this.wallet = wallet;
        this.invested = invested;
    }

    public String getMailid() {
        return mailid;
    }

    public void setMailid(String mailid) {
        this.mailid = mailid;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getUpass() {
        return upass;
    }

    public void setUpass(String upass) {
        this.upass = upass;
    }

    public double getWallet() {
        return wallet;
    }

    public void setWallet(double wallet) {
        this.wallet = wallet;
    }

    public double getInvested() {
        return invested;
    }

    public void setInvested(double invested) {
        this.invested = invested;
    }

    @Override
    public String toString() {
        return "User[" +
                "mailid='" + mailid + '\'' +
                ", uname='" + uname + '\'' +
                ", upass='" + upass + '\'' +
                ", wallet=" + wallet +
                ", invested=" + invested +
                ']';
    }
}
