import { program } from "commander";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("./expenses.json");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync("expenses.json", "[]");
}

program
  .option("-a, --action <string>", "Action: add | list | delete | summary")
  .option("-d, --description <string>", "Expense description")
  .option("--amount <number>", "Expense amount", parseFloat)
  .option("-i, --id <number>", "Expense ID", parseInt)
  .option("--month <number>", "Month (1-12)", parseInt);

program.parse();
const opts = program.opts();

// helpers functions
function readExpenses() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeExpenses(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const getNextId = () => {
  const expenses = readExpenses();
  const nextId = Math.max(...expenses.map((e) => e.id), 0) + 1;
  return nextId;
};

const nextId = getNextId();
const expenses = readExpenses();

// app logic

switch (opts.action) {
  case "add":
    if (!opts.description || !opts.amount) {
      console.error("There are empty fields");
      break;
    }
    if (isNaN(opts.amount) || opts.amount <= 0) {
      console.error("❌ Invalid amount");
      break;
    }

    const newExpense = {
      id: nextId,
      description: opts.description,
      amount: opts.amount,
      date: new Date(),
    };
    expenses.push(newExpense);
    writeExpenses(expenses);
    console.log(`Expense added successfully (ID: ${nextId})`);
    break;

  case "list":
    const data = {};

    expenses.forEach((exp) => {
      data[exp.id] = {
        ID: exp.id,
        Date: new Date(exp.date).toISOString().split("T")[0],
        Description: exp.description,
        Amount: `$${exp.amount}`,
      };
    });

    console.table(data);

    break;

  case "summary":
    if (!isNaN(opts.month)) {
      if (opts.month < 1 || opts.month > 12) {
        console.error("Invalid Month");
        break;
      }
      const expensesFilter = expenses.filter(
        (exp) => new Date(exp.date).getMonth() + 1 === opts.month
      );

      if (expensesFilter.length === 0) {
        console.log("There are no records for that month");
        break;
      }
      let totalAmountsMonth = 0;

      expensesFilter.forEach((e) => {
        totalAmountsMonth += e.amount;
      });
      console.log(`Total expenses: $${totalAmountsMonth}`);
      break;
    }

    let totalAmounts = 0;

    expenses.forEach((e) => {
      totalAmounts += e.amount;
    });
    console.log(`Total expenses: $${totalAmounts}`);
    break;

  case "delete":
    const exists = expenses.some((e) => e.id === opts.id);
    if (!exists) {
      console.error("Invalid ID");
      break;
    }

    const updatedExpenses = expenses.filter((e) => e.id !== opts.id);
    writeExpenses(updatedExpenses);
    console.log("Expense deleted successfully");
    break;

  default:
    break;
}
