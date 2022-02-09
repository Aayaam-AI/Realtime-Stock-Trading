package com.example.trading.web;

import com.example.trading.data.entity.Fav;
import com.example.trading.data.entity.Holding;
import com.example.trading.data.entity.Stocks;
import com.example.trading.data.entity.User;
import com.example.trading.data.repository.FavRepository;
import com.example.trading.data.repository.HoldingRepository;
import com.example.trading.data.repository.StockRepository;
import com.example.trading.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin
public class ApiController {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    UserRepository userRepository;
    @Autowired
    StockRepository stockRepository;
    @Autowired
    FavRepository favRepository;
    @Autowired
    HoldingRepository holdingRepository;

    // Authenticate user
    @GetMapping("/api/auth/{mailid}/{upass}")
    public User getUser(@PathVariable("mailid") String mailid, @PathVariable("upass") String upass){
        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));
        if(user.getMailid().equals("#")) {
            return user;
        }
        if(!Objects.equals(user.getUpass(), upass)){
            return new User("#", "#", "#");
        }
        return user;
    }

    // Create new user
    @PostMapping("api/createuser/{mailid}/{uname}/{upass}")
    public User getUser(@PathVariable("mailid") String mailid, @PathVariable("uname") String uname, @PathVariable("upass") String upass){
        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));
        if(!Objects.equals(user.getMailid(), "#")) {
            return new User("exists", "#", "#");
        }
        try{
            jdbc.update("Insert into auth values (?, ?, ?, 0, 0)", mailid, uname, upass);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("#", "#", "#");
        }
        user.setMailid(mailid);
        user.setUname(uname);
        user.setUpass(upass);

        return user;
    }

    // Set a favourite stock for a particular user
    @PostMapping("api/markfav/{mailid}/{stock}")
    public Fav mark(@PathVariable("mailid") String mailid, @PathVariable("stock") String stock){
        Fav fav = new Fav();
        jdbc.update("insert into fav(mailid, stock) values (?, ?);" , mailid, stock);
        fav.setMailid(mailid);
        return fav;
    }

    // Remove favourite stock for a particular user
    @PostMapping("/api/unmarkfav/{mailid}/{stock}")
    public User unmark(@PathVariable("mailid") String mailid, @PathVariable("stock") String stock) {
        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));
        if(Objects.equals(user.getMailid(), "#")){
            return user;
        }
        try {
            jdbc.update("DELETE from fav WHERE mailid = ? AND stock = ?", mailid, stock);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("#", "#", "#");
        }
        return user;
    }

    // Get a list of favourite stock for a user
    @GetMapping("api/getFav/{mailid}")
    public List<Fav> getFav(@PathVariable("mailid") String mailid){
        return favRepository.findStockByMailid(mailid);
    }

    // Get user info
    @GetMapping("api/userinfo/{mailid}")
    public User getInfo(@PathVariable("mailid") String mailid){
        return userRepository.findById(mailid).orElse(new User("#", "#", "#"));
    }

    // Add money to wallet of a particular user
    @PostMapping("api/addmoney/{mailid}/{amount}")
    public User addMoney(@PathVariable("mailid") String mailid, @PathVariable("amount") double amount){
        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));
        if(Objects.equals(user.getMailid(), "#")){
            return user;
        }
        double updatedAmount = user.getWallet() + amount;
        try{
            jdbc.update("UPDATE auth SET wallet = ? where mailid = ?", updatedAmount, mailid);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("#", "#", "#");
        }
        user.setWallet(updatedAmount);
        return user;
    }

    // Withdraw money from wallet of a particular user
    @PostMapping("api/withdraw/{mailid}/{amount}")
    public User withdraw(@PathVariable("mailid") String mailid, @PathVariable("amount") double amount){
        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));
        if(Objects.equals(user.getMailid(), "#")){
            return user;
        }
        double updatedAmount = user.getWallet() - amount;
        try{
            jdbc.update("UPDATE auth SET wallet = ? where mailid = ?", updatedAmount, mailid);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("#", "#", "#");
        }
        user.setWallet(updatedAmount);
        return user;
    }

    // Buy a particular stock
    @PostMapping("api/buy/{mailid}/{stock}/{amount}/{price}")
    public User buyStock(@PathVariable("mailid") String mailid, @PathVariable("stock") String stock,
                         @PathVariable("amount") int amount, @PathVariable("price") double price){
        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));

        if(Objects.equals(user.getMailid(), "#")){
            return user;
        }
        double totalCost = amount*price;
        if(user.getWallet()<totalCost){
            user.setMailid("NotEnoughMoney");
            return user;
        }
        double newWalletAmount = user.getWallet() - totalCost;
        double invest = user.getInvested() + totalCost;

        try{
            jdbc.update("insert into holding(mailid, stock, price, amount) values (?, ?, ?, ?)", mailid, stock, price, amount);
            jdbc.update("insert into stocks(mailid, stock, catagory, amount, price) values (?,?,'buy',?,?)", mailid, stock, amount, price);
            jdbc.update("UPDATE auth SET wallet = ? , invested = ? WHERE mailid = ?" , newWalletAmount, invest, mailid);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("#", "#", "#");
        }
        user.setWallet(newWalletAmount);
        user.setInvested(invest);
        return user;
    }

    // Sell a particular stock
    @PostMapping("api/sell/{mailid}/{stock}/{amount}/{price}")
    public User sellStock(@PathVariable("mailid") String mailid, @PathVariable("stock") String stock,
                         @PathVariable("amount") int amount, @PathVariable("price") double price){

        User user = userRepository.findById(mailid).orElse(new User("#", "#", "#"));
        if(Objects.equals(user.getMailid(), "#")){
            return user;
        }
        Holding prevHolding = null;
        try {
            List<Holding> holdings = holdingRepository.findAllByMailid(mailid);
            for(Holding hld:holdings){
                  if(hld.getStock().equals(stock)){
                    prevHolding = hld;
                    break;
                }
            }
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("StockNotBought", "#", "#");
        }
        if(prevHolding==null) {
            return new User("StockNotBought", "#", "#");
        }
        double initialPrice = prevHolding.getPrice();
        int initialAmount = prevHolding.getAmount();
        if(amount > initialAmount){
            return new User("NotEnoughStocks", "#", "#");
        }
        int newAmount = initialAmount-amount;
        if(amount == initialAmount){
            jdbc.update("Delete from holding WHERE mailid = ? and stock = ?" , mailid, stock);
        }
        else{
            jdbc.update("UPDATE holding SET amount = ? WHERE mailid = ? and stock = ?" , newAmount, mailid, stock);
        }

        double totalCost = amount*price;
        double newWalletAmount = user.getWallet() + totalCost;
        double invest = user.getInvested() - amount*initialPrice;
        try{
            jdbc.update("insert into stocks(mailid, stock, catagory, amount, price) values (?,?,'sell',?,?)", mailid, stock, amount, price);
            jdbc.update("UPDATE auth SET wallet = ? , invested = ? WHERE mailid = ?" , newWalletAmount, invest, mailid);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new User("#", "#", "#");
        }
        user.setWallet(newWalletAmount);
        user.setInvested(invest);
        return user;
    }

    // Get list of holdings for a particular user
    @GetMapping("api/getholding/{mailid}")
    public List<Holding> getHoldings(@PathVariable("mailid") String mailid){
        return holdingRepository.findAllByMailid(mailid);
    }

    // Get list of transaction history for particular user
    @GetMapping("api/gethistory/{mailid}/{sortcol}/{type}")
    public List<Stocks> getHistory(@PathVariable("mailid") String mailid, @PathVariable("sortcol") String sortcol,
                                   @PathVariable("type") String type) {

        if(sortcol.equals("time")){
            if(type.equals("desc")){
                return stockRepository.findByMailidOrderByEventtimeDesc(mailid);
            }
            else{
                return stockRepository.findByMailidOrderByEventtime(mailid);
            }
        }
        else if(sortcol.equals("name")) {
            if(type.equals("desc")){
                return stockRepository.findByMailidOrderByStockDesc(mailid);
            }
            else{
                return stockRepository.findByMailidOrderByStock(mailid);
            }
        }
        else if(sortcol.equals("type")){
            if(type.equals("desc")){
                return stockRepository.findByMailidOrderByCatagoryDesc(mailid);
            }
            else{
                return stockRepository.findByMailidOrderByCatagory(mailid);
            }
        }
        else if(sortcol.equals("price")) {
            if(type.equals("desc")){
                return stockRepository.findByMailidOrderByPriceDesc(mailid);
            }
            else{
                return stockRepository.findByMailidOrderByPrice(mailid);
            }
        }
        else {
            if(type.equals("desc")){
                return stockRepository.findByMailidOrderByAmountDesc(mailid);
            }
            else{
                return stockRepository.findByMailidOrderByAmount(mailid);
            }
        }
    }
}
