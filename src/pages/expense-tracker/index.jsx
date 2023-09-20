import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { auth } from "../../config/firebase-config";

const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions: initialTransactions, transactionTotals } =
    useGetTransactions();
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState(initialTransactions);
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const [editTransactionId, setEditTransactionId] = useState(null);
  const { balance, income, expenses } = transactionTotals;

  useEffect(() => {
    // Update transactions when initialTransactions changes (e.g., due to API calls)
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      description,
      transactionAmount,
      transactionType,
    };

    try {
      // Send a POST request to your server API to add a new transaction
      const newTransaction = await addTransaction(transactionData);
      setTransactions([...transactions, newTransaction]);
      clearForm();
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setDescription("");
    setTransactionAmount(0);
    setTransactionType("expense");
  };

  const handleEditTransaction = (id) => {
    setEditTransactionId(id);
    // Fetch the transaction data by id from your API and populate the input fields
    // You can use a separate form for editing or modify the existing form
  };

  const handleDeleteTransaction = async (id) => {
    try {
      // Send a DELETE request to your server API with the transaction id
      // Handle success and update the state to remove the deleted transaction
      // Example: const deletedTransactionId = await deleteTransaction(id);
      // Filter out the deleted transaction from the state
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  {transactions.map((transaction) => {
    const { id, description, transactionAmount, transactionType } = transaction;
    return (
      <li key={id}>
        {/* ... */}
      </li>
    );
  })}
  

  return (
    <div className="expense-tracker">
      <div className="container">
        <h1>{name}'s Expense Tracker</h1>
        <div className="balance">
          <h3>Your Balance</h3>
          <h2>${balance >= 0 ? balance : -balance}</h2>
        </div>
        <div className="summary">
          <div className="income">
            <h4>Income</h4>
            <p>${income}</p>
          </div>
          <div className="expenses">
            <h4>Expenses</h4>
            <p>${expenses}</p>
          </div>
        </div>
        <form className="add-transaction" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={transactionAmount}
            required
            onChange={(e) => setTransactionAmount(e.target.value)}
          />
          <input
            type="radio"
            id="expense"
            value="expense"
            checked={transactionType === "expense"}
            onChange={() => setTransactionType("expense")}
          />
          <label htmlFor="expense">Expense</label>
          <input
            type="radio"
            id="income"
            value="income"
            checked={transactionType === "income"}
            onChange={() => setTransactionType("income")}
          />
          <label htmlFor="income">Income</label>
          <button type="submit">Add Transaction</button>
        </form>
      </div>
      {profilePhoto && (
        <div className="profile">
          <img
            className="profile-photo"
            src={profilePhoto}
            alt={`${name}'s profile`}
          />
          <button className="sign-out-button" onClick={signUserOut}>
            Sign Out
          </button>
        </div>
      )}
      <div className="transactions">
        <h3>Transactions</h3>
        <ul>
          {transactions.map((transaction) => {
            const { id, description, transactionAmount, transactionType } =
              transaction;
            return (
              <li key={id}>
                <h4>{description}</h4>
                <p>
                  ${transactionAmount} •{" "}
                  <label
                    style={{
                      color: transactionType === "expense" ? "red" : "green",
                    }}>
                    {transactionType}
                  </label>
                </p>
                <div className="transaction-actions">
                  <button onClick={() => handleEditTransaction(id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTransaction(id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseTracker;
