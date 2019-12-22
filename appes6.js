class User {
  constructor(firstName, lastName, number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.number = number;
  }
}

class UI {
  addUserToList(user) {
    const list = document.getElementById("user-list");
    // Create tr element
    const row = document.createElement("tr");
    // Insert cols
    row.innerHTML = `
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.number}</td>
      <td><a href="#" class="delete">X<a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#user-form");
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteUser(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("number").value = "";
  }
}

// Local Storage Class
class Store {
  static getUsers() {
    let users;
    if (localStorage.getItem("users") === null) {
      users = [];
    } else {
      users = JSON.parse(localStorage.getItem("users"));
    }

    return users;
  }

  static displayUsers() {
    const users = Store.getUsers();

    users.forEach(function(user) {
      const ui = new UI();

      // Add user to UI
      ui.addUserToList(user);
    });
  }

  static addUser(user) {
    const users = Store.getUsers();

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));
  }

  static removeUser(number) {
    const users = Store.getUsers();

    users.forEach(function(user, index) {
      if (user.number === number) {
        users.splice(index, 1);
      }
    });

    localStorage.setItem("users", JSON.stringify(users));
  }
}

// DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayUsers);

// Event Listener for add user
document.getElementById("user-form").addEventListener("submit", function(e) {
  // Get form values
  const firstName = document.getElementById("firstName").value,
    lastName = document.getElementById("lastName").value,
    number = document.getElementById("number").value;

  // Instantiate user
  const user = new User(firstName, lastName, number);

  // Instantiate UI
  const ui = new UI();

  console.log(ui);

  // Validate
  if (firstName === "" || lastName === "" || number === "") {
    // Error alert
    ui.showAlert("Заполните все поля", "error");
  } else if (isNaN(number)) {
    ui.showAlert("В номере телефона только цифры", "error");
  } else {
    // Add user to list
    ui.addUserToList(user);

    // Add to LS
    Store.addUser(user);

    // Show success
    ui.showAlert("Пользователь добавлен!", "success");

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById("user-list").addEventListener("click", function(e) {
  // Instantiate UI
  const ui = new UI();

  // Delete user
  ui.deleteUser(e.target);

  // Remove from LS
  Store.removeUser(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert("Пользователь удален!", "success");

  e.preventDefault();
});
