let db;
// Create a new database request for a "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // Create an object store called "pending" and set the autoIncrement to true.
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  // Check to see if the app is online before reading from the database.
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("ERROR: " + event.target.errorCode);
};

function saveRecord(record) {
  // Create a pending transaction.
  const transaction = db.transaction(["pending"], "readwrite");

  // Access your pending object store.
  const store = transaction.objectStore("pending");

  // Add the record to your store using the add method.
  store.add(record);
}

function checkDatabase() {
  // Open a transaction from the pending database.
  const transaction = db.transaction(["pending"], "readwrite");
  // Access your pending object store.
  const store = transaction.objectStore("pending");
  // Get all of the records from store and set to a variable.
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // If successful, open a transaction from the pending database.
          const transaction = db.transaction(["pending"], "readwrite");

          // Access your pending object store.
          const store = transaction.objectStore("pending");

          // Clear all of the items in your store.
          store.clear();
        });
    }
  };
}

// Listen for the app to come back online.
window.addEventListener("online", checkDatabase);
