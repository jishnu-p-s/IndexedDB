import React, { useState, useEffect } from "react";

const Main = () => {
  const [val, setval] = useState("");
  const [todos, settodos] = useState([]);

  const [len, setlen] = useState(0);
  const [updater, setupdater] = useState({});
  const [err, seterr] = useState(false);

  const getAll = () => {
    const request = indexedDB.open("todos", 1);
    request.onupgradeneeded = (e) => {
      var db = e.target.result;

      console.log("upgrade", db.name);
      if (db.objectStoreNames.contains("todos")) {
        db.deleteObjectStore("todos");
      }
      const notes = db.createObjectStore("todos", { keyPath: "timeStamp" });
      var db = e.target.result;
    };
    request.onsuccess = (e) => {
      var db = e.target.result;

      console.log("success", db.name);
    };
    request.onerror = (e) => {
      console.log("error");
    };
  };
  useEffect(() => {
    getAll();
  }, []);

  const onClick = (e) => {
    e.preventDefault();
  };
  const deleteItem = (id) => {};
  const updateText = (id) => {};
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
            {todos.map((item, index) => (
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
