# Expense Tracker CLI

This project is based on [roadmap.sh Expense Tracker Project](https://roadmap.sh/projects/expense-tracker).
It is a simple **command-line application** built with **Node.js** to manage personal expenses.

---

## Features

* Add a new expense with description, amount, and date.
* List all expenses in a table format.
* Delete an expense by ID.
* Update an existing expense (description and/or amount).
* View total expenses.
* View expenses summary by month.

---

## Installation

```bash
git clone https://github.com/IsraelMancha/expense-tracker.git
cd expense-tracker
npm install
```

---

## Usage

```bash
node app.js --action <action> [options]
```

Examples:

```bash
node app.js --action add --description "Lunch" --amount 15
node app.js --action list
node app.js --action update --id 1 --amount 25
node app.js --action delete --id 1
node app.js --action summary
node app.js --action summary --month 8
```

---

## Tech Stack

* Node.js
* Commander.js
* JSON file storage

