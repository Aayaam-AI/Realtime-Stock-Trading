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

// Get current price for a particular stock
function getCurrentPrice(name) {
    for(let i=0;i<localStorage.listSize;i++){
        let item = JSON.parse(localStorage.getItem(`list_${i}`));
        if(item.name == name){
            return item.price;
        }
    }
}

// Verify valid input
function valid(str) {
    let n = Number(str);
    return n !== Infinity && n > 0;
}

// Add/Withdraw money from wallet
function transact() {
    let amount = document.getElementById("amount").value;
    if(!valid(amount)) {
        document.getElementById("message").innerHTML = "Enter valid value greater than zero";
        return;
    }
    let e = document.getElementById("choice");
    let choice = e.options[e.selectedIndex].text;
    if(choice == "Add"){
        fetch(`http://localhost:8080/api/addmoney/${localStorage.mail}/${amount}`, {
            method: 'POST',
        }).then(res => {
            
            if(!res.ok) throw new Error();
            else window.location.reload();
        }).catch(err => {
            console.log("wallet transaction error");
        });
    }
    else {
        fetch(`http://localhost:8080/api/withdraw/${localStorage.mail}/${amount}`, {
            method: 'POST',
        }).then(res => {
            if(!res.ok) throw new Error();
            else window.location.reload();
        }).catch(err => {
            console.log("wallet transaction error");
        });
    }
}

// Render list of holdings as well as user portfolio
function render(){
    let str = "<p>No holdings found</p>";
    let total=0;
    fetch(`http://localhost:8080/api/getholding/${localStorage.getItem("mail")}`, {
        method: 'GET'
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(d => {
        data = Object.values(d);
        let len = data.length;
        if(len > 0){
            let change, currentPrice, element;
            str = `<thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Buy Price</th>
                            <th scope="col">Market Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Profit/Loss</th>
                        </tr>
                    </thead><tbody>`;
            for(let i=0;i<len;i++){
                currentPrice = getCurrentPrice(data[i].stock);
                change = (currentPrice-data[i].price)/data[i].price;
                change = (change*100).toFixed(2);
                total += currentPrice*data[i].amount;
                if(change>0){
                    element = `<td style="color: green;">+ ${change}%</td>`;
                }
                else if(change<0){
                    element = `<td style="color: red;">- ${-1*change}%</td>`;
                }
                else{
                    element = `<td>No Change</td>`;
                }
                str += `<tr>
                            <th scope="row">${i+1}</th>
                            <td>${data[i].stock}</td>
                            <td>$${data[i].price}</td>
                            <td>$${currentPrice}</td>
                            <td>${data[i].amount}</td>
                            ${element}
                        </tr>`;
            }
            str += `</tbody>`;
        }
        document.getElementById("holding_table").innerHTML = str;
    }).catch(err => {
        console.log("Get request failed");
        document.getElementById("holding_table").innerHTML = str;
    });

    let str1 = `<tr>
                <th id="wallet" scope="row">No data</th>
                <td id="invested">No data</td>
                <td id="current">No data</td>
                <td id="profit-loss">No data</td>
            </tr>`;

    fetch(`http://localhost:8080/api/userinfo/${localStorage.mail}`, {
        method: 'GET',
    }).then(res => {
        if(res.ok){
            return res.json();
        }
        else throw new Error();
    }).then(data => {
        let element, change;
        
        if(data.invested == 0){
            total = 0;
            element = `<td>N/A</td>`;
        }
        else{
            change = (total - data.invested)/data.invested;
            change = (change*100).toFixed(2);

            if(change>0){
                element = `<td style="color: green;">+ ${change}%</td>`;
            }
            else if(change<0){
                element = `<td style="color: red;">- ${-1*change}%</td>`;
            }
            else{
                element = `<td>0%</td>`;
            }
        }
        str1 = `<tr>
                    <th scope="row">$${data.wallet}</th>
                    <td>$${data.invested}</td>
                    <td>$${total.toFixed(2)}</td>
                    <td>${element}</td>
                </tr>`;

        document.getElementById("portfolio").innerHTML = str1;
    }).catch(err => {
        console.log("Error in user info GET request");
        document.getElementById("portfolio").innerHTML = str1;
    });
}

render();

// In intervals of every 5 seconds randomly increase or decrease price of each stock by a percentage value in range of [-2.5%, 2.5%]
let timer = setInterval(()=>{
    let num = (Math.random()/20)-0.025;
    let entry;
    for(let i=0;i<localStorage.listSize;i++){
        entry = JSON.parse(localStorage.getItem(`list_${i}`));
        //console.log(entry);
        entry.price = ((1+num)*entry.price).toFixed(2);
        localStorage.setItem(`list_${i}`, JSON.stringify(entry));
    }
    render();
}, 5000);