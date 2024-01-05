import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { CompleteIcon, IncompleteIcon } from "./components/icons";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AiFillDelete } from "solid-icons/ai";
import { FaSolidCartShopping } from "solid-icons/fa";

export interface Item {
  id: string;
  title: string;
  completed: boolean;
  amount: number;
}

type ItemFilter = "all" | "active" | "completed";

function Item(item: Item) {
  async function deleteItem(id: string) {
    await deleteDoc(doc(db, "list", id));
  }

  async function toggleCompleted({
    id,
    completed,
  }: {
    id: string;
    completed: boolean;
  }) {
    await updateDoc(doc(db, "list", id), {
      completed,
    });
  }
  return (
    <li class="flex my-2 items-center group">
      <div
        onClick={() => {
          toggleCompleted({ id: item.id, completed: !item.completed });
        }}
      >
        <Show when={item.completed}>
          <CompleteIcon />
        </Show>
        <Show when={!item.completed}>
          <IncompleteIcon />
        </Show>
      </div>
      <span class="text-xl text-gray-500 px-2 font-semibold">
        {item.amount}x
      </span>
      <label
        classList={{
          "line-through text-[#d9d9d9]": item.completed,
          "text-black": !item.completed,
        }}
        class="text-xl w-full text-start  transition-colors duration-400  "
      >
        {item.title}
      </label>
      <AiFillDelete
        class="h-6 w-6 fill-red-500  cursor-pointer"
        onClick={() => {
          deleteItem(item.id);
        }}
      />
    </li>
  );
}

function App() {
  const [items, setItems] = createSignal<Item[]>([]);
  const [filter, setFilter] = createSignal<ItemFilter>("all");
  const [amount, setAmount] = createSignal(1);
  let inputRef!: HTMLInputElement;

  const filterList = (items: Item[]) => {
    if (filter() === "active") return items.filter((item) => !item.completed);
    else if (filter() === "completed")
      return items.filter((item) => item.completed);
    else return items;
  };

  async function addItem() {
    try {
      await addDoc(collection(db, "list"), {
        title: inputRef.value,
        amount: amount(),
        completed: false,
      });
      setAmount(1);
      inputRef.value = "";
    } catch (err) {
      console.log(err);
    }
  }

  onSnapshot(collection(db, "list"), (collection) => {
    const items = collection.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        title: docData.title as string,
        completed: docData.completed as boolean,
        amount: docData.amount as number,
      };
    });
    setItems(items);
  });
  createEffect(() => {
    console.log(items());
  });

  return (
    <section class="shadow-lg bg-white rounded-md p-4">
      <div class="flex flex-col gap-1">
        <div class="flex">
          <input
            placeholder="Какво да купя?"
            class="border-none text-xl p-2 outline-none w-full text-center"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !!inputRef.value.trim()) {
                addItem();
              }
            }}
            autofocus
            type="text"
          />
          <button
            class="bg-green-400  w-10 flex items-center justify-center rounded-md text-xl font-semibold"
            onClick={() => {
              addItem();
            }}
            type="submit"
          >
            <FaSolidCartShopping class="fill-white" />
          </button>
        </div>
        <div class="flex h-10 justify-center">
          <div class="flex">
            <button
              disabled={amount() === 1}
              class="bg-red-400 text-white w-10 rounded-l-md"
              classList={{
                "opacity-50": amount() === 1,
              }}
              onClick={() => setAmount(amount() - 1)}
            >
              -
            </button>
            <span class="w-10 text-2xl text-gray-500 font-semibold flex justify-center items-center">
              {amount()}
            </span>
            <button
              class="bg-green-400 text-white w-10 rounded-r-md"
              onClick={() => setAmount(amount() + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <ul>
        <For
          each={filterList(
            items()
            // .sort((a, b) =>
            //   a.completed === b.completed ? 0 : a.completed ? -1 : 1
            // )
          )}
        >
          {(item) => <Item {...item} />}
        </For>
      </ul>
    </section>
  );
}

export default App;
