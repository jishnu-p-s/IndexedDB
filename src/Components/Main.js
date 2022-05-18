import React, { useState, useEffect } from "react";
import Localbase from "localbase";

const Main = () => {
  const [val, setval] = useState("");
  const [users, setusers] = useState([]);
  let db = new Localbase("db");
  const [len, setlen] = useState(0);
  const [updater, setupdater] = useState({});
  const [err, seterr] = useState(false);

  const getAll = () =>
    db
      .collection("users")
      .get()
      .then((users) => {
        if (users.length > 0) {
          setlen(users[users.length - 1].id + 1);
        } else {
          setlen(0);
        }
        setusers(users);
      })
      .catch(() => {
        seterr(true);
      });
  useEffect(() => {
    getAll();
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    db.collection("users")
      .add({
        id: len,
        name: val,
      })
      .then(() => {
        setval("");
        getAll();
      });
  };
  const deleteItem = (id) => {
    db.collection("users")
      .doc({ id })
      .delete()
      .then(() => getAll());
  };
  const updateText = (id) => {
    db.collection("users")
      .doc({ id })
      .update({
        name: updater[id],
      })
      .then(() => getAll());
  };
  return (
    <div style={{ margin: "0px auto", width: "350px" }}>
      <h1 style={{ textAlign: "center" }}>Learn indexedDB</h1>
      {!err ? (
        <>
          <form
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
              gap: 5,
            }}
            onSubmit={onClick}
          >
            <input value={val} onChange={(e) => setval(e.target.value)} />
            <button type="submit">submit</button>
          </form>

          <div
            style={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {users.map((item, index) => (
              <div
                style={{ backgroundColor: "wheat", padding: 10 }}
                key={index}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    justifyContent: "center",
                    height: "auto",
                  }}
                >
                  <div
                    style={{
                      height: "auto",
                      display: "grid",
                      alignItems: "center",
                      width: "100%",
                      wordBreak: "break-word",
                    }}
                  >
                    <h1>{item.name}</h1>
                  </div>
                  <div
                    style={{
                      height: "auto",
                      display: "grid",
                      alignItems: "center",
                    }}
                  >
                    <button
                      style={{
                        height: "fit-content",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: 50,
                        cursor: "pointer",
                      }}
                      onClick={() => deleteItem(item.id)}
                    >
                      delete
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateText(item.id);
                  }}
                >
                  <input
                    onChange={(e) =>
                      setupdater({ ...updater, [item.id]: e.target.value })
                    }
                    value={updater[item.id]}
                  ></input>
                  <button type="submit">UPDATE</button>
                </form>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h3 style={{ textAlign: "center", color: "red" }}>
          Error in DB Connection !
        </h3>
      )}
    </div>
  );
};

export default Main;
