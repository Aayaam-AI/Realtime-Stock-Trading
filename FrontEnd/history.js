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

// To sort the transaction history by particular column
function sortBtn(sortby){
    if(localStorage.getItem("sortcol") == sortby){
        if(localStorage.getItem("type") == "desc"){
            localStorage.setItem("type", "asc");
        }
        else {
            localStorage.setItem("type", "desc");
        }
    }
    else{
        localStorage.setItem("type", "desc");
    }
    localStorage.setItem("sortcol", sortby);
    document.location.reload();
}

// Convert Timestamp from SQL to date
function dateUtil(time) {
    let t = time.split(/[- :]/);
    return t[0]+"-"+t[1]+"-"+t[2].split("T")[0];
}

// Get user mail id from local storage
const mail = localStorage.getItem("mail");
if(!localStorage.getItem("sortcol")){
    localStorage.setItem("sortcol", "time");
    localStorage.setItem("type", "desc");
}

// In case no transaction performed yet
let str = "<p>No transaction history available.</p>"

// API call to fetch transaction from database
fetch(`http://localhost:8080/api/gethistory/${mail}/${localStorage.getItem("sortcol")}/${localStorage.getItem("type")}`,{
    method: 'GET'
}).then(res => {
    if(res.ok){
        return res.json();
    }
    else throw new Error();
}).then(objectData => {
    data = Object.values(objectData);
    let len = data.length;
    if(len > 0){
        str = `<thead>
                <tr>
                <th scope="col">Time (YYYY-MM-DD)<svg onClick="sortBtn('time')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                </svg></th>
                <th scope="col">Name <svg onClick="sortBtn('stock')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                </svg></th>
                <th scope="col">Order Type <svg onClick="sortBtn('type')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                </svg></th>
                <th scope="col">Unit Price <svg onClick="sortBtn('price')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                </svg></th>
                <th scope="col">Stock Units <svg onClick="sortBtn('amount')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                </svg></th>
                </tr>
            </thead><tbody>`;

        for(let i=0;i<len;i++){
            str += `<tr>
                    <th scope="row">${dateUtil(data[i].eventtime)}</th>
                    <td>${data[i].stock}</td>
                    <td>${data[i].catagory}</td>
                    <td>$${data[i].price}</td>
                    <td>${data[i].amount}</td>
                </tr>`;
        }
        str += "</tbody>";

    }
    document.getElementById("hist_table").innerHTML = str;
}).catch(err => {
    console.log("Get Request Failed");
    document.getElementById("hist_table").innerHTML = str;
});