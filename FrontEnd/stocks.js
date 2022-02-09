// If user jumps to this page without authentication then redirected to auth page
if(!(localStorage.getItem("valid"))) {
    localStorage.clear();
    window.location.replace('/');
}

// To sign out the user
function signOut() {
    localStorage.clear();
    window.location.replace('/');
}

// Initial stocks list
let stockList = [{
    name: "PYPL",
    price: 132.57,
    volume: "136.2M",
}, 
{
    name: "AAPL",
    price: 174.76,
    volume: "100M",
},
{
    name: "MSFT",
    price: 308.44,
    volume: "33.24M",
},
{
    name: "GOOGL",
    price: 2934.25,
    volume: "1.29M",
},
{
    name: "TSLA",
    price: 927.56,
    volume: "28.61M",
},
{
    name: "FB",
    price: 243,
    volume: "86.4M",
}, 
{
    name: "NVDA",
    price: 245.82,
    volume: "51.72M",
},
{
    name: "NFLX",
    price: 415.64,
    volume: "6.3M",
},
{
    name: "INTC",
    price: 48.74,
    volume: "35.74M",
}, 
{
    name: "ADBE",
    price: 514.71,
    volume: "2.4M",
},
{
    name: "CMCSA",
    price: 50.38,
    volume: "23.9M",
},
{
    name: "PEP",
    price: 175.74,
    volume: "4.8M",
},
{
    name: "CSCO",
    price: 55.56,
    volume: "23.31M",
}, 
{
    name: "AVGO",
    price: 587.96,
    volume: "2.46M",
},
{
    name: "QCOM",
    price: 179.27,
    volume: "25.64M",
}];

// Put size of list in local storage
const size = stockList.length;
localStorage.setItem("listSize", size);

// To get index of a particular stock in list
function getStockFromList(name){
    for(let i=0;i<size;i++){
        if(stockList[i].name == name){
            return i;
        }
    }
}

// Verify valid input
function valid(str) {
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
}

// Buy a particular stock
function buy(name, units, price){
    if(!valid(units)) {
        document.getElementById("message").innerHTML = `Enter valid input value`;
        return;
    }
    
    fetch(`http://localhost:8080/api/buy/${localStorage.mail}/${name}/${units}/${price}`, {
        method: 'POST',
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(data => {
        if(data.mailid == "#"){
            throw new Error();
        }
        else if(data.mailid == "NotEnoughMoney"){
            document.getElementById("message").innerHTML = `Not enought money in Wallet. (Balance: $${data.wallet})`;
        }
        else {
            document.getElementById("messageSuccess").innerHTML = `Success`;
            window.location.reload();

        }
    }).catch(err => {
        document.getElementById("message").innerHTML = `POST request error`;
        console.log("POST request error");
    });
    
}

// Sell a particular stock
function sell(name, units, price){
    if(!valid(units)) {
        document.getElementById("message").innerHTML = `Enter valid input value`;
        return;
    }
    fetch(`http://localhost:8080/api/sell/${localStorage.mail}/${name}/${units}/${price}`, {
        method: 'POST',
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(data => {
        if(data.mailid == "#"){
            throw new Error();
        }
        else if(data.mailid == "StockNotBought"){
            document.getElementById("message").innerHTML = `Stock Not Bought.`;
        }
        else if(data.mailid == "NotEnoughStocks"){
            document.getElementById("message").innerHTML = `Quantity exceeds available no. of stocks.`;
        }
        else {
            document.getElementById("messageSuccess").innerHTML = `Success`;
            window.location.reload();
        }
    }).catch(err => {
        document.getElementById("message").innerHTML = `POST request error`;
        console.log("POST request error");
    });
}

// Modal for trading a stock
function trade(idx) {
    localStorage.setItem("idx", idx);
    let item = JSON.parse(localStorage.getItem(`list_${idx}`));
    let title = item.name + ": $" + item.price;
    document.getElementById("modal-from-title").innerHTML = title;
}

// Trade a stock
function transact(){
    let item = JSON.parse(localStorage.getItem(`list_${localStorage.idx}`));
    let units = document.getElementById("units").value;
    let e = document.getElementById("choice");
    let choice = e.options[e.selectedIndex].text;
    if(choice == "Buy"){
        buy(item.name, units, item.price);
    }
    else {
        sell(item.name, units, item.price);
    }
}

// Remove stock from favourites
function unmark(idx){
    fetch(`http://localhost:8080/api/unmarkfav/${localStorage.mail}/${stockList[idx].name}`, {
        method: 'POST',
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(data => {
        localStorage.setItem(`state_${idx}`, 1);
        document.getElementById(`mark_${idx}`).innerHTML = `<button onClick="mark(${idx})" type="button" class="btn btn-outline-dark">Mark</button>`;
        console.log("success");
        window.location.reload();
    }).catch(err => {
        console.log("Fav Unark POST req. error");
    });
}

// Mark stock as favourites
function mark(idx){
    fetch(`http://localhost:8080/api/markfav/${localStorage.mail}/${stockList[idx].name}`, {
        method: 'POST',
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(data => {
        localStorage.setItem(`state_${idx}`, 2);
        document.getElementById(`mark_${idx}`).innerHTML = `<button onClick="unmark(${idx})" type="button" class="btn btn-outline-dark">Unmark</button>`;
        console.log("success");
        window.location.reload();
    }).catch(err => {
        console.log("Fav Mark POST req. error");
    });
}

// Set price alert for a stock
function setAlert(idx){
    $('#exampleModal1').modal('show');
    document.getElementById('alert_button').addEventListener("click", function() {
        console.log("clicked");
        let price = document.getElementById("alert_price").value;
        if(price>1){
            localStorage.setItem(`alert_${idx}`, price);
            document.getElementById(`alert_${idx}`).innerHTML = `${stockList[idx].name} <svg onClick="unSetAlert(${idx})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-slash" viewBox="0 0 16 16">
            <path d="M5.164 14H15c-.299-.199-.557-.553-.78-1-.9-1.8-1.22-5.12-1.22-6 0-.264-.02-.523-.06-.776l-.938.938c.02.708.157 2.154.457 3.58.161.767.377 1.566.663 2.258H6.164l-1 1zm5.581-9.91a3.986 3.986 0 0 0-1.948-1.01L8 2.917l-.797.161A4.002 4.002 0 0 0 4 7c0 .628-.134 2.197-.459 3.742-.05.238-.105.479-.166.718l-1.653 1.653c.02-.037.04-.074.059-.113C2.679 11.2 3 7.88 3 7c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0c.942.19 1.788.645 2.457 1.284l-.707.707zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z"/>
            </svg>`;
            $('#exampleModal1').modal('hide'); 
        }
        else {
            document.getElementById("fail_message").innerHTML = "Enter valid value";
        } 
    });
}

// Remove price alert for a stock
function unSetAlert(idx){
    localStorage.setItem(`alert_${idx}`, 1);
    document.getElementById(`alert_${idx}`).innerHTML = `${stockList[idx].name} <svg onClick="setAlert(0)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
  </svg>`;
    window.location.reload();  
}

// Render the list of stocks and favourites
function renderStocks(){
    if(!localStorage.state_0) localStorage.setItem(`state_0`, 1);
    if(!localStorage.alert_0) localStorage.setItem(`alert_0`, 1);
    let element, alertElement;
    if(localStorage.alert_0 == 1){
        alertElement = `<td id='alert_0'>${stockList[0].name} <svg onClick="setAlert(0)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
      </svg></td>`;
    }
    else{
        alertElement = `<td id='alert_0'>${stockList[0].name} <svg onClick="unSetAlert(0)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-slash" viewBox="0 0 16 16">
        <path d="M5.164 14H15c-.299-.199-.557-.553-.78-1-.9-1.8-1.22-5.12-1.22-6 0-.264-.02-.523-.06-.776l-.938.938c.02.708.157 2.154.457 3.58.161.767.377 1.566.663 2.258H6.164l-1 1zm5.581-9.91a3.986 3.986 0 0 0-1.948-1.01L8 2.917l-.797.161A4.002 4.002 0 0 0 4 7c0 .628-.134 2.197-.459 3.742-.05.238-.105.479-.166.718l-1.653 1.653c.02-.037.04-.074.059-.113C2.679 11.2 3 7.88 3 7c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0c.942.19 1.788.645 2.457 1.284l-.707.707zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z"/>
      </svg></td>`;
    }
    if(localStorage.state_0 == 1){
        element = `<td id="mark_0"><button onClick="mark(0)" type="button" class="btn btn-outline-dark">Mark</button></td>`;
    }
    else {
        element = `<td id="mark_0"><button onClick="unmark(0)" type="button" class="btn btn-outline-dark">Unmark</button></td>`;
    }
    if(localStorage.alert_0 > 1 && stockList[0].price>localStorage.alert_0){
        window.alert(`Price of ${stockList[0].name} is greater than set price of ${localStorage.alert_0}`);
    }
    let str = `<tr>
    <th scope="row">1</th>
    ${alertElement}
    <td>$${stockList[0].price}</td>
    <td>${stockList[0].volume}</td>
    <td><button id="btn_0" onClick="trade(0)" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-dark">Buy/Sell</button></td>
    ${element}
    </tr>`;
    
    for(let i=1;i<size;i++){
        if(!localStorage.getItem(`state_${i}`)) localStorage.setItem(`state_${i}`, 1);
        if(!localStorage.getItem(`alert_${i}`)) localStorage.setItem(`alert_${i}`, 1);

        if(localStorage.getItem(`alert_${i}`) == 1){
            alertElement = `<td id='alert_${i}'>${stockList[i].name} <svg onClick='setAlert(${i})' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
          </svg></td>`;
        }
        else{
            alertElement = `<td id='alert_${i}'>${stockList[i].name} <svg onClick='unSetAlert(${i})' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-slash" viewBox="0 0 16 16">
            <path d="M5.164 14H15c-.299-.199-.557-.553-.78-1-.9-1.8-1.22-5.12-1.22-6 0-.264-.02-.523-.06-.776l-.938.938c.02.708.157 2.154.457 3.58.161.767.377 1.566.663 2.258H6.164l-1 1zm5.581-9.91a3.986 3.986 0 0 0-1.948-1.01L8 2.917l-.797.161A4.002 4.002 0 0 0 4 7c0 .628-.134 2.197-.459 3.742-.05.238-.105.479-.166.718l-1.653 1.653c.02-.037.04-.074.059-.113C2.679 11.2 3 7.88 3 7c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0c.942.19 1.788.645 2.457 1.284l-.707.707zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z"/>
          </svg></td>`;
        }
        if(localStorage.getItem(`state_${i}`) == 1){
            element = `<td id="mark_${i}"><button onClick="mark(${i})" type="button" class="btn btn-outline-dark">Mark</button></td>`;
        }
        else {
            element = `<td id="mark_${i}"><button onClick="unmark(${i})" type="button" class="btn btn-outline-dark">Unmark</button></td>`; 
        }
        if(localStorage.getItem(`alert_${i}`) > 1 && stockList[i].price>localStorage.getItem(`alert_${i}`)){
            window.alert(`Price of ${stockList[i].name} is greater than set price of ${localStorage.getItem(`alert_${i}`)}`);
        }
        str += `<tr>
                    <th scope="row">${i+1}</th>
                    ${alertElement}
                    <td>$${stockList[i].price}</td>
                    <td>${stockList[i].volume}</td>
                    <td><button id="btn_${i}" onClick="trade(${i})" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-dark">Buy/Sell</button></td>
                    ${element}
                </tr>`;
        
    }

    document.getElementById("stock_table").innerHTML = str;

    let favStr = "<p>No favourite stocks found.</p>";
    fetch(`http://localhost:8080/api/getFav/${localStorage.getItem("mail")}`, {
        method: 'Get'
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(ObjectData => {
        data = Object.values(ObjectData);
        let len = data.length;

        if(len > 0){
            let idx;
            favStr = `<thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Market Price</th>
                        <th scope="col">Volume</th>
                        </tr>
                    </thead><tbody>`;

            for(let i=0;i<len;i++){
                idx = getStockFromList(data[i].stock);
                favStr += `<tr>
                        <th scope="row">${i+1}</th>
                        <td>${stockList[idx].name}</td>
                        <td>$${stockList[idx].price}</td>
                        <td>${stockList[idx].volume}</td>
                    </tr>`;
            }
            favStr += `</tbody>`;
        }
        document.getElementById("fav_table").innerHTML = favStr;
    }).catch(err => {
        console.log("Get Request Failed");
        document.getElementById("fav_table").innerHTML = favStr;
    });
}

if(localStorage.getItem("list_0") != null){
    for(let i=0;i<size;i++){
        stockList[i] = JSON.parse(localStorage.getItem(`list_${i}`));
    }
}
renderStocks();

// Render stocks in intervals of 5 seconds and randomly increase or decrease price of each stock by a percentage value in range of [-2.5%, 2.5%]
let timer = setInterval(()=>{
    let num = (Math.random()/20)-0.025;
    for(let i=0;i<size;i++){
        stockList[i].price = ((1+num)*stockList[i].price).toFixed(2);
        localStorage.setItem(`list_${i}`, JSON.stringify(stockList[i]));
    }
    renderStocks();
}, 5000);


