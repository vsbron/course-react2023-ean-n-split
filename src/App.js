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

  // Toggle add friend form handler
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show); // Reversing the current state value
  }

  // Adding friend to the list handler
  function handleAddFriend(friend) {
    setFriends((fr) => [...fr, friend]); // Adding new friend with spread operator
    setShowAddFriend(false); // Hiding the add friend form
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* Friends List */}
        <FriendsList friends={friends} />

        {/* Showing form is the state of its display status is true. Also passing the adding friend handler from above */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        {/* Button that toggles the form */}
        <Button onClick={handleShowAddFriend}>
          {/* Button value depends on state of form's display status */}
          {showAddFriend ? `Close` : `Add friend`}
        </Button>
      </div>

      {/* Right section with the calculator */}
      <FormSplitBill />
    </div>
  );
}

// Friends list component that lists the friends
function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}

// Friend component that renders the list item with all the person's data
function Friend({ friend }) {
  const { name, image, balance } = friend;
  return (
    <li>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {balance < 0 && (
        <p className="red">
          You owe {name} ${Math.abs(balance)}
        </p>
      )}
      {balance > 0 && (
        <p className="green">
          {name} owes you ${balance}
        </p>
      )}

      {balance === 0 && <p>You and {name} are even</p>}

      <Button>Select</Button>
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

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with X</h2>

      <label>💰Bill value</label>
      <input type="text" />

      <label>🕴️Your expenses</label>
      <input type="text" />

      <label>🧑‍🤝‍🧑X's expense</label>
      <input type="text" disabled />

      <label>💰Who is paying the bill?</label>
      <select>
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>
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
