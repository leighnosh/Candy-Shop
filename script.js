var apiUrl =
  "https://crudcrud.com/api/40bf40ccc1ba4f93a469d72034061af9/CandyShop";

function buyCandies(row, amount) {
  return new Promise((resolve, reject) => {
    var quantityCell = row.cells[3];
    var quantity = parseInt(quantityCell.textContent);

    if (quantity >= amount) {
      quantity -= amount;
      quantityCell.textContent = quantity;

      var candyId = row.getAttribute("data-id");
      var candyData = {
        name: row.cells[0].textContent,
        description: row.cells[1].textContent,
        price: parseFloat(row.cells[2].textContent),
        quantity: quantity,
      };

      axios
        .put(`${apiUrl}/${candyId}`, candyData)
        .then(function (response) {
          console.log("Candy data updated:", response);

          axios
            .get(`${apiUrl}/${candyId}`)
            .then(function (response) {
              var updatedCandy = response.data;
              quantityCell.textContent = updatedCandy.quantity;
              resolve();
            })
            .catch(function (error) {
              console.error("Error fetching updated candy data:", error);
              reject(error);
            });
        })
        .catch(function (error) {
          console.error("Error updating candy data:", error);
          reject(error);
        });
    } else {
      alert("Not enough candies in stock!");
    }
  });
}

document
  .getElementById("addCandyForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var price = document.getElementById("price").value;
    var quantity = document.getElementById("quantity").value;

    var table = document.getElementById("candyTable");
    var row = table.insertRow();
    row.setAttribute("data-id", ""); // This will be set when data is fetched from the API
    row.innerHTML = `<td>${name}</td><td>${description}</td><td>${price}</td><td>${quantity}</td><td>
        <button onclick="buyCandies(this.parentElement.parentElement, 1)">Buy 1</button>
        <button onclick="buyCandies(this.parentElement.parentElement, 5)">Buy 5</button>
        <button onclick="buyCandies(this.parentElement.parentElement, 10)">Buy 10</button>
    </td>`;

    var candyData = {
      name: name,
      description: description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    axios
      .post(apiUrl, candyData)
      .then(function (response) {
        console.log("Candy data added successfully:", response);
        row.setAttribute("data-id", response.data._id);
      })
      .catch(function (error) {
        console.error("Error adding candy data:", error);
      });
  });

axios
  .get(apiUrl)
  .then(function (response) {
    var candyList = response.data;

    var table = document.getElementById("candyTable");
    for (var i = 0; i < candyList.length; i++) {
      var candy = candyList[i];
      var row = table.insertRow();
      row.setAttribute("data-id", candy._id);
      row.innerHTML = `<td>${candy.name}</td><td>${candy.description}</td><td>${candy.price}</td><td>${candy.quantity}</td><td>
                <button onclick="buyCandies(this.parentElement.parentElement, 1)">Buy 1</button>
                <button onclick="buyCandies(this.parentElement.parentElement, 5)">Buy 5</button>
                <button onclick="buyCandies(this.parentElement.parentElement, 10)">Buy 10</button>
            </td>`;
    }
  })
  .catch(function (error) {
    console.error("Error fetching candy data:", error);
  });
