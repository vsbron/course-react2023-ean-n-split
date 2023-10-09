import { useState } from "react";

// Default array of friends
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  // State variable of adding friends form display status
  const [showAddFriend, setShowAddFriend] = useState(false);

  // State variable of displayed friends list
  const [friends, setFriends] = useState(initialFriends);

  // State variable of selected friend
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Toggle add friend form handler
  function handleShowAddFriend() {
    // Reversing the current state value
    setShowAddFriend((show) => !show);

    // Setting selected friend to null, thus hiding the right section
    setSelectedFriend(null);
  }

  // Adding friend to the list handler
  function handleAddFriend(friend) {
    // Adding new friend with spread operator
    setFriends((fr) => [...fr, friend]);

    // Hiding the add friend form
    setShowAddFriend(false);
  }

  // Selecting friend handler
  function handleSelection(friend) {
    // Conditionally setting selected friend. If it's already selected - resetting it to null
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));

    // Hiding the add friend from
    setShowAddFriend(false);
  }

  // Splitting the bill handler
  function handleSplitBill(value) {
    // Updating the friends list
    setFriends((friends) =>
      friends.map((friend) =>
        // If current friend iteration is selected
        friend.id === selectedFriend.id
          ? // If so, spread all its values and add updated balance with value
            { ...friend, balance: friend.balance + value }
          : // If not, just return the friend data with no changes
            friend
      )
    );

    setSelectedFriend(null); // Closing the form and resetting its fields
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* Friends List */}
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {/* Showing form is the state of its display status is true. Also passing the adding friend handler from above */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        {/* Button that toggles the form */}
        <Button onClick={handleShowAddFriend}>
          {/* Button value depends on state of form's display status */}
          {showAddFriend ? `Close` : `Add friend`}
        </Button>
      </div>

      {/* Right section with the calculator that appears only when one of the friends is seelcted. Passing this friend to the component */}
      {selectedFriend && (
        <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

// Friends list component that lists the friends
function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

// Friend component that renders the list item with all the person's data
function Friend({ friend, selectedFriend, onSelection }) {
  // Destructuring friend's data
  const { name, image, balance } = friend;

  // Creating a boolian for determing whether if friend is selected or not
  const isSelected = selectedFriend?.id === friend.id;

  return (
    // Contitional rendering of a class
    <li className={isSelected ? "selected" : ""}>
      <img src={image} alt={name} />
      <h3>{name}</h3>

      {/* If your friend owes you money (balance is positive) */}
      {balance < 0 && (
        <p className="red">
          You owe {name} ${Math.abs(balance)}
        </p>
      )}

      {/* If you owe money to a friend (balance is negative) */}
      {balance > 0 && (
        <p className="green">
          {name} owes you ${balance}
        </p>
      )}

      {/* If you and your friend are even (balance equals to 0) */}
      {balance === 0 && <p>You and {name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

// Adding friend form component
function FormAddFriend({ onAddFriend }) {
  // States of input fields with initial values
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  // Submit action handler
  function handleSubmit(e) {
    e.preventDefault(); // Preventing default behavior
    if (!name || !image) return; // Guard clause

    // Generating random number and saving it as ID
    const id = crypto.randomUUID();

    // Creating new friend object, adding the ID string to a default img value
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    // Using the handler to add a new friend to the friend list in the state
    onAddFriend(newFriend);

    // Setting the input fields to default values
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  // Setting state variables
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  // Calculating the friend's share of the bill
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault(); // Preventing default behavior
    if (!bill || !paidByUser) return; // Guard clause

    // Checking who's paying the bill and altering balance accordingly
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  // Rendering the input fields with controlled elements
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🕴️Your expenses</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            // Checking whether entered amount is not greater than the actial bill
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑{friend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>💰Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

// Button component that receives the click handler and the children value
function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
