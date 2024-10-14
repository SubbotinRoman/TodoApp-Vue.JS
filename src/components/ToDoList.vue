<template>
  <div class="p-4 bg-white max-w-full overflow-x-hidden">
    <!-- Форма для добавления новой задачи -->
    <form @submit.prevent="addTask" class="flex mb-6">
      <input
        v-model="newTask"
        type="text"
        placeholder="Добавьте новую задачу..."
        class="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition-colors"
      >
        Добавить
      </button>
    </form>

    <!-- Список задач -->
    <ul class="max-h-96 overflow-y-auto w-full custom-scrollbar">
      <!-- Стили для списка и кастомный скроллбар -->
      <!-- Цикл по всем задачам -->
      <li
        v-for="(todo, index) in todos"
        :key="index"
        class="flex items-center justify-between p-4 mb-4 bg-gray-50 rounded-lg shadow max-w-full"
      >
        <label class="inline-flex items-center flex-1 min-w-0 cursor-pointer">
          <!-- Статус выполнения задачи -->
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleCompletion(index)"
            class="form-checkbox h-6 w-6 text-green-500 border-gray-300 rounded focus:ring-green-500 checked:bg-green-500 checked:border-transparent"
          />
          <span
            :class="{
              // Если задача завершена, применить зачеркивание и серый цвет
              'line-through text-gray-400': todo.completed,
              // Если задача не завершена, применить темно-серый цвет
              'text-gray-800': !todo.completed,
            }"
            class="ml-3 text-lg flex-grow overflow-hidden break-words max-w-full"
          >
            {{ todo.text }}
            <!-- Отображение текста задачи -->
          </span>
        </label>

        <div class="flex items-center space-x-2">
          <!-- Flex-контейнер для кнопок редактирования и удаления -->
          <!-- Обработчик для редактирования задачи -->
          <button
            @click="editTask(index)"
            class="text-blue-500 hover:text-blue-700 flex-shrink-0"
            title="Редактировать"
          >
            <i class="fas fa-edit h-6 w-6"></i>
            <!-- Иконка редактирования -->
          </button>
          <!-- Обработчик для удаления задачи -->
          <button
            @click="deleteTask(index)"
            class="text-red-500 hover:text-red-700 flex-shrink-0"
            title="Удалить"
          >
            <i class="fas fa-trash-alt h-6 w-6"></i>
            <!-- Иконка удаления -->
          </button>
        </div>
      </li>
    </ul>

    <!-- Модальное окно для редактирования задачи -->
    <!-- Условный рендеринг модального окна  -->
    <div
      v-if="isEditing"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <!-- Контейнер модального окна -->
      <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Редактировать задачу</h2>
        <input
          v-model="editedTask"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />
        <div class="flex justify-end space-x-4">
          <!-- Flex-контейнер для кнопок в модальном окне -->
          <!-- Обработчик для закрытия модального окна -->
          <button
            @click="isEditing = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Отмена
          </button>
          <!-- Обработчик для сохранения изменений -->
          <button
            @click="saveEdit"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Импорт необходимых функций из Vue
import { ref, onMounted } from 'vue';
// Импорт магазина Pinia для работы с задачами
import { useTodoStore } from '../stores/todoStore';
// Импорт функции для использования реактивных переменных из Pinia
import { storeToRefs } from 'pinia';
// Импортируем иконки из Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Создание экземпляра магазина для работы с задачами
const todoStore = useTodoStore();
// Достаем реактивный список задач из магазина
const { todos } = storeToRefs(todoStore);

// Переменная для хранения текста новой задачи
const newTask = ref('');
// Переменная для отслеживания режима редактирования
const isEditing = ref(false);
// Переменная для хранения текста редактируемой задачи
const editedTask = ref('');
// Индекс редактируемой задачи
let currentEditIndex = ref(null);

onMounted(() => {
  // Загружаем задачи из localStorage при монтировании компонента
  todoStore.loadFromLocalStorage();
});

const addTask = () => {
  // Проверка на пустой ввод, если пусто - не добавляем задачу
  if (newTask.value.trim() === '') return;
  todoStore.addTodo({
    // Текст задачи
    text: newTask.value,
    // Статус завершения задачи
    completed: false,
  });
  // Очищаем поле ввода после добавления задачи
  newTask.value = '';
};

const deleteTask = (index) => {
  // Удаление задачи по индексу
  todoStore.removeTodo(index);
};

const toggleCompletion = (index) => {
  // Переключение статуса завершения задачи
  todoStore.toggleTodoCompletion(index);
};

const editTask = (index) => {
  // Включение режима редактирования
  isEditing.value = true;
  // Установка текста для редактирования
  editedTask.value = todoStore.todos[index].text;
  // Запоминание индекса редактируемой задачи
  currentEditIndex.value = index;
};

const saveEdit = () => {
  // Проверка на пустой ввод, если пусто - не сохраняем изменения
  if (editedTask.value.trim() === '') return;
  todoStore.updateTodo(currentEditIndex.value, {
    // Копируем старую задачу
    ...todoStore.todos[currentEditIndex.value],
    // И обновляем её текст
    text: editedTask.value,
  });
  // Выключаем режим редактирования
  isEditing.value = false;
};
</script>

<style scoped>
/* Глобальный стиль для box-sizing */
*,
*::before,
*::after {
  /* Установка box-sizing для всех элементов для более предсказуемого поведения */
  box-sizing: border-box;
}

/* Скрыть горизонтальный скроллбар в списке задач */
ul {
  overflow-x: hidden;
}

/* Кастомные стили для вертикального скроллбара */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4ade80 #f3f4f6; /* Цвета: ползунок и трек */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px; /* Ширина скроллбара */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6; /* Цвет трека */
  border-radius: 4px; /* Закругление углов трека */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4ade80; /* Цвет ползунка */
  border-radius: 4px; /* Закругление углов ползунка */
}
</style>
