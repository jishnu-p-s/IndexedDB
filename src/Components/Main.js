import React, { useState, useEffect } from "react";

const Main = () => {
  const [val, setval] = useState("");
  const [todos, settodos] = useState([]);
  const [database, setdatabase] = useState(null);
  const [updater, setupdater] = useState({});
  const [err, seterr] = useState(false);

  const getStore = (type) => {
    if (!database) {
      return false;
    }
    var trans = database.transaction(["todos"], type);
    return trans.objectStore("todos");
  };

  const connectDB = () => {
    const request = indexedDB.open("todos", 1);
    request.onupgradeneeded = (e) => {
      var db = e.target.result;
      if (db.objectStoreNames.contains("todos")) {
        db.deleteObjectStore("todos");
      }
      db.createObjectStore("todos", { keyPath: "timeStamp" });
    };
    request.onsuccess = (e) => {
      var db = e.target.result;
      setdatabase(db);
    };
    request.onerror = (e) => {
      seterr(true);
    };
  };

  const getAll = () => {
    const store = getStore("readonly");
    if (!store) {
      return;
    }
    const request = store.openCursor();
    const resArray = [];
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        resArray.push(cursor.value);
        cursor.continue();
      } else {
        settodos(resArray);
      }
    };
  };

  const additem = (e) => {
    e.preventDefault();
    const store = getStore("readwrite");
    if (!store) {
      return;
    }
    const newTodo = {
      title: val,
      timeStamp: new Date().toISOString(),
    };
    const req = store.put(newTodo);
    req.onsuccess = (e) => {
      getAll();
      setval("");
    };
  };

  const deleteItem = (id) => {
    const store = getStore("readwrite");
    if (!store) {
      return;
    }
    var request = store.delete(id);

    request.onsuccess = (e) => getAll();
  };

  const updateText = (id) => {
    const store = getStore("readwrite");
    if (!store) {
      return;
    }
    const request = store.openCursor();
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.timeStamp === id) {
          const res = cursor.update({
            ...cursor.value,
            title: updater[id],
          });
          res.onsuccess = (e) => {
            getAll();
          };
        } else {
          cursor.continue();
        }
      }
    };
  };
  useEffect(() => {
    if (database) {
      getAll();
    } else {
      connectDB();
    }
  }, [database]);

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
            onSubmit={additem}
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
                    <h1>{item.title}</h1>
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
                      onClick={() => deleteItem(item.timeStamp)}
                    >
                      delete
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateText(item.timeStamp);
                  }}
                >
                  <input
                    onChange={(e) =>
                      setupdater({
                        ...updater,
                        [item.timeStamp]: e.target.value,
                      })
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
