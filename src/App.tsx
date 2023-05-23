import { useState, useRef, useEffect } from "react";
import TodoLists from "./components/TodoLists";
import ActiveTodo from "./components/ActiveTodo";
import TodoModal from "./components/TodoModal";
import SearchCondition from "./components/SearchCondition";
import {
	doc,
	setDoc,
	collection,
	getDocs,
	addDoc,
	deleteDoc,
} from "firebase/firestore";
import db from "./firebase";

type Todo = {
	title: string;
	description: string;
	timeLimit: string;
	progress: number | null;
	id: string;
	done: boolean;
};

function App() {
	const inputEl = useRef<HTMLInputElement>(null);
	const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
	const [isSelectedTodo, setIsSelectedTodo] = useState<Todo>({
		title: "",
		description: "",
		timeLimit: "",
		progress: null,
		id: "",
		done: false,
	});
	const [formData, setFormData] = useState<Todo>({
		title: "",
		description: "",
		timeLimit: "",
		progress: null,
		id: "",
		done: false,
	});
	const [todos, setTodos] = useState<Todo[]>([]);
	const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
	const [isEditing, setIsEditing] = useState(false);

	/**フォーム内の値の変更を監視する関数です。
	 *@function
	 * @param e イベントです。
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**登録ボタンをクリックした時に発火する関数です。
	 * @function
	 * @param e フォームのイベントです
	 */
	const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		//firebaseにドキュメントを追加する
		const docRef = await addDoc(collection(db, "todos"), formData);

		setTodos([...todos, { ...formData, id: docRef.id }]);

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			progress: null,
			done: false,
			id: "",
		});
		handleModalToggle();
	};

	/**登録画面のモーダルウィンドウの表示状態を管理する関数です。
	 *@function
	 */
	const handleModalToggle = () => {
		if (isModalOpen) {
			setIsOpenModal(false);
		} else {
			setIsOpenModal(true);
		}
	};

	/**選択されたTodoのIDを管理します。
	 * @function
	 * @param todo 選択されたTodoです。
	 */
	const handleSelectTodo = (todo: Todo) => {
		setIsSelectedTodo(todo);
	};

	/**todoを削除する関数です。
	 * @function
	 * @param id 削除するtodoのidです。
	 */
	const handleDelete = (id: string) => {
		const newTodos = todos.filter((todo) => todo.id !== id);
		setTodos(newTodos);

		//firebaseのtodo削除
		deleteDoc(doc(db, "todos", id));
	};

	/**todoを編集する編集ボタンをクリックすると発火する関数です。
	 * 新規登録と同様にモーダルを開いて編集可能な状態にします。
	 * @function
	 * @param id 編集するtodoのidです。
	 */
	const handleUpdateButton = (todo: Todo) => {
		handleModalToggle();
		setIsEditing(true);
		setFormData({ ...todo });
	};

	/**
	 * 更新ボタンをクリックするとtargetTodoを更新します。
	 * @function
	 * @param targetTodo 更新対象となるtodoです。
	 */
	const handleUpdateSubmit = (e) => {
		e.preventDefault();

		console.log(e);
		console.log(e);
		const newTodos = todos.map((todo) => {
			if (isSelectedTodo.id === todo.id) {
				return formData;
			} else {
				return todo;
			}
		});
		setTodos(newTodos);
		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			progress: null,
			done: false,
			id: "",
		});
		setIsSelectedTodo({
			title: "",
			description: "",
			timeLimit: "",
			progress: null,
			id: "",
			done: false,
		});
		setIsEditing(false);
		handleModalToggle();
	};
	// 登録フォームを開いた時に、タイトルにフォーカスする。
	useEffect(() => {
		if (inputEl.current && isModalOpen) {
			inputEl.current.focus();
		}
	}, [isModalOpen]);

	//firebaseからデータを一括取得する
	useEffect(() => {
		const todoData = collection(db, "todos");
		getDocs(todoData).then((result) => {
			const todosArray: Todo[] = [];
			result.forEach((todoData) =>
				todosArray.push({
					id: todoData.id,
					title: todoData.data().title,
					description: todoData.data().description,
					progress: todoData.data().progress,
					timeLimit: todoData.data().timeLimit,
					done: todoData.data().done,
				})
			);
			setTodos(todosArray);
		});
	}, []);

	//テスト用コード
	useEffect(() => {
		console.log("todos", todos);
	}, [todos]);

	//テスト用コード
	useEffect(() => {
		console.log("isSelectedTodo:", isSelectedTodo);
	}, [isSelectedTodo]);

	return (
		<>
			<TodoModal
				isModalOpen={isModalOpen}
				handleRegisterSubmit={handleRegisterSubmit}
				handleChange={handleChange}
				formData={formData}
				inputEl={inputEl}
				isEditing={isEditing}
				handleUpdateSubmit={handleUpdateSubmit}
				isSelectedTodo={isSelectedTodo}
			/>
			<div className='flex h-screen w-full bg-slate-200'>
				<TodoLists
					todos={todos}
					handleSelectTodo={handleSelectTodo}
					isSelectedTodo={isSelectedTodo}
					handleDelete={handleDelete}
				/>
				<ActiveTodo
					isSelectedTodo={isSelectedTodo}
					handleModalToggle={handleModalToggle}
					handleUpdateButton={handleUpdateButton}
				/>
				<SearchCondition />
			</div>
		</>
	);
}

export default App;
