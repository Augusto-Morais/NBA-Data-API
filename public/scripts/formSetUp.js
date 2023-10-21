const response = document.getElementById("response");

const HTTPMethod = document.getElementById("HTTPMethod");
const URL = document.getElementById("URL");

const inputs = [];
inputs.push(HTTPMethod, URL);

function setUpBodyReqInput() {
  let HTTPMethod = document.getElementById("HTTPMethod").value;
  let URL = document.getElementById("URL").value;
  let part = URL.split("/");
  let route = part.slice(3).join("/");
  console.log(route);

  if (HTTPMethod == "POST") {
    if (/players\/$/.test(route) || /players$/.test(route)) {
      document.getElementById("reqBody").value = `{
      "Name" : "PlayerName",
      "Position" : "AP",
      "DateOfBirth" : "dd-mm-yyyy" 
}
      `;
    } else if (/teams\/$/.test(route) || /teams$/.test(route)) {
      document.getElementById("reqBody").value = `{
      "Name" : "TeamName",
      "Championships" : "AP",
      "Conference" : "W|E",
      "Division": "P"
}`;
    } else if (
      /players\/\d{1,2}\/stats$/.test(route) ||
      /players\/\d{1,2}\/stats\/$/.test(route)
    ) {
      document.getElementById("reqBody").value = `{
        "Year" : "",
        "TeamId" : "",
        "GamesPlayed" : "",
        "GamesStarted" : "",
        "PPG" : "",
        "RPG" : "",
        "APG" : "",
        "SPG" : "",
        "BPG" : "",
        "FGP" : "",
        "TPP" : "",
        "FTP" : ""
}`;
    } else {
      document.getElementById("reqBody").value = "";
    }
  } else if (HTTPMethod == "PUT") {
    if (/players\/\d{1,2}$/.test(route) || /players\/\d{1,2}\/$/.test(route)) {
      document.getElementById("reqBody").value = `{
      "Name" : "PlayerName",
      "Position" : "AP",
      "DateOfBirth" : "dd-mm-yyyy" 
}
      `;
    } else if (
      /teams\/\d{1,2}$/.test(route) ||
      /teams\/\d{1,2}\/$/.test(route)
    ) {
      document.getElementById("reqBody").value = `{
        "Name" : "TeamName",
        "Championships" : "AP",
        "Conference" : "W|E",
        "Division": "P"
}`;
    }else if( /players\/\d{1,2}\/stats\/\d{1,4}-\d{1,2}$/.test(route) ||
    /players\/\d{1,2}\/stats\/\d{1,4}-\d{1,2}\/$/.test(route)){
      document.getElementById("reqBody").value = `{
        "Year" : "",
        "TeamId" : "",
        "GamesPlayed" : "",
        "GamesStarted" : "",
        "PPG" : "",
        "RPG" : "",
        "APG" : "",
        "SPG" : "",
        "BPG" : "",
        "FGP" : "",
        "TPP" : "",
        "FTP" : ""
}`;

    } else {
      document.getElementById("reqBody").value = "";
    }
  }
  else{
    document.getElementById("reqBody").value = "";
  }
}

HTTPMethod.addEventListener("change", setUpBodyReqInput);
URL.addEventListener("keyup", setUpBodyReqInput);

document
  .getElementById("submit")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    response.innerHTML = "";

    let reqBodyValue = document.getElementById("reqBody").value;
    let HTTPMethod = document.getElementById("HTTPMethod").value;
    let URL = document.getElementById("URL").value;

    let options;

    if (HTTPMethod == "GET") {
      options = {
        method: HTTPMethod,
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      options = {
        method: HTTPMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: reqBodyValue,
      };
    }

    let part = URL.split("/");
    let route = part.slice(3).join("/");

    // fetch(URL, options).
    // then().catch(error => {
    //   response.innerHTML = `<span style='color:red;'>${error.status}</span><br><span style='color:red;'>${error.message}</span>`;
    // });

    try {
      const request = await fetch(URL, options);

      if (request.ok) {
        if (HTTPMethod == "GET") {
          alert(route + "|");
          // /players/:id/stats/:year
          if (
            /players\/\d{1,2}$/.test(route) ||
            /players\/$/.test(route) ||
            /players$/.test(route) ||
            /players\/\d{1,2}\/$/.test(route) ||
            /teams\/\d{1,2}$/.test(route) ||
            /teams\/$/.test(route) ||
            /teams$/.test(route) ||
            /teams\/\d{1,2}\/$/.test(route)
          ) {
            // alert('HERE')
            const data = await request.json();

            data.forEach((element) => {
              if (typeof element == "object") {
                response.innerHTML += "{<br>";
                const pairs = Object.entries(element);

                pairs.forEach((pair) => {
                  if (pair[0] == "DateOfBirth") {
                    const date = pair[1].split("T")[0].split("-");

                    const day = date[2];
                    const month = date[1];
                    const year = date[0];

                    response.innerHTML += `<pre>       <span style='color:blue;'>"${pair[0]}"</span> : "${day}/${month}/${year}"</pre>`;
                  } else {
                    response.innerHTML += `<pre>       <span style='color:blue;'>"${pair[0]}"</span> : "${pair[1]}"</pre>`;
                  }
                });
              }
              response.innerHTML += "},<br>";
            });
          } else if (
            /players\/\d{1,2}\/stats$/.test(route) ||
            /players\/\d{1,2}\/stats\/$/.test(route) ||
            /players\/\d{1,2}\/stats\/\d{1,4}-\d{1,2}$/.test(route) ||
            /players\/\d{1,2}\/stats\/\d{1,4}-\d{1,2}\/$/.test(route)
          ) {
            alert("SECOND ONE");
            const data = await request.json();

            const entries = Object.entries(data);

            response.innerHTML += "{<br>";
            response.innerHTML += `<pre>        <span style='color:blue;'>"${entries[0][0]}"</span> : "${entries[0][1]}"</pre>`;
            response.innerHTML += `<pre>        <span style='color:blue;'>"Stats":</span><span style='color:black;'>{</span></pre>`;

            entries.forEach((pair) => {
              if (typeof pair[1] == "object") {
                const seasons = pair[1];

                seasons.forEach((value) => {
                  response.innerHTML += `<pre>            <span style='color:black;'>{</span></pre>`;

                  const stats = Object.entries(value);

                  stats.forEach((value) => {
                    response.innerHTML += `<pre>                <span style='color:blue;'>"${value[0]}"</span> : "${value[1]}",</pre>`;
                  });
                  response.innerHTML += `<pre>            <span style='color:black;'>}</span>,</pre>`;
                });
              } else {
              }
            });

            response.innerHTML += `<pre>        <span style='color:black;'>}</span></pre>`;
            response.innerHTML += "}<br>";
          }
        } else if (
          HTTPMethod == "POST" ||
          HTTPMethod == "PUT" ||
          HTTPMethod == "DELETE"
        ) {
          const data = await request.json();
          // response.innerHTML += data;
          response.innerHTML += `<pre><span style='color:black;'>{</span></pre>`;
          for (const key in data) {
            response.innerHTML += `<pre>                <span style='color:blue;'>"${key}"</span> : "${data[key]}",</pre>`;
          }
          response.innerHTML += `<pre><span style='color:black;'>}</span></pre>`;
        }
      } else {
        response.innerHTML = `<span style='color:red;'>${request.status}</span><br><span style='color:red;'>${request.statusText}</span>`;
      }
    } catch (error) {
      alert("Something went wrong");
      response.innerHTML = error;
      alert(error.sqlMessage + "|");
      if (error.sql) {
        response.innerHTML = `<span style='color:red;'>${error.code}</span><br><span style='color:red;'>${error.sql}</span><br><span style='color:red;'>${error.sqlMessage}</span>`;
      }
    }
  });
